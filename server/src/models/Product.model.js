const { pool } = require('../config/db');

/**
 * Raw DB access for `products`, joined with `product_images` and
 * `product_variants` where needed. Controllers/services call these —
 * no SQL anywhere else. All queries use parameterized placeholders (`?`).
 */

const SORT_MAP = {
    newest: 'p.created_at DESC',
    price_asc: 'COALESCE(p.sale_price, p.price) ASC',
    price_desc: 'COALESCE(p.sale_price, p.price) DESC',
    name_asc: 'p.name ASC',
    name_desc: 'p.name DESC',
};

/**
 * Builds a WHERE clause + params array from filter params shared by
 * findAll/count, so the two stay in sync.
 */
function buildFilters(filters) {
    const conditions = ['p.is_active = TRUE'];
    const params = [];

    if (filters.category) {
        // Matches products whose category IS this slug, OR whose category's
        // parent IS this slug (so a top-level category also returns its
        // subcategories' products).
        conditions.push(`p.category_id IN (
            SELECT id FROM categories
            WHERE slug = ? OR parent_id = (SELECT id FROM categories WHERE slug = ?)
        )`);
        params.push(filters.category, filters.category);
    }

    if (filters.subcategory) {
        conditions.push(`p.category_id = (SELECT id FROM categories WHERE slug = ?)`);
        params.push(filters.subcategory);
    }

    if (filters.size || filters.color) {
        const variantConditions = ['pv.product_id = p.id'];
        if (filters.size) {
            variantConditions.push('pv.size = ?');
            params.push(filters.size);
        }
        if (filters.color) {
            variantConditions.push('pv.color = ?');
            params.push(filters.color);
        }
        conditions.push(`EXISTS (SELECT 1 FROM product_variants pv WHERE ${variantConditions.join(' AND ')})`);
    }

    if (filters.minPrice) {
        conditions.push('COALESCE(p.sale_price, p.price) >= ?');
        params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
        conditions.push('COALESCE(p.sale_price, p.price) <= ?');
        params.push(filters.maxPrice);
    }

    if (filters.tag) {
        conditions.push('p.tags LIKE ?');
        params.push(`%${filters.tag}%`);
    }

    if (filters.search) {
        conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    return { where: conditions.join(' AND '), params };
}

/** Attaches the primary (or first) image to each product in a list. */
async function attachPrimaryImages(products) {
    if (products.length === 0) return products;

    const ids = products.map((p) => p.id);
    const placeholders = ids.map(() => '?').join(',');
    const [images] = await pool.query(
        `SELECT product_id, url FROM product_images
         WHERE product_id IN (${placeholders})
         ORDER BY is_primary DESC, display_order ASC`,
        ids
    );

    const imageByProduct = new Map();
    for (const img of images) {
        if (!imageByProduct.has(img.product_id)) {
            imageByProduct.set(img.product_id, img.url);
        }
    }

    return products.map((p) => ({ ...p, image: imageByProduct.get(p.id) || null }));
}

/** Paginated, filtered product list for /shop. */
async function findAll(filters = {}) {
    const { where, params } = buildFilters(filters);
    const sortClause = SORT_MAP[filters.sort] || SORT_MAP.newest;
    const limit = Math.min(parseInt(filters.limit, 10) || 20, 100);
    const page = Math.max(parseInt(filters.page, 10) || 1, 1);
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
        `SELECT p.* FROM products p WHERE ${where} ORDER BY ${sortClause} LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    const products = await attachPrimaryImages(rows);
    return { products, page, limit };
}

/** Total count matching the same filters, for pagination metadata. */
async function count(filters = {}) {
    const { where, params } = buildFilters(filters);
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS total FROM products p WHERE ${where}`,
        params
    );
    return rows[0].total;
}

/** Full detail for the product page: base fields + all images + all variants. */
async function findBySlug(slug) {
    const [rows] = await pool.execute(
        `SELECT * FROM products WHERE slug = ? AND is_active = TRUE LIMIT 1`,
        [slug]
    );
    const product = rows[0];
    if (!product) return null;

    const [images] = await pool.execute(
        `SELECT id, url, alt_text, is_primary FROM product_images
         WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC`,
        [product.id]
    );
    const [variants] = await pool.execute(
        `SELECT id, size, color, color_hex, stock_quantity, price_adjustment
         FROM product_variants WHERE product_id = ?`,
        [product.id]
    );

    return { ...product, images, variants };
}

async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT * FROM products WHERE id = ? AND is_active = TRUE LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

/** Same category as the given product, excluding itself. */
async function findRelated(productId, limit = 8) {
    const product = await findById(productId);
    if (!product) return [];

    const [rows] = await pool.execute(
        `SELECT * FROM products
         WHERE category_id = ? AND id != ? AND is_active = TRUE
         ORDER BY created_at DESC LIMIT ?`,
        [product.category_id, productId, limit]
    );
    return attachPrimaryImages(rows);
}

/** `type`: 'featured' | 'new' | 'bestseller'. */
async function findFeatured(type = 'featured', limit = 8) {
    const columnMap = { featured: 'is_featured', new: 'is_new', bestseller: 'is_bestseller' };
    const column = columnMap[type] || 'is_featured';

    const [rows] = await pool.query(
        `SELECT * FROM products WHERE ${column} = TRUE AND is_active = TRUE
         ORDER BY created_at DESC LIMIT ?`,
        [limit]
    );
    return attachPrimaryImages(rows);
}

/** Lightweight autocomplete search — name matches only, capped small. */
async function search(query, limit = 6) {
    const [rows] = await pool.execute(
        `SELECT id, name, slug, price, sale_price FROM products
         WHERE name LIKE ? AND is_active = TRUE LIMIT ?`,
        [`%${query}%`, limit]
    );
    return attachPrimaryImages(rows);
}

module.exports = {
    findAll,
    count,
    findBySlug,
    findById,
    findRelated,
    findFeatured,
    search,
};
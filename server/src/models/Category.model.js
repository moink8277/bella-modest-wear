const { pool } = require('../config/db');

/**
 * Raw DB access for the `categories` table. Self-referencing via `parent_id`
 * (top-level categories have parent_id = NULL, subcategories point to their
 * parent's id). Controllers/services call these — no SQL anywhere else.
 */

async function findAllActive() {
    const [rows] = await pool.execute(
        `SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order ASC, name ASC`
    );
    return rows;
}

/**
 * Full nested tree: top-level categories, each with a `subcategories` array.
 * Built in-memory from a single flat query rather than N+1 queries.
 */
async function findTree() {
    const flat = await findAllActive();
    const byId = new Map(flat.map((cat) => [cat.id, { ...cat, subcategories: [] }]));
    const tree = [];

    for (const cat of byId.values()) {
        if (cat.parent_id && byId.has(cat.parent_id)) {
            byId.get(cat.parent_id).subcategories.push(cat);
        } else {
            tree.push(cat);
        }
    }

    return tree;
}

async function findBySlug(slug) {
    const [rows] = await pool.execute(
        `SELECT * FROM categories WHERE slug = ? AND is_active = TRUE LIMIT 1`,
        [slug]
    );
    return rows[0] || null;
}

async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT * FROM categories WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

async function findSubcategories(parentId) {
    const [rows] = await pool.execute(
        `SELECT * FROM categories WHERE parent_id = ? AND is_active = TRUE ORDER BY display_order ASC, name ASC`,
        [parentId]
    );
    return rows;
}

module.exports = {
    findAllActive,
    findTree,
    findBySlug,
    findById,
    findSubcategories,
};
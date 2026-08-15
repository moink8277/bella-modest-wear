import { useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProductCard from '@/components/ui/ProductCard';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import SEO from '@/components/common/SEO';
import { useFetch } from '@/hooks/useFetch';
import { useWishlist } from '@/hooks/useWishlist';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoryService';
import { PackageSearch } from 'lucide-react';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
];

/** Normalizes the API's snake_case product shape into what ProductCard expects. */
function mapProduct(p) {
    return {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        salePrice: p.sale_price ? Number(p.sale_price) : undefined,
        image: p.image,
        isNew: !!p.is_new,
        isBestseller: !!p.is_bestseller,
        inStock: p.stock_quantity > 0,
    };
}

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isInWishlist, toggleItem } = useWishlist();

    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page'), 10) || 1;

    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        if (key !== 'page') next.delete('page');
        setSearchParams(next);
    };

    const fetchProducts = useCallback(
        () => getProducts({ category: category || undefined, sort, page, limit: 12 }),
        [category, sort, page]
    );
    const { data: productsRes, isLoading, error, refetch } = useFetch(fetchProducts);

    const fetchCategories = useCallback(() => getCategories(), []);
    const { data: categoriesRes } = useFetch(fetchCategories);

    const products = useMemo(
        () => (productsRes?.data?.products || []).map(mapProduct),
        [productsRes]
    );
    const pagination = productsRes?.data?.pagination;
    const categories = categoriesRes?.data || [];

    const activeCategoryName = categories.find((c) => c.slug === category)?.name;

    return (
        <Container className="py-10 sm:py-14">
            <SEO title="Shop" path="/shop" />

            <Breadcrumb items={[{ label: 'Shop' }]} className="mb-6" />

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <h1 className="font-display text-3xl sm:text-4xl text-espresso">
                    {activeCategoryName || 'Shop All'}
                </h1>
                <div className="w-full sm:w-56">
                    <Select
                        options={SORT_OPTIONS}
                        value={sort}
                        onChange={(e) => updateParam('sort', e.target.value)}
                        aria-label="Sort products"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
                <aside className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-label text-ink-soft mb-2">
                        Categories
                    </span>
                    <button
                        type="button"
                        onClick={() => updateParam('category', '')}
                        className={`text-left text-sm py-1.5 transition-colors ${!category ? 'text-gold-dark font-medium' : 'text-ink-soft hover:text-gold-dark'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => updateParam('category', cat.slug)}
                            className={`text-left text-sm py-1.5 transition-colors ${category === cat.slug
                                    ? 'text-gold-dark font-medium'
                                    : 'text-ink-soft hover:text-gold-dark'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </aside>

                <div>
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="aspect-[3/4]" />
                            ))}
                        </div>
                    ) : error ? (
                        <ErrorState message={error.message} onRetry={refetch} />
                    ) : products.length === 0 ? (
                        <EmptyState
                            icon={PackageSearch}
                            title="No products found"
                            description="Try a different category or check back soon as we add new pieces."
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.productId}
                                        product={product}
                                        isWishlisted={isInWishlist(product.productId)}
                                        onToggleWishlist={() => toggleItem(product)}
                                    />
                                ))}
                            </div>

                            {pagination && pagination.totalPages > 1 && (
                                <Pagination
                                    page={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(p) => updateParam('page', String(p))}
                                    className="mt-10"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Container>
    );
}
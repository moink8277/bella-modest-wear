const DEFAULT_CURRENCY = 'INR';
const DEFAULT_LOCALE = 'en-IN';

export function formatPrice(amount, { currency = DEFAULT_CURRENCY } = {}) {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: 'currency',
        currency,
        maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
}

export function calcDiscountPercent(price, salePrice) {
    if (!price || !salePrice || salePrice >= price) return 0;
    return Math.floor(((price - salePrice) / price) * 100);
}
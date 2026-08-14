import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Bella Modest Wear';
const DEFAULT_DESCRIPTION =
    'Bella Modest Wear — premium modest fashion inspired by Arabian, Pakistani and Indo-Islamic elegance.';
const SITE_URL = 'https://bellamodestwear.com'; // update once the real domain is live

export default function SEO({
    title,
    description = DEFAULT_DESCRIPTION,
    path = '',
    image,
    noIndex = false,
}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Modest Luxury, Redefined`;
    const canonicalUrl = `${SITE_URL}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            {image && <meta property="og:image" content={image} />}

            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
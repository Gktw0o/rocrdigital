import { Helmet } from "react-helmet-async";

const SITE_NAME = "ROCR Digital";
const BASE_URL = "https://rocrdigital.com"; // Update with actual domain

/**
 * SEO Component - Manages meta tags for each page
 * @param {object} props
 * @param {string} props.title - Page title (will be appended with site name)
 * @param {string} props.description - Meta description (max 160 chars recommended)
 * @param {string} props.path - URL path for canonical and OG URL
 * @param {string} props.image - OG/Twitter image URL (optional)
 * @param {string} props.type - OG type (default: "website")
 * @param {boolean} props.noIndex - Set to true to prevent indexing
 */
export default function SEO({
  title,
  description,
  path = "/",
  image = "/og-image.png",
  type = "website",
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullUrl = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional SEO */}
      <meta name="theme-color" content="#00b7ff" />
      <meta name="author" content={SITE_NAME} />
    </Helmet>
  );
}

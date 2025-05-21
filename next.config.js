const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos", "res.cloudinary.com"],
  },
  i18n: null, // Disable Next.js i18n to avoid conflicts
};

module.exports = withNextIntl(nextConfig);

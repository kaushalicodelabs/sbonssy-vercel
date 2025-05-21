/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig = {
  images: {
    domains: ["picsum.photos", "res.cloudinary.com"],
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

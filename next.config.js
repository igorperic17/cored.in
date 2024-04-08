/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Setting to true somehow leads to a error on initial FeatureFlags load, leading to a temporary flash on page load
};

module.exports = nextConfig;

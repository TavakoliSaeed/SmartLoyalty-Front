/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src", "playwright-tests"],
  },
  rules: {
    'prettier/prettier': 'off', // 💥 disable prettier rule
    '@typescript-eslint/no-unused-vars': 'off', // optional
  },
};

module.exports = nextConfig;

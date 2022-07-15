/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,

  async rewrites() {
    return [
      {
        source: '/textures/:match*',
        destination:
          'https://zjexabqqcvbxwrzztznw.supabase.co/storage/v1/object/public/textures/:match*',
      },
    ];
  },
};

module.exports = nextConfig;

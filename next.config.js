/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/ps',
        destination: 'https://play.google.com/store/apps/details?id=com.slen.sgbus',
        statusCode: 301,
      },
    ]
  },
}

module.exports = nextConfig

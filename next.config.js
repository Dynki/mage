/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  }
}

module.exports = nextConfig

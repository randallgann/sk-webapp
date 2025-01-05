/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Optimizes for container deployments
  env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    },
  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

console.log('Loading next.config.js');
console.log('ENV VAR:', process.env.NEXT_PUBLIC_API_URL);

module.exports = nextConfig
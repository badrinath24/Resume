/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mammoth', 'pdf-parse', '@react-pdf/renderer'],
  },
};

export default nextConfig;

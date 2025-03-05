/** @type {import('next').NextConfig} */
//const nextConfig = {};
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
          },
        ],
      },
};
export default nextConfig;

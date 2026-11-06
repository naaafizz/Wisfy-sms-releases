/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the built site can be dropped anywhere (GitHub Pages, any static host).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

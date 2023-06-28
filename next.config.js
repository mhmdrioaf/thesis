/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "etqepmnoagiieqvwjats.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;

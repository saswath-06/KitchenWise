const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'], // Add domains for external images if needed
    },
    env: {
      BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    },
  };
  
  export default nextConfig;
  
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/cyrakade/puzzle8",
        permanent: false,
      },
    ];
  },
};


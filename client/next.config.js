/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },

  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/cyrakade/sherlck",
        permanent: false,
      },
    ];
  },
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
};









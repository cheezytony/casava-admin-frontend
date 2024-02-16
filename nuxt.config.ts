// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: ['@hebilicious/authjs-nuxt'],

  ssr: true,

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap',
          rel: 'stylesheet',
        },
      ],
      titleTemplate: (title) => {
        return title ? `${title} - Casava Admin` : 'Casava Admin';
      },
    },
  },
  css: [
    '~/assets/css/tailwind.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  components: [
    { prefix: 'Modules', path: '~/components/modules' },
    { path: '~/components/common' },
  ],
  alias: {
    cookie: 'cookie',
  },
  runtimeConfig: {
    authJs: {
      guestRedirectTo: '/login',
      authenticatedRedirectTo: '/',
      baseUrl: process.env.NUXT_NEXTAUTH_URL,
      verifyClientOnEveryRequest: true,
      secret: process.env.NUXT_NEXTAUTH_SECRET,
    },
    google: {
      clientId: process.env.NUXT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
    },
    public: {
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL,
        // verifyClientOnEveryRequest: true,
      },
      casava: {
        baseUrl: process.env.NUXT_API_CASAVA_BASE_URL,
      },
      smedan: {
        baseUrl: process.env.NUXT_API_SMEDAN_BASE_URL,
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  devServer: {
    port: 3001,
    // host: '0.0.0.0',
  },
});

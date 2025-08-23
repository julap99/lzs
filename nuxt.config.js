// https://v3.nuxtjs.org/api/configuration/nuxt.config

// nuxt.config.ts or nuxt.config.js
const isStatic = true;

export default defineNuxtConfig({
  // Enable SPA mode since we removed server-side functionality
  ssr: false,
  runtimeConfig: {
    auth: {
      secretAccess: process.env.NUXT_ACCESS_TOKEN_SECRET,
      secretRefresh: process.env.NUXT_REFRESH_TOKEN_SECRET,
    },
  },
  nitro: {
    preset: "static",
    compatibilityDate: '2025-08-13',
  },
  modules: isStatic
    ? [
        "@nuxtjs/tailwindcss",
        "@formkit/nuxt",
        "@vueuse/nuxt",
        "floating-vue/nuxt",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "nuxt-security",
        "nuxt-typed-router",
        "nuxt-icon",
        "@davestewart/nuxt-scrollbar",
      ]
    : [
        "@nuxtjs/tailwindcss",
        "@formkit/nuxt",
        "@vueuse/nuxt",
        "floating-vue/nuxt",
        "@pinia/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
        "nuxt-security",
        "nuxt-typed-router",
        "nuxt-icon",
        "@davestewart/nuxt-scrollbar",
      ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    baseURL: "/",
  },
  head: {
    title: "NAS",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Nas",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  css: ["~/assets/style/scss/main.scss"],
  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  tailwindcss: {
    cssPath: "~/assets/style/css/tailwind.css",
    configPath: "tailwind.config",
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: false,
  },
  formkit: {
    defaultConfig: true,
    config: {
      locale: 'ms',
      inputs: {
        signature: {
          type: "input",
          props: {
            type: "text",
            placeholder: "Masukkan tandatangan digital penerima...",
          },
        },
      },
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "NAS",
      short_name: "NAS",
      theme_color: "#00A59A",
      background_color: "#FAFAFA",
      display: "standalone",
      scope: "./",
      start_url: "./",
      icons: [
        {
          src: "icons/windows11/SmallTile.scale-100.png",
          sizes: "71x71",
          type: "image/png"
        },
        {
          src: "icons/windows11/SmallTile.scale-125.png",
          sizes: "89x89",
          type: "image/png"
        },
        {
          src: "icons/windows11/SmallTile.scale-150.png",
          sizes: "107x107",
          type: "image/png"
        },
        {
          src: "icons/windows11/SmallTile.scale-200.png",
          sizes: "142x142",
          type: "image/png"
        },
        {
          src: "icons/windows11/SmallTile.scale-400.png",
          sizes: "284x284",
          type: "image/png"
        },
        {
          src: "icons/windows11/Square150x150Logo.scale-100.png",
          sizes: "150x150",
          type: "image/png"
        },
        {
          src: "icons/windows11/Square150x150Logo.scale-125.png",
          sizes: "188x188",
          type: "image/png"
        },
        {
          src: "icons/windows11/Square150x150Logo.scale-150.png",
          sizes: "225x225",
          type: "image/png"
        },
        {
          src: "icons/windows11/Square150x150Logo.scale-200.png",
          sizes: "300x300",
          type: "image/png"
        },
        {
          src: "icons/windows11/Square150x150Logo.scale-400.png",
          sizes: "600x600",
          type: "image/png"
        }
      ]
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}"]
    },
    devOptions: {
      enabled: false,
      type: "module"
    }
  },
  security: {
    // GLOBAL SECURITY OPTIONS

    // Allow 200 requests per hour (the Twitter search limit). Also understands
    // 'second', 'minute', 'day', or a number of milliseconds
    rateLimiter: {
      tokensPerInterval: 200,
      interval: "minute",
      fireImmediately: false,
      throwError: true, // optional
    },
    headers: false,
  },
  routeRules: {
    "/api/devtool/**": {
      security: {
        xssValidator: false,
        requestSizeLimiter: false,
      },
    },
  },
});

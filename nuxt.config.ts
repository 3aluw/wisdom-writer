// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass','@mdi/font/css/materialdesignicons.min.css',],
    modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt','@nuxtjs/tailwindcss','@vueuse/nuxt',],
    pinia: {
      autoImports: [
        // automatically imports `defineStore`
        'defineStore', // import { defineStore } from 'pinia'
        ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
      ],
    },runtimeConfig:{
      public: {
        CONVEX_URL : process.env.CONVEX_URL,
        CONVEX_DEPLOYMENT : process.env.CONVEX_DEPLOYMENT
      }
    },
      build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})

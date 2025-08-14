// Import vue 3 plugin here
import CountryFlag from "vue-country-flag-next";

// Install the plugin
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("CountryFlag", CountryFlag);
});

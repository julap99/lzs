import VueFullscreen from "vue-fullscreen";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueFullscreen);
});

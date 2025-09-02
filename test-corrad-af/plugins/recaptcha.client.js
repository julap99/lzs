import { install } from "vue3-recaptcha-v2";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(install, {
    sitekey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    cnDomains: false,
  });
});

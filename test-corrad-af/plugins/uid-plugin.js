import { UidPlugin } from "@shimyshack/uid";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(UidPlugin);
});

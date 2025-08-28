import { Codemirror } from "vue-codemirror";

// Install plugin
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("CodeMirror", Codemirror);
});

import VueCodeHighlight from "vue-code-highlight";

import "vue-code-highlight/themes/prism-okaidia.css";
import "vue-code-highlight/themes/window.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCodeHighlight);
});

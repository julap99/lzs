import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css"; // Add css for snow theme
// import '@vueup/vue-quill/dist/vue-quill.bubble.css'; // for bubble theme

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("QuillEditor", QuillEditor);
});

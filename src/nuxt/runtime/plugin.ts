import { defineNuxtPlugin } from "nuxt/app";
import PdfViewer from "../../components/PdfViewer.vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("PdfViewer", PdfViewer);
});

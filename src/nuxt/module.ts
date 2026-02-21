import { addComponent, createResolver, defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "vue-pdf-viewer-core",
    configKey: "pdfViewer",
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.options.css = nuxt.options.css || [];
    nuxt.options.css.push(resolver.resolve("../style.css"));

    addComponent({
      name: "PdfViewer",
      export: "PdfViewer",
      filePath: "vue-pdf-viewer-core",
    });
  },
});

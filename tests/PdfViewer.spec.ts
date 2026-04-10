import { defineComponent, h, useAttrs } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { axe } from "vitest-axe";
import PdfViewer from "../src/components/PdfViewer.vue";

vi.mock("pdfjs-dist", () => {
  return {
    getDocument: () => ({
      promise: Promise.resolve({
        numPages: 1,
        getPage: async () => ({
          getViewport: () => ({ width: 600, height: 800 }),
          render: () => ({
            promise: Promise.resolve(),
            cancel: () => undefined,
          }),
        }),
        destroy: async () => undefined,
      }),
    }),
    GlobalWorkerOptions: { workerSrc: "" },
  };
});

vi.mock("pdfjs-dist/build/pdf.worker.min.mjs?url", () => ({
  default: "worker.js",
}));

describe("PdfViewer", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders and initializes without throwing", async () => {
    const wrapper = mount(PdfViewer, {
      props: { src: "https://example.com/file.pdf" },
    });

    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".lpv-scroll").exists()).toBe(true);
    expect(wrapper.find(".lpv-toolbar").exists()).toBe(true);
    expect(wrapper.find(".lpv-root").classes()).toContain("lpv-theme-auto");
    expect(wrapper.find(".lpv[role='region']").attributes("aria-label")).toBe(
      "PDF document viewer",
    );
  });

  it("applies explicit theme class from props", async () => {
    const wrapper = mount(PdfViewer, {
      props: { src: "https://example.com/file.pdf", theme: "dark" },
    });

    await Promise.resolve();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".lpv-root").classes()).toContain("lpv-theme-dark");
  });

  it("preserves PdfViewer defaults when forwarded through a Nuxt-layer style attrs wrapper", async () => {
    const LayerWrapper = defineComponent({
      inheritAttrs: false,
      setup() {
        const attrs = useAttrs();
        return () => h(PdfViewer, attrs);
      },
    });

    const wrapper = mount(LayerWrapper, {
      attrs: { src: "https://example.com/file.pdf" },
    });

    await Promise.resolve();
    await wrapper.vm.$nextTick();

    // showToolbar defaults to true in PdfViewer.
    expect(wrapper.find(".lpv-toolbar").exists()).toBe(true);
    // fitToWidth defaults to true in PdfViewer.
    expect(wrapper.find(".lpv-fit").exists()).toBe(true);
  });

  it("exposes loading status semantics", async () => {
    const wrapper = mount(PdfViewer, {
      props: { src: "https://example.com/file.pdf" },
    });

    const loadingRegion = wrapper.find(".lpv-scroll-loader");

    expect(loadingRegion.exists()).toBe(true);
    expect(loadingRegion.attributes("role")).toBe("status");
    expect(loadingRegion.attributes("aria-live")).toBe("polite");
  });

  it("has no critical axe violations", async () => {
    const wrapper = mount(PdfViewer, {
      attachTo: document.body,
      props: { src: "https://example.com/file.pdf" },
    });

    await Promise.resolve();
    await wrapper.vm.$nextTick();

    const results = await axe(wrapper.element);

    expect(results.violations).toHaveLength(0);
  });
});

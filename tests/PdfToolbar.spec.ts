import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { axe } from "vitest-axe";
import PdfToolbar from "../src/components/PdfToolbar.vue";

describe("PdfToolbar", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders basic controls", () => {
    const wrapper = mount(PdfToolbar, {
      attachTo: document.body,
      props: {
        currentPage: 1,
        totalPages: 10,
        hasMultiplePages: true,
        canGoPrev: false,
        canGoNext: true,
        zoomPercent: "100%",
        isFullscreen: false,
      },
    });

    expect(wrapper.find('button[aria-label="Previous page"]').exists()).toBe(
      true,
    );
    expect(wrapper.find('button[aria-label="Next page"]').exists()).toBe(true);
    expect(wrapper.find('button[aria-label="Zoom in"]').exists()).toBe(true);
    expect(wrapper.find('button[aria-label="Download"]').exists()).toBe(true);
    expect(wrapper.find('input[aria-label="Page number"]').exists()).toBe(true);
  });

  it("uses menu semantics and supports escape key close", async () => {
    const wrapper = mount(PdfToolbar, {
      attachTo: document.body,
      props: {
        currentPage: 2,
        totalPages: 10,
        hasMultiplePages: true,
        canGoPrev: true,
        canGoNext: true,
        zoomPercent: "125%",
        isFullscreen: false,
      },
    });

    const details = wrapper.find("details.lpv-menu");
    details.element.open = true;
    await details.trigger("toggle");
    await details.trigger("keydown", { key: "Escape" });

    expect(details.element.open).toBe(false);
    expect(wrapper.find(".lpv-menu-panel[role='menu']").exists()).toBe(true);
    expect(wrapper.find("button[role='menuitem']").exists()).toBe(true);
  });

  it("has no critical axe violations", async () => {
    const wrapper = mount(PdfToolbar, {
      attachTo: document.body,
      props: {
        currentPage: 1,
        totalPages: 10,
        hasMultiplePages: true,
        canGoPrev: false,
        canGoNext: true,
        zoomPercent: "100%",
        isFullscreen: false,
      },
    });

    const results = await axe(wrapper.element);

    expect(results.violations).toHaveLength(0);
  });
});

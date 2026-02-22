<script setup lang="ts">
import {
  ComponentPublicInstance,
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import PdfToolbar from "./PdfToolbar.vue";
import type { PdfViewerProps } from "../types";

const props = withDefaults(defineProps<PdfViewerProps>(), {
  withCredentials: false,
  initialPage: 1,
  initialScale: 1,
  fitToWidth: true,
  minScale: 0.5,
  maxScale: 3,
  zoomStep: 0.1,
  maxConcurrentRenders: 2,
  virtualWindowSize: 2,
  showToolbar: true,
});

const emit = defineEmits<{
  (event: "page-change", page: number): void;
  (event: "load-error", error: unknown): void;
  (event: "action-error", error: unknown): void;
}>();

const scrollContainerRef = ref<HTMLElement | null>(null);
const pagesContainerRef = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const errorMessage = ref("");
const actionMessage = ref("");
const totalPages = ref(0);
const currentPage = ref(props.initialPage);
const scale = ref(props.initialScale);
const isFitWidth = ref(props.fitToWidth);
const basePageHeight = ref(0);
const isFullscreen = ref(false);

let pdfjs: typeof import("pdfjs-dist") | null = null;
let pdfDocument:
  | import("pdfjs-dist/types/src/display/api").PDFDocumentProxy
  | null = null;
let currentLoadTask:
  | import("pdfjs-dist/types/src/display/api").PDFDocumentLoadingTask
  | null = null;
let renderToken = 0;
let basePageWidth = 0;
let resizeObserver: ResizeObserver | null = null;
let fullscreenListener: (() => void) | null = null;
let scrollListener: (() => void) | null = null;
let documentScrollListener: (() => void) | null = null;

const pageElements = new Map<number, HTMLElement>();
const canvasElements = new Map<number, HTMLCanvasElement>();
const renderTasks = new Map<
  number,
  import("pdfjs-dist/types/src/display/api").RenderTask
>();
const renderedPages = reactive(new Set<number>());
const renderedScale = reactive(new Map<number, number>());
const queuedPages = reactive(new Set<number>());
const pendingCanvasPages = reactive(new Set<number>());
const activeRenders = ref(0);
const currentVirtualPages = ref(new Set<number>());
const pageGapPx = ref(16);

const virtualPageNumbers = computed(() => {
  return Array.from(currentVirtualPages.value).sort((a, b) => a - b);
});

const canGoPrev = computed(() => currentPage.value > 1);
const canGoNext = computed(() => currentPage.value < totalPages.value);
const hasMultiplePages = computed(() => totalPages.value > 1);
const zoomPercent = computed(() => `${Math.round(scale.value * 100)}%`);
const estimatedPageHeight = computed(() => {
  const height = basePageHeight.value * scale.value;

  return Math.max(Math.round(height || 0), 220);
});
const topSpacerHeight = computed(() => {
  const firstVirtualPage = virtualPageNumbers.value[0];

  if (!firstVirtualPage) {
    return 0;
  }

  return Math.max(
    0,
    (firstVirtualPage - 1) * (estimatedPageHeight.value + pageGapPx.value),
  );
});
const bottomSpacerHeight = computed(() => {
  const lastVirtualPage =
    virtualPageNumbers.value[virtualPageNumbers.value.length - 1];

  if (!lastVirtualPage) {
    return 0;
  }

  return Math.max(
    0,
    (totalPages.value - lastVirtualPage) *
      (estimatedPageHeight.value + pageGapPx.value),
  );
});

const minScale = computed(() => props.minScale);
const maxScale = computed(() => props.maxScale);
const zoomStep = computed(() => props.zoomStep);
const maxConcurrentRenders = computed(() => props.maxConcurrentRenders);
const virtualWindowSize = computed(() => props.virtualWindowSize);

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function filenameFromSrc(src: string): string {
  try {
    const url = new URL(src, window.location.origin);
    const match = url.pathname.split("/").filter(Boolean).pop();

    return match || "document.pdf";
  } catch {
    return "document.pdf";
  }
}

function setPageRef(
  pageNumber: number,
  element: Element | ComponentPublicInstance | null,
): void {
  if (!(element instanceof HTMLElement)) {
    pageElements.delete(pageNumber);
    return;
  }

  pageElements.set(pageNumber, element);
}

function setCanvasRef(
  pageNumber: number,
  element: Element | ComponentPublicInstance | null,
): void {
  if (!(element instanceof HTMLCanvasElement)) {
    canvasElements.delete(pageNumber);
    return;
  }

  canvasElements.set(pageNumber, element);

  if (
    pendingCanvasPages.has(pageNumber) &&
    currentVirtualPages.value.has(pageNumber) &&
    !renderedPages.has(pageNumber)
  ) {
    pendingCanvasPages.delete(pageNumber);
    queuedPages.add(pageNumber);
    void processRenderQueue();
  }
}

function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): T {
  let timeout: number | null = null;

  return ((...args: never[]) => {
    if (timeout) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => fn(...args), delay);
  }) as T;
}

function updatePageGap(): void {
  if (!pagesContainerRef.value) {
    return;
  }

  const styles = getComputedStyle(pagesContainerRef.value);
  const parsedGap = Number.parseFloat(styles.rowGap || styles.gap || "");

  pageGapPx.value = Number.isFinite(parsedGap) ? parsedGap : 16;
}

function setupFullscreenListener(): void {
  const handler = () => {
    const element = scrollContainerRef.value;
    isFullscreen.value = !!element && document.fullscreenElement === element;
  };

  fullscreenListener = handler;
  document.addEventListener("fullscreenchange", handler);
}

function setupScrollListeners(): void {
  const handler = debounce(updateCurrentPageFromViewport, 20);

  scrollListener = () => handler();
  documentScrollListener = () => handler();

  window.addEventListener("scroll", scrollListener, { passive: true });
  document.addEventListener("scroll", documentScrollListener, {
    capture: true,
    passive: true,
  });
}

function cleanupListeners(): void {
  if (fullscreenListener) {
    document.removeEventListener("fullscreenchange", fullscreenListener);
  }
  if (scrollListener) {
    window.removeEventListener("scroll", scrollListener);
  }
  if (documentScrollListener) {
    document.removeEventListener("scroll", documentScrollListener, true);
  }
}

function setupResizeObserver(): void {
  if (!scrollContainerRef.value) {
    return;
  }

  const handler = debounce(async () => {
    updatePageGap();

    if (isFitWidth.value && totalPages.value > 0) {
      await fitToWidth();
    }

    updateCurrentPageFromViewport();
  }, 100);

  resizeObserver = new ResizeObserver(() => {
    void handler();
  });

  resizeObserver.observe(scrollContainerRef.value);
}

function cleanupResizeObserver(): void {
  resizeObserver?.disconnect();
  resizeObserver = null;
}

async function ensurePdfjs(): Promise<typeof import("pdfjs-dist")> {
  if (pdfjs) {
    return pdfjs;
  }

  const loadedPdfjs = await import("pdfjs-dist");
  const workerModule = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");

  loadedPdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
  pdfjs = loadedPdfjs;
  return loadedPdfjs;
}

async function calculateFitScale(): Promise<number> {
  if (!scrollContainerRef.value || !basePageWidth) {
    return 1;
  }

  const containerStyle = getComputedStyle(scrollContainerRef.value);
  const containerPaddingLeft =
    Number.parseFloat(containerStyle.paddingLeft) || 0;
  const containerPaddingRight =
    Number.parseFloat(containerStyle.paddingRight) || 0;
  const scrollbarWidth =
    scrollContainerRef.value.offsetWidth - scrollContainerRef.value.clientWidth;
  const fitSafetyInset = Math.max(scrollbarWidth, 0);

  const width = Math.max(
    scrollContainerRef.value.clientWidth -
      containerPaddingLeft -
      containerPaddingRight -
      fitSafetyInset,
    200,
  );

  return clamp(width / basePageWidth, minScale.value, maxScale.value);
}

async function renderPage(
  pageNumber: number,
  targetScale: number,
  token: number,
): Promise<void> {
  if (!pdfDocument) {
    return;
  }

  const canvas = canvasElements.get(pageNumber);

  if (!canvas) {
    pendingCanvasPages.add(pageNumber);
    return;
  }
  if (
    renderedScale.get(pageNumber) === targetScale &&
    renderedPages.has(pageNumber)
  ) {
    return;
  }

  const page = await pdfDocument.getPage(pageNumber);

  if (token !== renderToken) {
    return;
  }

  const viewport = page.getViewport({ scale: targetScale });
  const dpr = window.devicePixelRatio || 1;
  const canvasContext = canvas.getContext("2d");

  if (!canvasContext) {
    return;
  }

  const previousTask = renderTasks.get(pageNumber);

  if (previousTask) {
    previousTask.cancel();
    try {
      await previousTask.promise;
    } catch {
      // Expected when task is canceled due to rerender.
    }
  }

  canvas.width = Math.floor(viewport.width * dpr);
  canvas.height = Math.floor(viewport.height * dpr);
  canvas.style.width = `${viewport.width}px`;
  canvas.style.height = `${viewport.height}px`;

  const nextTask = page.render({
    canvasContext,
    viewport,
    transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
  });

  renderTasks.set(pageNumber, nextTask);

  try {
    await nextTask.promise;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name?: string }).name === "RenderingCancelledException"
    ) {
      return;
    }
    throw error;
  } finally {
    if (renderTasks.get(pageNumber) === nextTask) {
      renderTasks.delete(pageNumber);
    }
  }

  if (token === renderToken) {
    renderedPages.add(pageNumber);
    renderedScale.set(pageNumber, targetScale);
  }
}

async function cancelAllRenderTasks(): Promise<void> {
  const tasks = Array.from(renderTasks.values());

  renderTasks.clear();

  for (const task of tasks) {
    task.cancel();
  }

  for (const task of tasks) {
    try {
      await task.promise;
    } catch {
      // Expected when task is canceled due to rerender/unmount.
    }
  }
}

function queuePages(pages: number[]): void {
  for (const pageNumber of pages) {
    if (
      pageNumber > 0 &&
      pageNumber <= totalPages.value &&
      currentVirtualPages.value.has(pageNumber) &&
      !renderedPages.has(pageNumber)
    ) {
      queuedPages.add(pageNumber);
    }
  }
  void processRenderQueue();
}

async function processRenderQueue(): Promise<void> {
  while (
    queuedPages.size > 0 &&
    activeRenders.value < maxConcurrentRenders.value &&
    renderToken > 0
  ) {
    const nextPage = queuedPages.values().next().value as number | undefined;

    if (!nextPage) {
      return;
    }
    if (!currentVirtualPages.value.has(nextPage)) {
      queuedPages.delete(nextPage);
      continue;
    }

    queuedPages.delete(nextPage);
    activeRenders.value += 1;

    void renderPage(nextPage, scale.value, renderToken)
      .catch((error) => {
        console.error("[PdfViewer] page render error", error);
      })
      .finally(() => {
        activeRenders.value -= 1;
        void processRenderQueue();
      });
  }
}

function primeVisiblePages(centerPage: number): void {
  const radius = virtualWindowSize.value;
  const nearby = Array.from(
    { length: radius * 2 + 1 },
    (_, i) => centerPage - radius + i,
  );

  queuePages(nearby);
}

function clearPageCanvas(pageNumber: number): void {
  const canvas = canvasElements.get(pageNumber);

  if (!canvas) {
    return;
  }

  canvas.width = 0;
  canvas.height = 0;
  canvas.style.width = "";
  canvas.style.height = "";
}

function syncVirtualWindow(centerPage: number): void {
  const radius = virtualWindowSize.value;
  const nextVirtualPages = new Set<number>();

  for (
    let page = Math.max(1, centerPage - radius);
    page <= Math.min(totalPages.value, centerPage + radius);
    page += 1
  ) {
    nextVirtualPages.add(page);
  }

  currentVirtualPages.value = nextVirtualPages;

  for (const page of Array.from(queuedPages)) {
    if (!nextVirtualPages.has(page)) {
      queuedPages.delete(page);
      pendingCanvasPages.delete(page);
    }
  }

  for (const [page, task] of renderTasks.entries()) {
    if (!nextVirtualPages.has(page)) {
      task.cancel();
      renderTasks.delete(page);
    }
  }

  for (const page of Array.from(renderedPages)) {
    if (!nextVirtualPages.has(page)) {
      clearPageCanvas(page);
      renderedPages.delete(page);
      renderedScale.delete(page);
    }
  }

  primeVisiblePages(centerPage);
}

function updateCurrentPageFromViewport(): void {
  if (!totalPages.value || !scrollContainerRef.value) {
    return;
  }

  const viewportAnchor = 140;
  const containerTop = scrollContainerRef.value.getBoundingClientRect().top;
  const offsetInContainer = Math.max(0, viewportAnchor - containerTop);
  const pageSpan = Math.max(estimatedPageHeight.value + pageGapPx.value, 1);
  const resolvedPage = clamp(
    Math.floor(offsetInContainer / pageSpan) + 1,
    1,
    totalPages.value || 1,
  );
  currentPage.value = resolvedPage;
}

async function setScale(nextScale: number, fitWidth: boolean): Promise<void> {
  isFitWidth.value = fitWidth;
  scale.value = clamp(nextScale, minScale.value, maxScale.value);
  renderToken += 1;
  await cancelAllRenderTasks();
  renderedPages.clear();
  renderedScale.clear();
  queuedPages.clear();
  syncVirtualWindow(currentPage.value);
}

async function fitToWidth(): Promise<void> {
  const fitScale = await calculateFitScale();

  await setScale(fitScale, true);
}

async function loadPdf(): Promise<void> {
  actionMessage.value = "";
  errorMessage.value = "";
  isLoading.value = true;

  renderToken += 1;
  await cancelAllRenderTasks();

  if (currentLoadTask) {
    currentLoadTask.destroy();
    currentLoadTask = null;
  }

  if (pdfDocument) {
    await pdfDocument.destroy();
    pdfDocument = null;
  }

  totalPages.value = 0;
  currentPage.value = clamp(props.initialPage, 1, totalPages.value || 1);
  basePageHeight.value = 0;
  pageElements.clear();
  canvasElements.clear();
  renderedPages.clear();
  renderedScale.clear();
  queuedPages.clear();
  pendingCanvasPages.clear();
  currentVirtualPages.value = new Set();

  try {
    const pdfLib = await ensurePdfjs();

    currentLoadTask = pdfLib.getDocument({
      url: props.src,
      withCredentials: props.withCredentials,
    });
    const loadedDocument = await currentLoadTask.promise;

    pdfDocument = loadedDocument;
    totalPages.value = loadedDocument.numPages;

    const firstPage = await loadedDocument.getPage(1);
    const firstViewport = firstPage.getViewport({ scale: 1 });

    basePageWidth = firstViewport.width;
    basePageHeight.value = firstViewport.height;

    await nextTick();
    updatePageGap();

    if (props.fitToWidth) {
      scale.value = await calculateFitScale();
      isFitWidth.value = true;
    } else {
      scale.value = clamp(props.initialScale, minScale.value, maxScale.value);
      isFitWidth.value = false;
    }

    currentPage.value = clamp(props.initialPage, 1, totalPages.value || 1);

    renderToken += 1;
    syncVirtualWindow(currentPage.value);
  } catch (error) {
    errorMessage.value = "Unable to load this PDF right now.";
    emit("load-error", error);
    console.error("[PdfViewer] load error", error);
  } finally {
    isLoading.value = false;
  }
}

async function zoomIn(): Promise<void> {
  await setScale(scale.value + zoomStep.value, false);
}

async function zoomOut(): Promise<void> {
  await setScale(scale.value - zoomStep.value, false);
}

async function goToPage(pageNumber: number): Promise<void> {
  if (!totalPages.value) {
    return;
  }

  const clampedPage = clamp(pageNumber, 1, totalPages.value);

  syncVirtualWindow(clampedPage);
  await nextTick();

  const element = pageElements.get(clampedPage);
  element?.scrollIntoView({ behavior: "auto", block: "start" });
  currentPage.value = clampedPage;
  updateCurrentPageFromViewport();
}

async function goToPrevPage(): Promise<void> {
  if (!canGoPrev.value) {
    return;
  }

  await goToPage(currentPage.value - 1);
}

async function goToNextPage(): Promise<void> {
  if (!canGoNext.value) {
    return;
  }

  await goToPage(currentPage.value + 1);
}

async function goToFirstPage(): Promise<void> {
  await goToPage(1);
}

async function goToLastPage(): Promise<void> {
  await goToPage(totalPages.value || 1);
}

async function toBlobUrl(): Promise<{ blobUrl: string; filename: string }> {
  let blob: Blob;

  if (pdfDocument) {
    const bytes = await pdfDocument.getData();
    const copiedBytes = Uint8Array.from(bytes);

    blob = new Blob([copiedBytes], { type: "application/pdf" });
  } else {
    const response = await fetch(props.src, {
      credentials: props.withCredentials ? "include" : "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Failed PDF fetch: ${response.status}`);
    }

    blob = await response.blob();
  }

  const blobUrl = URL.createObjectURL(blob);
  const filename = filenameFromSrc(props.src);

  return { blobUrl, filename };
}

async function downloadPdf(): Promise<void> {
  actionMessage.value = "";

  try {
    const { blobUrl, filename } = await toBlobUrl();
    const anchor = document.createElement("a");

    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    console.error("[PdfViewer] download error", error);
    actionMessage.value = "Unable to download this PDF right now.";
    emit("action-error", error);
  }
}

async function printPdf(): Promise<void> {
  actionMessage.value = "";

  try {
    const { blobUrl } = await toBlobUrl();
    const existingFrame = document.getElementById("lpv-print-frame");

    if (existingFrame) {
      existingFrame.remove();
    }

    const printFrame = document.createElement("iframe");

    printFrame.id = "lpv-print-frame";
    printFrame.style.position = "fixed";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    printFrame.style.opacity = "0";

    printFrame.onload = () => {
      const frameWindow = printFrame.contentWindow;

      if (!frameWindow) {
        actionMessage.value = "Unable to open print preview right now.";
        emit("action-error", new Error("Unable to open print preview."));
        URL.revokeObjectURL(blobUrl);
        printFrame.remove();
        return;
      }

      setTimeout(() => {
        frameWindow.focus();
        frameWindow.print();
      }, 150);

      const cleanup = () => {
        URL.revokeObjectURL(blobUrl);
        printFrame.remove();
      };

      setTimeout(cleanup, 2000);
    };

    printFrame.src = blobUrl;
    document.body.appendChild(printFrame);
  } catch (error) {
    console.error("[PdfViewer] print error", error);
    actionMessage.value = "Unable to open print preview right now.";
    emit("action-error", error);
  }
}

async function zoomToPercent(percent: number): Promise<void> {
  await setScale(percent / 100, false);
}

async function toggleFullscreen(): Promise<void> {
  const element = scrollContainerRef.value;
  if (!element) {
    return;
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await element.requestFullscreen();
  }
}

watch(
  () => props.src,
  async () => {
    await loadPdf();
    updateCurrentPageFromViewport();
  },
  { immediate: true },
);

watch(
  () => props.fitToWidth,
  (value) => {
    isFitWidth.value = value;
  },
);

watch(currentPage, (page) => {
  if (totalPages.value > 0) {
    if (!currentVirtualPages.value.has(page)) {
      syncVirtualWindow(page);
    }
    emit("page-change", page);
  }
});

onMounted(() => {
  void nextTick(() => {
    updatePageGap();
  });

  setupResizeObserver();
  setupFullscreenListener();
  setupScrollListeners();
});

onBeforeUnmount(async () => {
  renderToken += 1;
  await cancelAllRenderTasks();

  if (currentLoadTask) {
    currentLoadTask.destroy();
    currentLoadTask = null;
  }

  if (pdfDocument) {
    await pdfDocument.destroy();
    pdfDocument = null;
  }

  cleanupResizeObserver();
  cleanupListeners();
});
</script>

<template>
  <div class="lpv-root">
    <section class="lpv" :class="{ 'lpv-fit': isFitWidth }">
      <PdfToolbar
        v-if="props.showToolbar"
        :can-go-next="canGoNext"
        :can-go-prev="canGoPrev"
        :current-page="currentPage"
        :has-multiple-pages="hasMultiplePages"
        :is-fullscreen="isFullscreen"
        :total-pages="totalPages"
        :zoom-percent="zoomPercent"
        @commit-page="goToPage"
        @download="downloadPdf"
        @first-page="goToFirstPage"
        @fit-width="fitToWidth"
        @last-page="goToLastPage"
        @next-page="goToNextPage"
        @prev-page="goToPrevPage"
        @print="printPdf"
        @toggle-fullscreen="toggleFullscreen"
        @zoom-100="zoomToPercent(100)"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
      />

      <p v-if="actionMessage" class="lpv-message">{{ actionMessage }}</p>
      <p v-if="errorMessage" class="lpv-message lpv-message-error">
        {{ errorMessage }}
      </p>
      <div
        ref="scrollContainerRef"
        aria-live="polite"
        :class="['lpv-scroll', { 'lpv-scroll-loading': isLoading }]"
        role="region"
      >
        <div v-if="isLoading" class="lpv-loading-overlay" aria-live="polite">
          <span aria-hidden="true" class="lpv-spinner"></span>
          Loading PDF...
        </div>
        <div ref="pagesContainerRef" class="lpv-pages">
          <div
            aria-hidden="true"
            class="lpv-spacer"
            :style="{ height: `${topSpacerHeight}px` }"
          ></div>
          <div
            v-for="pageNumber in virtualPageNumbers"
            :key="pageNumber"
            :ref="(el) => setPageRef(pageNumber, el)"
            class="lpv-page"
            :data-page-number="pageNumber"
            :style="{ minHeight: `${estimatedPageHeight}px` }"
          >
            <canvas
              :ref="(el) => setCanvasRef(pageNumber, el)"
              class="lpv-canvas"
            />
          </div>
          <div
            aria-hidden="true"
            class="lpv-spacer"
            :style="{ height: `${bottomSpacerHeight}px` }"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

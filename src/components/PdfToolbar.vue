<script setup lang="ts">
import { ref, watch } from "vue";
import type { PdfToolbarProps } from "../types";
import Icon from "./Icon.vue";

const props = defineProps<PdfToolbarProps>();

const emit = defineEmits([
  "first-page",
  "prev-page",
  "commit-page",
  "next-page",
  "zoom-out",
  "fit-width",
  "zoom-in",
  "download",
  "print",
  "toggle-fullscreen",
  "zoom-100",
  "last-page",
]);

const pageInput = ref(1);
const menuRef = ref<HTMLDetailsElement | null>(null);
const tooltip = ref<{ text: string; x: number; y: number; visible: boolean }>({
  text: "",
  x: 0,
  y: 0,
  visible: false,
});

watch(
  () => props.currentPage,
  (value) => {
    pageInput.value = value;
  },
  { immediate: true },
);

function commitPageInput(): void {
  emit("commit-page", pageInput.value);
}

function showTooltip(event: Event, text: string): void {
  const target = event.currentTarget;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const rect = target.getBoundingClientRect();
  tooltip.value = {
    text,
    x: rect.left + rect.width / 2,
    y: rect.bottom + 8,
    visible: true,
  };
}

function hideTooltip(): void {
  tooltip.value = { ...tooltip.value, visible: false };
}

function closeMenu(): void {
  if (menuRef.value) {
    menuRef.value.open = false;
  }
}
</script>

<template>
  <header class="lpv-toolbar">
    <div class="lpv-group-nav-wrap">
      <div class="lpv-group lpv-group-nav">
        <button
          v-if="hasMultiplePages"
          aria-label="First page"
          class="lpv-icon-btn lpv-first-last"
          :disabled="!canGoPrev"
          type="button"
          data-tooltip="Back to top"
          @mouseenter="(event) => showTooltip(event, 'Back to top')"
          @focus="(event) => showTooltip(event, 'Back to top')"
          @mouseleave="hideTooltip"
          @blur="hideTooltip"
          @click="emit('first-page')"
        >
          <Icon name="chevrons-up" />
        </button>
        <button
          v-if="hasMultiplePages"
          aria-label="Previous page"
          class="lpv-icon-btn"
          :disabled="!canGoPrev"
          type="button"
          data-tooltip="Previous page"
          @mouseenter="(event) => showTooltip(event, 'Previous page')"
          @focus="(event) => showTooltip(event, 'Previous page')"
          @mouseleave="hideTooltip"
          @blur="hideTooltip"
          @click="emit('prev-page')"
        >
          <Icon name="chevron-up" />
        </button>
        <input
          v-if="hasMultiplePages"
          v-model.number="pageInput"
          class="lpv-page-input"
          :max="totalPages || 1"
          min="1"
          type="number"
          @blur="commitPageInput"
          @keyup.enter="commitPageInput"
        />
        <span class="lpv-page-total">
          {{ hasMultiplePages ? `of ${totalPages || 1}` : "1 of 1" }}
        </span>
        <button
          v-if="hasMultiplePages"
          aria-label="Next page"
          class="lpv-icon-btn"
          :disabled="!canGoNext"
          type="button"
          data-tooltip="Next page"
          @mouseenter="(event) => showTooltip(event, 'Next page')"
          @focus="(event) => showTooltip(event, 'Next page')"
          @mouseleave="hideTooltip"
          @blur="hideTooltip"
          @click="emit('next-page')"
        >
          <Icon name="chevron-down" />
        </button>
      </div>
    </div>
    <div class="lpv-group lpv-group-zoom">
      <button
        aria-label="Zoom out"
        class="lpv-icon-btn"
        type="button"
        data-tooltip="Zoom out"
        @mouseenter="(event) => showTooltip(event, 'Zoom out')"
        @focus="(event) => showTooltip(event, 'Zoom out')"
        @mouseleave="hideTooltip"
        @blur="hideTooltip"
        @click="emit('zoom-out')"
      >
        <Icon name="zoom-out" />
      </button>
      <button
        aria-label="Fit to width"
        class="lpv-scale-btn"
        type="button"
        data-tooltip="Fit to width"
        @mouseenter="(event) => showTooltip(event, 'Fit to width')"
        @focus="(event) => showTooltip(event, 'Fit to width')"
        @mouseleave="hideTooltip"
        @blur="hideTooltip"
        @click="emit('fit-width')"
      >
        {{ zoomPercent }}
      </button>
      <button
        aria-label="Zoom in"
        class="lpv-icon-btn"
        type="button"
        data-tooltip="Zoom in"
        @mouseenter="(event) => showTooltip(event, 'Zoom in')"
        @focus="(event) => showTooltip(event, 'Zoom in')"
        @mouseleave="hideTooltip"
        @blur="hideTooltip"
        @click="emit('zoom-in')"
      >
        <Icon name="zoom-in" />
      </button>
    </div>
    <div class="lpv-group lpv-group-actions">
      <button
        aria-label="Download"
        class="lpv-icon-btn lpv-action-primary"
        type="button"
        data-tooltip="Download"
        @mouseenter="(event) => showTooltip(event, 'Download')"
        @focus="(event) => showTooltip(event, 'Download')"
        @mouseleave="hideTooltip"
        @blur="hideTooltip"
        @click="emit('download')"
      >
        <Icon name="download" />
      </button>
      <button
        aria-label="Print"
        class="lpv-icon-btn lpv-desktop-action"
        type="button"
        data-tooltip="Print"
        @mouseenter="(event) => showTooltip(event, 'Print')"
        @focus="(event) => showTooltip(event, 'Print')"
        @mouseleave="hideTooltip"
        @blur="hideTooltip"
        @click="emit('print')"
      >
        <Icon name="printer" />
      </button>
      <button
        :aria-label="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        class="lpv-icon-btn lpv-desktop-action"
        type="button"
        :data-tooltip="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
        @mouseenter="
          (event) =>
            showTooltip(event, isFullscreen ? 'Exit fullscreen' : 'Fullscreen')
        "
        @focus="
          (event) =>
            showTooltip(event, isFullscreen ? 'Exit fullscreen' : 'Fullscreen')
        "
        @mouseleave="hideTooltip"
        @blur="hideTooltip"
        @click="emit('toggle-fullscreen')"
      >
        <Icon name="expand" />
      </button>

      <details ref="menuRef" class="lpv-menu">
        <summary
          class="lpv-icon-btn"
          aria-label="More options"
          data-tooltip="More options"
          @mouseenter="(event) => showTooltip(event, 'More options')"
          @focus="(event) => showTooltip(event, 'More options')"
          @mouseleave="hideTooltip"
          @blur="hideTooltip"
        >
          <Icon name="ellipsis-vertical" :size="20" :stroke-width="2.5" />
        </summary>
        <div class="lpv-menu-panel">
          <button
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('download');
              }
            "
          >
            Download
          </button>
          <button
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('print');
              }
            "
          >
            Print
          </button>
          <button
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('toggle-fullscreen');
              }
            "
          >
            {{ isFullscreen ? "Exit fullscreen" : "Fullscreen" }}
          </button>
          <button
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('fit-width');
              }
            "
          >
            Fit to width
          </button>
          <button
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('zoom-100');
              }
            "
          >
            Zoom to 100%
          </button>
          <button
            v-if="hasMultiplePages"
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('first-page');
              }
            "
          >
            First page
          </button>
          <button
            v-if="hasMultiplePages"
            class="lpv-menu-item"
            type="button"
            @click="
              () => {
                closeMenu();
                emit('last-page');
              }
            "
          >
            Last page
          </button>
        </div>
      </details>
    </div>
    <div
      v-if="tooltip.visible"
      class="lpv-tooltip-panel"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
      role="tooltip"
    >
      {{ tooltip.text }}
    </div>
  </header>
</template>

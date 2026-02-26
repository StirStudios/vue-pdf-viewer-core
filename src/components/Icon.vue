<script setup lang="ts">
const props = defineProps<{
  name:
    | "chevrons-up"
    | "chevron-up"
    | "chevron-down"
    | "zoom-out"
    | "zoom-in"
    | "scan"
    | "scan-line"
    | "download"
    | "printer"
    | "expand"
    | "ellipsis-vertical"
    | "alert-triangle";
  size?: number;
  strokeWidth?: number;
}>();

const icons: Record<string, Array<[string, Record<string, string>]>> = {
  "chevrons-up": [
    ["path", { d: "m17 11-5-5-5 5" }],
    ["path", { d: "m17 18-5-5-5 5" }],
  ],
  "chevron-up": [["path", { d: "m18 15-6-6-6 6" }]],
  "chevron-down": [["path", { d: "m6 9 6 6 6-6" }]],
  "zoom-out": [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
    ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }],
  ],
  "zoom-in": [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
    ["line", { x1: "11", x2: "11", y1: "8", y2: "14" }],
    ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }],
  ],
  scan: [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ],
  "scan-line": [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M7 12h10" }],
  ],
  download: [
    ["path", { d: "M12 15V3" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "m7 10 5 5 5-5" }],
  ],
  printer: [
    [
      "path",
      {
        d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      },
    ],
    ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }],
    ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1" }],
  ],
  expand: [
    ["path", { d: "m15 15 6 6" }],
    ["path", { d: "m15 9 6-6" }],
    ["path", { d: "M21 16v5h-5" }],
    ["path", { d: "M21 8V3h-5" }],
    ["path", { d: "M3 16v5h5" }],
    ["path", { d: "m3 21 6-6" }],
    ["path", { d: "M3 8V3h5" }],
    ["path", { d: "M9 9 3 3" }],
  ],
  "ellipsis-vertical": [
    ["circle", { cx: "12", cy: "12", r: "1" }],
    ["circle", { cx: "12", cy: "5", r: "1" }],
    ["circle", { cx: "12", cy: "19", r: "1" }],
  ],
  "alert-triangle": [
    [
      "path",
      {
        d: "m10.29 3.86-7.4 13.2A2 2 0 0 0 4.63 20h14.74a2 2 0 0 0 1.74-2.94l-7.4-13.2a2 2 0 0 0-3.42 0Z",
      },
    ],
    ["line", { x1: "12", x2: "12", y1: "9", y2: "13" }],
    ["line", { x1: "12", x2: "12.01", y1: "17", y2: "17" }],
  ],
};
</script>

<template>
  <svg
    :width="props.size ?? 18"
    :height="props.size ?? 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="props.strokeWidth ?? 2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <component
      :is="node[0]"
      v-for="(node, index) in icons[props.name]"
      :key="`${props.name}-${index}`"
      v-bind="node[1]"
    />
  </svg>
</template>

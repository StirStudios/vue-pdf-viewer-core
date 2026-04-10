<script setup lang="ts">
import { ref, watch } from "vue";

type ThemeMode = "light" | "dark";
type DocMode = "single" | "multi";
type ScenarioMode = "ready" | "loading" | "error";

const mode = ref<ThemeMode>("light");
const docMode = ref<DocMode>("multi");
const scenario = ref<ScenarioMode>("ready");
const pdfUrl = ref("");
const inputUrl = ref("");

function resolveReadyUrl(doc: DocMode): string {
  return doc === "single"
    ? "https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf"
    : "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
}

function resolveScenarioUrl(nextScenario: ScenarioMode, doc: DocMode): string {
  const stamp = Date.now();

  if (nextScenario === "loading") {
    return `/api/loading-pdf?t=${stamp}`;
  }

  if (nextScenario === "error") {
    return `/missing-${stamp}.pdf`;
  }

  return resolveReadyUrl(doc);
}

function syncUrlFromState(): void {
  const url = resolveScenarioUrl(scenario.value, docMode.value);
  pdfUrl.value = url;
  inputUrl.value = url;
}

function applyUrl(): void {
  pdfUrl.value = inputUrl.value;
}

watch(
  [scenario, docMode],
  () => {
    syncUrlFromState();
  },
  { immediate: true },
);
</script>

<template>
  <main class="app">
    <section class="hero">
      <h1>Nuxt 4 Playground</h1>
      <p>State lab for single, multi, loading, and error scenarios.</p>
    </section>

    <section class="state-lab">
      <div class="lab-group">
        <span class="lab-label">Theme</span>
        <div class="chip-row" role="radiogroup" aria-label="Viewer theme">
          <button
            class="chip"
            :class="{ active: mode === 'light' }"
            type="button"
            role="radio"
            :aria-checked="mode === 'light'"
            @click="mode = 'light'"
          >
            Light
          </button>
          <button
            class="chip"
            :class="{ active: mode === 'dark' }"
            type="button"
            role="radio"
            :aria-checked="mode === 'dark'"
            @click="mode = 'dark'"
          >
            Dark
          </button>
        </div>
      </div>

      <div class="lab-group">
        <span class="lab-label">Document</span>
        <div class="chip-row" role="radiogroup" aria-label="Document mode">
          <button
            class="chip"
            :class="{ active: docMode === 'single' }"
            type="button"
            role="radio"
            :aria-checked="docMode === 'single'"
            @click="docMode = 'single'"
          >
            Single
          </button>
          <button
            class="chip"
            :class="{ active: docMode === 'multi' }"
            type="button"
            role="radio"
            :aria-checked="docMode === 'multi'"
            @click="docMode = 'multi'"
          >
            Multi
          </button>
        </div>
      </div>

      <div class="lab-group">
        <span class="lab-label">Scenario</span>
        <div class="chip-row" role="radiogroup" aria-label="Scenario mode">
          <button
            class="chip"
            :class="{ active: scenario === 'ready' }"
            type="button"
            role="radio"
            :aria-checked="scenario === 'ready'"
            @click="scenario = 'ready'"
          >
            Ready
          </button>
          <button
            class="chip"
            :class="{ active: scenario === 'loading' }"
            type="button"
            role="radio"
            :aria-checked="scenario === 'loading'"
            @click="scenario = 'loading'"
          >
            Loading
          </button>
          <button
            class="chip"
            :class="{ active: scenario === 'error' }"
            type="button"
            role="radio"
            :aria-checked="scenario === 'error'"
            @click="scenario = 'error'"
          >
            Error
          </button>
        </div>
      </div>
    </section>

    <section class="controls">
      <input
        v-model="inputUrl"
        class="input"
        type="url"
        placeholder="Paste a PDF URL"
      />
      <button class="button" type="button" @click="applyUrl">Load URL</button>
    </section>

    <section class="viewer-card" :class="{ dark: mode === 'dark' }">
      <ClientOnly>
        <PdfViewer
          :key="`${mode}-${docMode}-${scenario}-${pdfUrl}`"
          :src="pdfUrl"
          :theme="mode"
          :max-scale="5"
        />
      </ClientOnly>
    </section>
  </main>
</template>

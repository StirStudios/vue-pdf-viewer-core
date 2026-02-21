<script setup lang="ts">
import { ref } from "vue";
import { PdfViewer } from "vue-pdf-viewer-core";
import "vue-pdf-viewer-core/style.css";

const sampleUrl =
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
const pdfUrl = ref(sampleUrl);
const inputUrl = ref(sampleUrl);

function applyUrl(): void {
  pdfUrl.value = inputUrl.value;
}
</script>

<template>
  <div class="app">
    <section class="hero">
      <h1>Vue PDF Viewer Core</h1>
      <p>
        Lightweight, fast PDF viewing for Vue 3 and Nuxt 4. Try a PDF URL below
        or paste your own.
      </p>
    </section>

    <section class="controls">
      <input
        v-model="inputUrl"
        class="input"
        type="url"
        placeholder="Paste a PDF URL"
      />
      <button class="button" type="button" @click="applyUrl">Load PDF</button>
    </section>

    <section class="viewer-card">
      <PdfViewer :src="pdfUrl" />
    </section>
  </div>
</template>

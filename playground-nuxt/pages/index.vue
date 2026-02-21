<script setup lang="ts">
import { ref } from "vue";

const sampleUrl =
  "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";
const pdfUrl = ref(sampleUrl);
const inputUrl = ref(sampleUrl);

function applyUrl(): void {
  pdfUrl.value = inputUrl.value;
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <h1>Nuxt 4 Playground</h1>
      <p>Try the viewer module with a public PDF.</p>
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
      <ClientOnly>
        <PdfViewer :src="pdfUrl" />
      </ClientOnly>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 2rem 1.5rem 3rem;
  background: #f4f2ee;
  color: #141414;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: "Space Grotesk", system-ui, sans-serif;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero h1 {
  margin: 0;
  font-size: clamp(2rem, 2vw + 1.5rem, 3rem);
}

.hero p {
  margin: 0;
  color: #3f3f3f;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.input {
  flex: 1 1 18rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d9d4cf;
  font-size: 0.95rem;
}

.button {
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: 0;
  background: #1f1f1f;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}

.viewer-card {
  background: #fffaf3;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 45px rgb(0 0 0 / 10%);
}
</style>

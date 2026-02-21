import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PdfViewer from '../src/components/PdfViewer.vue'

vi.mock('pdfjs-dist', () => {
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
    GlobalWorkerOptions: { workerSrc: '' },
  }
})

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'worker.js',
}))

describe('PdfViewer', () => {
  it('renders and initializes without throwing', async () => {
    const wrapper = mount(PdfViewer, {
      props: { src: 'https://example.com/file.pdf' },
    })

    await Promise.resolve()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.lpv-scroll').exists()).toBe(true)
    expect(wrapper.find('.lpv-toolbar').exists()).toBe(true)
  })
})

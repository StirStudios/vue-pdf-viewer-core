import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PdfToolbar from '../src/components/PdfToolbar.vue'

describe('PdfToolbar', () => {
  it('renders basic controls', () => {
    const wrapper = mount(PdfToolbar, {
      props: {
        currentPage: 1,
        totalPages: 10,
        hasMultiplePages: true,
        canGoPrev: false,
        canGoNext: true,
        zoomPercent: '100%',
        isFullscreen: false,
      },
    })

    expect(wrapper.find('button[aria-label="Previous page"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Next page"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Zoom in"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Download"]').exists()).toBe(true)
  })
})

export interface PdfViewerProps {
  src: string;
  withCredentials?: boolean;
  initialPage?: number;
  initialScale?: number;
  fitToWidth?: boolean;
  minScale?: number;
  maxScale?: number;
  zoomStep?: number;
  maxConcurrentRenders?: number;
  virtualWindowSize?: number;
  showToolbar?: boolean;
  theme?: "auto" | "light" | "dark";
  /**
   * Document title used to prefix the viewer's accessible names, so several
   * viewers on one page expose unique landmarks.
   */
  title?: string;
}

export interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  hasMultiplePages: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  zoomPercent: string;
  isFullscreen: boolean;
  label?: string;
}

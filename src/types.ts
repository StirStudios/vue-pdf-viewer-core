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
}

export interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  hasMultiplePages: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  zoomPercent: string;
  isFullscreen: boolean;
}

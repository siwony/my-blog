// PhotoSwipe Bundle Entry Point
// 두 ESM 모듈을 하나로 번들링하여 request chaining 제거
import PhotoSwipeLightbox from './photoswipe/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from './photoswipe/photoswipe.esm.min.js';

// 전역으로 노출 (image-viewer.js에서 사용)
window.PhotoSwipeLightbox = PhotoSwipeLightbox;
window.PhotoSwipe = PhotoSwipe;

/**
 * Image Viewer - PhotoSwipe 5 기반 이미지 라이트박스
 * 포스트 내 이미지를 클릭하면 확대/갤러리 슬라이드 기능 제공
 * 
 * 기능:
 * - 이미지 클릭 시 전체화면 확대
 * - 좌우 슬라이드로 이미지 탐색
 * - alt 텍스트를 캡션으로 표시
 * - 핀치 줌, 키보드 네비게이션 지원
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // PhotoSwipe 로드 확인 후 초기화
    if (typeof window.PhotoSwipeLightbox === 'undefined') {
      console.warn('Image Viewer: PhotoSwipe Lightbox not loaded');
      return;
    }
    initImageViewer();
  });

  function initImageViewer() {
    // 포스트 콘텐츠 영역 선택
    const contentSelectors = [
      '.post-content',
      '.content',
      'article',
      '.markdown-body'
    ];

    let contentArea = null;
    for (const selector of contentSelectors) {
      contentArea = document.querySelector(selector);
      if (contentArea) break;
    }

    if (!contentArea) {
      return;
    }

    // 이미지 수집 (code 블록 내 이미지, 아이콘 등 제외)
    const images = contentArea.querySelectorAll(
      'img:not(pre img):not(code img):not(.pswp__img):not(.icon):not([width="16"]):not([width="24"]):not([height="16"]):not([height="24"])'
    );
    
    if (images.length === 0) {
      return;
    }

    // 갤러리 데이터 생성
    const galleryItems = [];
    
    images.forEach((img, index) => {
      // 이미지 로드 완료 후 원본 크기 가져오기
      const setupImage = () => {
        const width = img.naturalWidth || img.width || 1200;
        const height = img.naturalHeight || img.height || 800;
        
        galleryItems[index] = {
          src: img.src,
          width: width,
          height: height,
          alt: img.alt || '',
          element: img
        };
      };

      if (img.complete) {
        setupImage();
      } else {
        img.addEventListener('load', setupImage);
        // 초기값 설정
        galleryItems[index] = {
          src: img.src,
          width: 1200,
          height: 800,
          alt: img.alt || '',
          element: img
        };
      }

      // 이미지에 클릭 이벤트 및 데이터 속성 추가
      img.dataset.pswpIndex = index;
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', img.alt ? '이미지 확대: ' + img.alt : '이미지 확대');
      
      // 클릭 이벤트
      img.addEventListener('click', function(e) {
        e.preventDefault();
        openGallery(parseInt(this.dataset.pswpIndex, 10));
      });

      // 키보드 접근성 (Enter, Space)
      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGallery(parseInt(this.dataset.pswpIndex, 10));
        }
      });
    });

    // PhotoSwipe Lightbox로 갤러리 열기
    function openGallery(index) {
      const lightbox = new window.PhotoSwipeLightbox({
        dataSource: galleryItems,
        pswpModule: window.PhotoSwipe,
        
        // 애니메이션
        showHideAnimationType: 'zoom',
        
        // UI 옵션
        arrowKeys: true,
        escKey: true,
        closeOnVerticalDrag: true,
        
        // 줌 옵션
        initialZoomLevel: 'fit',
        secondaryZoomLevel: 2,
        maxZoomLevel: 4,
        
        // 패딩
        paddingFn: () => ({ 
          top: 40, 
          bottom: 40, 
          left: 20, 
          right: 20 
        }),

        // 이미지 개수 표시
        counterEl: true,
      });

      // 캡션 UI 등록
      lightbox.on('uiRegister', function() {
        lightbox.pswp.ui.registerElement({
          name: 'custom-caption',
          order: 9,
          isButton: false,
          appendTo: 'root',
          onInit: (el, pswp) => {
            el.className = 'pswp__custom-caption-container';
            
            pswp.on('change', () => {
              const slide = pswp.currSlide;
              const alt = slide.data.alt;
              
              if (alt && alt.trim()) {
                el.innerHTML = `<div class="pswp__custom-caption">${escapeHtml(alt)}</div>`;
                el.hidden = false;
              } else {
                el.innerHTML = '';
                el.hidden = true;
              }
            });
          }
        });
      });

      lightbox.init();
      lightbox.loadAndOpen(index);
    }

    // HTML 이스케이프 함수
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    console.log('Image Viewer: Initialized with ' + galleryItems.length + ' images');
  }
})();

/**
 * Lazy Loading with IntersectionObserver
 * Loads images and other media when they enter the viewport
 */

class LazyLoader {
  constructor(options = {}) {
    this.rootMargin = options.rootMargin || '50px';
    this.threshold = options.threshold || 0.01;
    this.observer = null;
    this.init();
  }

  init() {
    // Check for IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all lazy images immediately
      this.loadAllLazyElements();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: this.rootMargin,
        threshold: this.threshold
      }
    );

    this.observeLazyElements();
  }

  observeLazyElements() {
    // Observe images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.observer.observe(img));

    // Observe videos with data-src
    const lazyVideos = document.querySelectorAll('video[data-src]');
    lazyVideos.forEach(video => this.observer.observe(video));

    // Observe iframes with data-src
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach(iframe => this.observer.observe(iframe));
  }

  loadElement(element) {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'img':
        this.loadImage(element);
        break;
      case 'video':
        this.loadVideo(element);
        break;
      case 'iframe':
        this.loadIframe(element);
        break;
      default:
        // For other elements with data-src, just set src
        if (element.dataset.src) {
          element.src = element.dataset.src;
          element.classList.remove('lazy');
        }
    }

    // Remove loading class and add loaded class
    element.classList.remove('lazy-loading');
    element.classList.add('lazy-loaded');
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Set up load event handler
    const handleLoad = () => {
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };

    const handleError = () => {
      console.warn(`Failed to load lazy image: ${src}`);
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    // Start loading
    img.classList.add('lazy-loading');
    img.src = src;

    // Clean up data attribute
    delete img.dataset.src;
  }

  loadVideo(video) {
    const src = video.dataset.src;
    if (!src) return;

    video.src = src;
    delete video.dataset.src;

    // Handle video loading states
    video.addEventListener('loadeddata', () => {
      video.classList.remove('lazy-loading');
      video.classList.add('lazy-loaded');
    });

    video.addEventListener('error', () => {
      console.warn(`Failed to load lazy video: ${src}`);
      video.classList.remove('lazy-loading');
      video.classList.add('lazy-error');
    });

    video.classList.add('lazy-loading');
  }

  loadIframe(iframe) {
    const src = iframe.dataset.src;
    if (!src) return;

    iframe.src = src;
    delete iframe.dataset.src;

    iframe.addEventListener('load', () => {
      iframe.classList.remove('lazy-loading');
      iframe.classList.add('lazy-loaded');
    });

    iframe.addEventListener('error', () => {
      console.warn(`Failed to load lazy iframe: ${src}`);
      iframe.classList.remove('lazy-loading');
      iframe.classList.add('lazy-error');
    });

    iframe.classList.add('lazy-loading');
  }

  loadAllLazyElements() {
    // Fallback for browsers without IntersectionObserver
    const lazyElements = document.querySelectorAll('[data-src]');
    lazyElements.forEach(element => this.loadElement(element));
  }

  // Public method to manually trigger lazy loading for specific elements
  loadElementNow(element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
    this.loadElement(element);
  }

  // Public method to refresh observations (useful after dynamic content changes)
  refresh() {
    if (this.observer) {
      // Disconnect and reconnect to pick up new elements
      this.observer.disconnect();
      this.observeLazyElements();
    }
  }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader({
    rootMargin: '100px', // Start loading 100px before element enters viewport
    threshold: 0.1
  });
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}

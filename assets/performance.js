/**
 * Performance Utilities
 * Critical CSS inlining, resource optimization, and loading strategies
 */

class PerformanceUtils {
  static init() {
    this.optimizeResourceLoading();
    this.addPerformanceObservers();
    this.optimizeImages();
  }

  static optimizeResourceLoading() {
    // Defer non-critical CSS
    this.deferNonCriticalCSS();

    // Preload critical resources
    this.preloadCriticalResources();

    // Add loading states for better perceived performance
    this.addLoadingStates();
  }

  static deferNonCriticalCSS() {
    // Find non-critical stylesheets and defer them
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
    styleSheets.forEach(sheet => {
      const media = sheet.media || 'all';
      sheet.media = 'print';
      sheet.onload = () => {
        sheet.media = media;
      };
    });
  }

  static preloadCriticalResources() {
    // Preload hero images on product/collection pages
    const heroImage = document.querySelector('.product__image img, .collection-hero img');
    if (heroImage && heroImage.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.src;
      document.head.appendChild(link);
    }

    // Preload critical fonts
    const fonts = [
      // Add critical font URLs here if any
      // '/fonts/critical-font.woff2'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font;
      document.head.appendChild(link);
    });
  }

  static addLoadingStates() {
    // Add loading classes to improve perceived performance
    document.documentElement.classList.add('loading');

    window.addEventListener('load', () => {
      document.documentElement.classList.remove('loading');
      document.documentElement.classList.add('loaded');
    });

    // Add loading states for dynamic content
    const dynamicElements = document.querySelectorAll('[data-loading]');
    dynamicElements.forEach(element => {
      element.classList.add('loading');
    });
  }

  static optimizeImages() {
    // Ensure all images have proper attributes for performance
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }

      // Add decoding attribute for better performance
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }

      // Add fetchpriority for above-the-fold images
      if (img.closest('.hero, .product__gallery, .featured-product') && !img.hasAttribute('fetchpriority')) {
        img.fetchPriority = 'high';
      }
    });
  }

  static addPerformanceObservers() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];

          if (lastEntry) {
            // Log LCP for monitoring (could send to analytics)
            console.log('LCP:', lastEntry.startTime);

            // Add performance class based on LCP
            const lcpClass = lastEntry.startTime < 2500 ? 'perf-good' :
                           lastEntry.startTime < 4000 ? 'perf-ok' : 'perf-poor';
            document.documentElement.classList.add(lcpClass);
          }
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Monitor Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }

          if (clsValue > 0) {
            console.log('CLS:', clsValue);

            // Add CLS performance class
            const clsClass = clsValue < 0.1 ? 'cls-good' :
                           clsValue < 0.25 ? 'cls-ok' : 'cls-poor';
            document.documentElement.classList.add(clsClass);
          }
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('Performance observers not supported:', error);
      }
    }
  }

  // Utility method to defer script loading
  static loadScript(src, options = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = options.defer !== false;
      script.async = options.async || false;

      if (options.crossOrigin) {
        script.crossOrigin = options.crossOrigin;
      }

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  // Utility method to defer stylesheet loading
  static loadStylesheet(href, options = {}) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;

      if (options.media) {
        link.media = options.media;
        link.onload = () => {
          link.media = options.originalMedia || 'all';
          resolve();
        };
      } else {
        link.onload = resolve;
      }

      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  PerformanceUtils.init();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceUtils;
}

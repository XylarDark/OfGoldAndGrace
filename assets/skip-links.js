/**
 * Skip Links Module
 * Manages skip link visibility and navigation announcements for accessibility
 */

(function() {
  'use strict';

  /**
   * Initialize skip links functionality
   * Shows skip links when their targets exist and adds navigation announcements
   */
  function initSkipLinks() {
    const skipLinks = document.querySelectorAll('[data-skip-target]');

    skipLinks.forEach(link => {
      const targetId = link.getAttribute('data-skip-target');
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Reveal the skip link since target exists
        link.classList.remove('sr-only');

        // Add navigation announcement on activation
        link.addEventListener('click', handleSkipLinkClick);
      }
    });
  }

  /**
   * Handle skip link click events
   * @param {Event} event - The click event
   */
  function handleSkipLinkClick(event) {
    const link = event.currentTarget;
    const linkText = link.textContent.trim();

    // Announce navigation activation if announcements utility is available
    if (window.announcements && typeof window.announcements.announce === 'function') {
      window.announcements.announce(`${linkText} navigation activated`);
    }
  }

  // Initialize on DOM content loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkipLinks);
  } else {
    // DOM already loaded, initialize immediately
    initSkipLinks();
  }

  // Expose for testing (optional)
  if (typeof window !== 'undefined') {
    window.skipLinks = {
      init: initSkipLinks,
      handleClick: handleSkipLinkClick
    };
  }
})();

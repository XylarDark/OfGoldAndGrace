/**
 * Wishlist functionality using localStorage
 * Manages product handles and syncs UI state across components
 */

class WishlistManager {
  constructor() {
    this.storageKey = 'ogag:wishlist';
    this.wishlist = this.loadWishlist();
    this.init();
  }

  init() {
    // Bind events
    document.addEventListener('click', this.handleToggle.bind(this));
    document.addEventListener('wishlist:updated', this.handleWishlistUpdate.bind(this));

    // Update all wishlist buttons on page load
    this.updateAllButtons();
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading wishlist:', error);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }

  isInWishlist(handle) {
    return this.wishlist.includes(handle);
  }

  addToWishlist(handle) {
    if (!this.isInWishlist(handle)) {
      this.wishlist.push(handle);
      this.saveWishlist();
      this.dispatchUpdate('add', handle);

      // Announce to screen readers
      const productTitle = this.getProductTitle(handle);
      if (window.announcements && productTitle) {
        window.announcements.productAddedToWishlist(productTitle);
      }

      return true;
    }
    return false;
  }

  removeFromWishlist(handle) {
    const index = this.wishlist.indexOf(handle);
    if (index > -1) {
      // Announce before removing (so we still have access to the product title)
      const productTitle = this.getProductTitle(handle);
      if (window.announcements && productTitle) {
        window.announcements.productRemovedFromWishlist(productTitle);
      }

      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.dispatchUpdate('remove', handle);
      return true;
    }
    return false;
  }

  getProductTitle(handle) {
    // Try to find the product title from buttons on the page
    const buttons = document.querySelectorAll(`[data-wishlist-toggle][data-product-handle="${handle}"]`);
    for (const button of buttons) {
      const title = button.dataset.productTitle;
      if (title) return title;
    }

    // Fallback: try to find from product cards
    const productCard = document.querySelector(`[data-product-handle="${handle}"]`);
    if (productCard) {
      const titleEl = productCard.querySelector('.product-card__title, .product__title, h1, h2');
      if (titleEl) return titleEl.textContent.trim();
    }

    // Last resort: return the handle formatted as title
    return handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  toggleWishlist(handle) {
    if (this.isInWishlist(handle)) {
      this.removeFromWishlist(handle);
      return false; // Now not in wishlist
    } else {
      this.addToWishlist(handle);
      return true; // Now in wishlist
    }
  }

  handleToggle(event) {
    const button = event.target.closest('[data-wishlist-toggle]');
    if (!button) return;

    event.preventDefault();
    const handle = button.dataset.productHandle;

    if (!handle) {
      console.error('Wishlist button missing product handle');
      return;
    }

    // Add loading state
    button.setAttribute('data-loading', '');
    button.disabled = true;

    // Toggle wishlist
    const isNowInWishlist = this.toggleWishlist(handle);

    // Update button state immediately
    this.updateButtonState(button, isNowInWishlist);

    // Remove loading state
    setTimeout(() => {
      button.removeAttribute('data-loading');
      button.disabled = false;
    }, 300);
  }

  handleWishlistUpdate(event) {
    const { action, handle } = event.detail;
    this.updateAllButtons();
  }

  updateButtonState(button, isInWishlist) {
    const handle = button.dataset.productHandle;

    // Update classes
    button.classList.toggle('wishlist-button--active', isInWishlist);

    // Update aria-label
    const productTitle = button.dataset.productTitle || 'product';
    const action = isInWishlist ? 'remove_from_wishlist' : 'add_to_wishlist';
    button.setAttribute('aria-label',
      `${action.replace('_', ' ')}: ${productTitle}`
    );
  }

  updateAllButtons() {
    const buttons = document.querySelectorAll('[data-wishlist-toggle]');
    buttons.forEach(button => {
      const handle = button.dataset.productHandle;
      if (handle) {
        const isInWishlist = this.isInWishlist(handle);
        this.updateButtonState(button, isInWishlist);
      }
    });
  }

  dispatchUpdate(action, handle) {
    const event = new CustomEvent('wishlist:updated', {
      detail: {
        action,
        handle,
        wishlist: [...this.wishlist]
      }
    });
    window.dispatchEvent(event);
  }

  getWishlist() {
    return [...this.wishlist];
  }

  getCount() {
    return this.wishlist.length;
  }

  clearWishlist() {
    this.wishlist = [];
    this.saveWishlist();
    this.dispatchUpdate('clear', null);
  }
}

// Wishlist button snippet integration
// This function can be called from Liquid to check if a product is in wishlist
window.isInWishlist = function(handle) {
  if (!window.wishlistManager) return false;
  return window.wishlistManager.isInWishlist(handle);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.wishlistManager = new WishlistManager();
});

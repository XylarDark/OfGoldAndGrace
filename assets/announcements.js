/**
 * Screen Reader Announcements Utility
 * Provides centralized announcements for accessibility
 */

class Announcements {
  constructor() {
    this.announcementElement = document.getElementById('announcements');
    if (!this.announcementElement) {
      console.warn('Announcements element not found. Creating one...');
      this.createAnnouncementElement();
    }
  }

  createAnnouncementElement() {
    const element = document.createElement('div');
    element.id = 'announcements';
    element.setAttribute('aria-live', 'polite');
    element.setAttribute('aria-atomic', 'true');
    element.className = 'sr-only';
    document.body.insertBefore(element, document.body.firstChild);
    this.announcementElement = element;
  }

  announce(message, priority = 'polite') {
    if (!this.announcementElement) return;

    // Clear any existing content first
    this.announcementElement.textContent = '';

    // Update aria-live attribute if different priority
    if (priority !== 'polite') {
      this.announcementElement.setAttribute('aria-live', priority);
    }

    // Set the message (triggers screen reader announcement)
    this.announcementElement.textContent = message;

    // Reset aria-live back to polite after a delay for future messages
    if (priority !== 'polite') {
      setTimeout(() => {
        this.announcementElement.setAttribute('aria-live', 'polite');
      }, 1000);
    }
  }

  // Convenience methods for common announcements
  productAddedToCart(productName, quantity = 1) {
    const message = quantity === 1
      ? `{{ 'announcements.product_added_to_cart' | t: product: productName }}`
      : `{{ 'announcements.products_added_to_cart' | t: count: quantity, product: productName }}`;
    this.announce(message);
  }

  productAddedToWishlist(productName) {
    const message = `{{ 'announcements.product_added_to_wishlist' | t: product: productName }}`;
    this.announce(message);
  }

  productRemovedFromWishlist(productName) {
    const message = `{{ 'announcements.product_removed_from_wishlist' | t: product: productName }}`;
    this.announce(message);
  }

  cartUpdated() {
    const message = `{{ 'announcements.cart_updated' | t }}`;
    this.announce(message);
  }

  filterApplied(filterName, count) {
    const message = count === 1
      ? `{{ 'announcements.filter_applied_singular' | t: filter: filterName }}`
      : `{{ 'announcements.filters_applied' | t: count: count }}`;
    this.announce(message);
  }

  searchResultsFound(count, query) {
    const message = count === 1
      ? `{{ 'announcements.search_result_found' | t: query: query }}`
      : `{{ 'announcements.search_results_found' | t: count: count, query: query }}`;
    this.announce(message);
  }

  error(message) {
    this.announce(message, 'assertive');
  }
}

// Create global announcements instance
window.announcements = new Announcements();

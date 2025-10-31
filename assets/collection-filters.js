/**
 * Collection Filters with URL Synchronization
 * Handles tag-based multi-select filtering with URL state management
 */

class CollectionFilters {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.search);
    this.activeFilters = {
      tags: this.getTagsFromURL(),
      price_min: this.urlParams.get('price_min'),
      price_max: this.urlParams.get('price_max'),
      availability: this.urlParams.get('availability'),
      metal: this.urlParams.getAll('metal')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUIFromFilters();
    this.applyFilters();
  }

  getTagsFromURL() {
    return this.urlParams.getAll('tag');
  }

  bindEvents() {
    // Tag filter checkboxes
    const tagCheckboxes = document.querySelectorAll('[data-tag-checkbox]');
    tagCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.handleTagFilterChange(e.target);
      });
    });

    // Price range inputs
    const priceMinInput = document.querySelector('[data-price-min]');
    const priceMaxInput = document.querySelector('[data-price-max]');
    if (priceMinInput) {
      priceMinInput.addEventListener('input', () => this.handlePriceFilterChange());
    }
    if (priceMaxInput) {
      priceMaxInput.addEventListener('input', () => this.handlePriceFilterChange());
    }

    // Availability filter
    const availabilityCheckbox = document.querySelector('[data-availability-filter]');
    if (availabilityCheckbox) {
      availabilityCheckbox.addEventListener('change', (e) => {
        this.handleAvailabilityFilterChange(e.target.checked);
      });
    }

    // Metal type filters
    const metalCheckboxes = document.querySelectorAll('[data-metal-filter] input[type="checkbox"]');
    metalCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.handleMetalFilterChange(checkbox.value, checkbox.checked);
      });
    });

    // Clear filters button
    const clearBtn = document.querySelector('[data-clear-filters]');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllFilters());
    }

    // Sort select
    const sortSelect = document.querySelector('[data-sort-select]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => this.handleSortChange(e.target.value));
    }
  }

  handleTagFilterChange(checkbox) {
    const tagValue = checkbox.value;
    const isChecked = checkbox.checked;

    if (isChecked) {
      if (!this.activeFilters.tags.includes(tagValue)) {
        this.activeFilters.tags.push(tagValue);
      }
    } else {
      this.activeFilters.tags = this.activeFilters.tags.filter(tag => tag !== tagValue);
    }

    this.updateURL();
    this.applyFilters();
    this.updateClearButtonVisibility();
  }

  handlePriceFilterChange() {
    const minInput = document.querySelector('[data-price-min]');
    const maxInput = document.querySelector('[data-price-max]');

    this.activeFilters.price_min = minInput.value || null;
    this.activeFilters.price_max = maxInput.value || null;

    this.updateURL();
    this.applyFilters();
    this.updateClearButtonVisibility();
  }

  handleAvailabilityFilterChange(isChecked) {
    this.activeFilters.availability = isChecked ? 'in-stock' : null;

    this.updateURL();
    this.applyFilters();
    this.updateClearButtonVisibility();
  }

  handleMetalFilterChange(metalValue, isChecked) {
    if (isChecked) {
      if (!this.activeFilters.metal.includes(metalValue)) {
        this.activeFilters.metal.push(metalValue);
      }
    } else {
      this.activeFilters.metal = this.activeFilters.metal.filter(metal => metal !== metalValue);
    }

    this.updateURL();
    this.applyFilters();
    this.updateClearButtonVisibility();
  }

  handleSortChange(sortValue) {
    // For now, just update the URL. In a full implementation,
    // this would trigger a server-side sort or client-side sorting
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('sort', sortValue);
    window.history.replaceState({}, '', newUrl);
  }

  updateURL() {
    const newUrl = new URL(window.location);

    // Clear existing filter params
    ['tag', 'price_min', 'price_max', 'availability', 'metal'].forEach(param => {
      newUrl.searchParams.delete(param);
    });

    // Add active filters
    this.activeFilters.tags.forEach(tag => {
      newUrl.searchParams.append('tag', tag);
    });

    if (this.activeFilters.price_min) {
      newUrl.searchParams.set('price_min', this.activeFilters.price_min);
    }

    if (this.activeFilters.price_max) {
      newUrl.searchParams.set('price_max', this.activeFilters.price_max);
    }

    if (this.activeFilters.availability) {
      newUrl.searchParams.set('availability', this.activeFilters.availability);
    }

    this.activeFilters.metal.forEach(metal => {
      newUrl.searchParams.append('metal', metal);
    });

    // Update URL without triggering page reload
    window.history.replaceState({}, '', newUrl);
  }

  updateUIFromFilters() {
    // Update tag checkboxes
    this.activeFilters.tags.forEach(tagValue => {
      const checkbox = document.querySelector(`[data-tag-checkbox][value="${tagValue}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });

    // Update price inputs
    const minInput = document.querySelector('[data-price-min]');
    const maxInput = document.querySelector('[data-price-max]');
    if (minInput && this.activeFilters.price_min) {
      minInput.value = this.activeFilters.price_min;
    }
    if (maxInput && this.activeFilters.price_max) {
      maxInput.value = this.activeFilters.price_max;
    }

    // Update availability checkbox
    const availabilityCheckbox = document.querySelector('[data-availability-filter]');
    if (availabilityCheckbox && this.activeFilters.availability) {
      availabilityCheckbox.checked = true;
    }

    // Update metal checkboxes
    this.activeFilters.metal.forEach(metalValue => {
      const checkbox = document.querySelector(`[data-metal-filter] input[value="${metalValue}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });

    this.updateClearButtonVisibility();
  }

  updateClearButtonVisibility() {
    const clearBtn = document.querySelector('[data-clear-filters]');
    const hasActiveFilters = this.activeFilters.tags.length > 0 ||
                            this.activeFilters.price_min ||
                            this.activeFilters.price_max ||
                            this.activeFilters.availability ||
                            this.activeFilters.metal.length > 0;

    if (clearBtn) {
      clearBtn.style.display = hasActiveFilters ? 'block' : 'none';
    }
  }

  clearAllFilters() {
    // Clear active filters
    this.activeFilters = {
      tags: [],
      price_min: null,
      price_max: null,
      availability: null,
      metal: []
    };

    // Update UI
    const allCheckboxes = document.querySelectorAll('[data-tag-checkbox], [data-availability-filter], [data-metal-filter] input');
    allCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    const priceInputs = document.querySelectorAll('[data-price-min], [data-price-max]');
    priceInputs.forEach(input => {
      input.value = '';
    });

    // Update URL and apply filters
    this.updateURL();
    this.applyFilters();
    this.updateClearButtonVisibility();
  }

  applyFilters() {
    const productCards = document.querySelectorAll('[data-product-id]');
    let visibleCount = 0;

    productCards.forEach(card => {
      const isVisible = this.productMatchesFilters(card);
      card.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

    // Update results count
    this.updateResultsCount(visibleCount, productCards.length);

    // Handle empty state
    this.updateEmptyState(visibleCount);

    // Emit event for other components
    const filterEvent = new CustomEvent('collection:filters-changed', {
      detail: {
        activeFilters: this.activeFilters,
        filterCount: this.getActiveFilterCount(),
        visibleCount: visibleCount
      }
    });
    document.dispatchEvent(filterEvent);

    // Update filter count display
    this.updateFilterCount();
  }

  productMatchesFilters(productCard) {
    // Get product data from the card
    const productHandle = productCard.getAttribute('data-product-handle') || productCard.getAttribute('data-product-id');
    const productTags = productCard.getAttribute('data-product-tags')?.split(',') || [];
    const productPrice = parseFloat(productCard.getAttribute('data-product-price')) || 0;
    const productAvailable = productCard.getAttribute('data-product-available') === 'true';

    // Check tag filters
    if (this.activeFilters.tags.length > 0) {
      const hasMatchingTag = this.activeFilters.tags.some(tag =>
        productTags.some(productTag => productTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) return false;
    }

    // Check price filters
    if (this.activeFilters.price_min && productPrice < parseFloat(this.activeFilters.price_min)) {
      return false;
    }
    if (this.activeFilters.price_max && productPrice > parseFloat(this.activeFilters.price_max)) {
      return false;
    }

    // Check availability filter
    if (this.activeFilters.availability === 'in-stock' && !productAvailable) {
      return false;
    }

    // Check metal filters (if any metal filters are specified, check if product has them)
    if (this.activeFilters.metal.length > 0) {
      const hasMatchingMetal = this.activeFilters.metal.some(metal =>
        productTags.some(productTag => productTag.toLowerCase().includes(metal.toLowerCase()))
      );
      if (!hasMatchingMetal) return false;
    }

    return true;
  }

  updateResultsCount(visibleCount, totalCount) {
    const resultsElement = document.querySelector('[data-results-count]');
    if (resultsElement) {
      if (visibleCount === totalCount) {
        resultsElement.textContent = `${totalCount} products`;
      } else {
        resultsElement.textContent = `${visibleCount} of ${totalCount} products`;
      }
    }
  }

  updateEmptyState(visibleCount) {
    const emptyState = document.querySelector('[data-no-results]');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  getActiveFilterCount() {
    let count = this.activeFilters.tags.length + this.activeFilters.metal.length;

    if (this.activeFilters.price_min || this.activeFilters.price_max) count++;
    if (this.activeFilters.availability) count++;

    return count;
  }

  updateFilterCount() {
    const countElement = document.querySelector('[data-filters-count]');
    if (countElement) {
      const count = this.getActiveFilterCount();
      countElement.textContent = count > 0 ? `(${count})` : '';
    }
  }

  // Public method to get current filters
  getActiveFilters() {
    return { ...this.activeFilters };
  }

  // Public method to programmatically set filters
  setFilters(newFilters) {
    this.activeFilters = { ...this.activeFilters, ...newFilters };
    this.updateUIFromFilters();
    this.updateURL();
    this.applyFilters();
  }
}

// Initialize collection filters when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on collection pages
  if (document.querySelector('[data-collection-filters]')) {
    window.collectionFilters = new CollectionFilters();
  }
});

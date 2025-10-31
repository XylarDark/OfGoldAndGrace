/**
 * Quick View Modal functionality
 * Loads product data and displays in a modal overlay
 */

class QuickView {
  constructor() {
    this.modal = document.getElementById('quick-view-modal');
    this.loading = document.getElementById('quick-view-loading');
    this.content = document.getElementById('quick-view-content');
    this.form = document.getElementById('quick-view-form');
    this.triggerElement = null;

    this.init();
  }

  init() {
    // Bind events
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', this.handleKeydown.bind(this));

    // Form submission
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this));

    // Quantity selector
    this.bindQuantitySelector();
  }

  handleClick(event) {
    const target = event.target.closest('[data-quick-view]');
    if (!target) return;

    event.preventDefault();
    const productHandle = target.dataset.quickView;
    this.open(productHandle, target);
  }

  async open(productHandle, triggerElement) {
    this.triggerElement = triggerElement;

    // Show modal and loading state
    this.modal.setAttribute('aria-hidden', 'false');
    this.loading.style.display = 'flex';
    this.content.style.display = 'none';

    document.body.style.overflow = 'hidden';

    try {
      // Fetch product data
      const response = await fetch(`/products/${productHandle}.js`);
      if (!response.ok) throw new Error('Product not found');

      const product = await response.json();
      this.renderProduct(product);
    } catch (error) {
      console.error('Error loading product:', error);
      this.close();
      // Could show error message here
    }
  }

  renderProduct(product) {
    // Update title
    const titleEl = document.getElementById('quick-view-title');
    titleEl.textContent = product.title;

    // Update price
    const priceEl = document.getElementById('quick-view-price');
    priceEl.innerHTML = this.formatPrice(product.price, product.compare_at_price);

    // Update description
    const descEl = document.getElementById('quick-view-description');
    descEl.innerHTML = product.description || '';

    // Update image
    const imageEl = document.getElementById('quick-view-image');
    const featuredImage = product.featured_image || product.images[0];
    if (featuredImage) {
      imageEl.src = featuredImage;
      imageEl.alt = product.title;
    }

    // Render variants
    const variantsEl = document.getElementById('quick-view-variants');
    variantsEl.innerHTML = '';

    if (product.variants && product.variants.length > 1) {
      // Group variants by option name
      const options = {};
      product.variants.forEach(variant => {
        variant.option1 && (options[variant.option1] = options[variant.option1] || []);
        variant.option2 && (options[variant.option2] = options[variant.option2] || []);
        variant.option3 && (options[variant.option3] = options[variant.option3] || []);
      });

      Object.keys(options).forEach(optionName => {
        if (options[optionName].length > 0) {
          const optionDiv = document.createElement('div');
          optionDiv.className = 'product-option';
          optionDiv.innerHTML = `
            <label for="option-${optionName.toLowerCase()}">${optionName}</label>
            <select id="option-${optionName.toLowerCase()}" name="id" data-option-name="${optionName}">
              ${options[optionName].map(value => `<option value="${value}">${value}</option>`).join('')}
            </select>
          `;
          variantsEl.appendChild(optionDiv);
        }
      });

      // Bind variant change events
      variantsEl.addEventListener('change', this.handleVariantChange.bind(this, product));
    } else if (product.variants && product.variants.length === 1) {
      // Single variant - add hidden input
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'id';
      hiddenInput.value = product.variants[0].id;
      variantsEl.appendChild(hiddenInput);
    }

    // Show content and hide loading
    this.loading.style.display = 'none';
    this.content.style.display = 'grid';

    // Focus management
    this.focusTrap = new window.FocusTrap(this.modal);
    this.focusTrap.activate(this.triggerElement);

    // Listen for escape key from focus trap
    this.modal.addEventListener('focustrap:escape', () => {
      this.close();
    });
  }

  formatPrice(price, compareAtPrice) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    if (compareAtPrice && compareAtPrice > price) {
      return `
        <span class="price--sale">${formatter.format(price / 100)}</span>
        <span class="price--compare">${formatter.format(compareAtPrice / 100)}</span>
      `;
    }

    return `<span class="price">${formatter.format(price / 100)}</span>`;
  }

  handleVariantChange(product, event) {
    // Update selected variant ID based on option changes
    const selectedOptions = {};
    this.form.querySelectorAll('select[data-option-name]').forEach(select => {
      selectedOptions[select.dataset.optionName] = select.value;
    });

    const matchingVariant = product.variants.find(variant =>
      variant.option1 === selectedOptions[variant.option1] &&
      (!variant.option2 || variant.option2 === selectedOptions[variant.option2]) &&
      (!variant.option3 || variant.option3 === selectedOptions[variant.option3])
    );

    if (matchingVariant) {
      let variantInput = this.form.querySelector('input[name="id"]');
      if (!variantInput) {
        variantInput = document.createElement('input');
        variantInput.type = 'hidden';
        variantInput.name = 'id';
        this.form.appendChild(variantInput);
      }
      variantInput.value = matchingVariant.id;

      // Update price display
      const priceEl = document.getElementById('quick-view-price');
      priceEl.innerHTML = this.formatPrice(matchingVariant.price, matchingVariant.compare_at_price);
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const submitButton = this.form.querySelector('button[type="submit"]');

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Adding...';

    fetch('/cart/add.js', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success' || data.items) {
        // Success - close modal and show cart notification
        this.close();
        this.showCartNotification();
      } else {
        // Error - show message
        console.error('Error adding to cart:', data);
        submitButton.textContent = 'Error - Try Again';
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = 'Add to Cart';
        }, 2000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      submitButton.disabled = false;
      submitButton.textContent = 'Add to Cart';
    });
  }

  showCartNotification() {
    // Simple notification - could be enhanced
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-base-success, #4CAF50);
      color: white;
      padding: 1rem;
      border-radius: 0.25rem;
      z-index: 1001;
      animation: slide-in 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  bindQuantitySelector() {
    const quantityInput = document.getElementById('quick-view-quantity-input');

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-quantity-change]');
      if (!button) return;

      const change = parseInt(button.dataset.quantityChange);
      const currentValue = parseInt(quantityInput.value);
      const newValue = Math.max(1, Math.min(99, currentValue + change));

      quantityInput.value = newValue;
    });
  }

  close() {
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    // Return focus to trigger element
    if (this.triggerElement) {
      this.triggerElement.focus();
    }
  }

  // Escape key handling is now done by the focus trap utility
}

// Focus trap is now handled by the shared focus-trap.js utility

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new QuickView();
});

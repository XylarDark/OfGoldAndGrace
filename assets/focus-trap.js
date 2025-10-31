/**
 * Focus Trap Utility
 * Manages focus within modal dialogs for accessibility
 */

class FocusTrap {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      initialFocus: options.initialFocus || false,
      returnFocus: options.returnFocus !== false,
      ...options
    };
    this.triggerElement = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.isActive = false;

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleFocusIn = this.handleFocusIn.bind(this);
  }

  activate(triggerElement = null) {
    if (this.isActive) return;

    this.triggerElement = triggerElement;
    this.isActive = true;

    // Get all focusable elements
    this.updateFocusableElements();

    // Set initial focus
    if (this.options.initialFocus && this.firstFocusable) {
      this.firstFocusable.focus();
    }

    // Add event listeners
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('focusin', this.handleFocusIn);

    // Announce to screen readers
    this.element.setAttribute('aria-hidden', 'false');
  }

  deactivate() {
    if (!this.isActive) return;

    this.isActive = false;

    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('focusin', this.handleFocusIn);

    // Return focus to trigger element
    if (this.options.returnFocus && this.triggerElement) {
      this.triggerElement.focus();
    }

    // Announce to screen readers
    this.element.setAttribute('aria-hidden', 'true');
  }

  updateFocusableElements() {
    const selectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    this.focusableElements = Array.from(
      this.element.querySelectorAll(selectors.join(','))
    ).filter(el => {
      // Check if element is visible and not hidden
      const style = window.getComputedStyle(el);
      return style.display !== 'none' &&
             style.visibility !== 'hidden' &&
             !el.hasAttribute('inert') &&
             el.offsetParent !== null;
    });

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
  }

  handleKeydown(event) {
    if (!this.isActive) return;

    switch (event.key) {
      case 'Tab':
        this.handleTab(event);
        break;
      case 'Escape':
        this.handleEscape(event);
        break;
    }
  }

  handleTab(event) {
    if (this.focusableElements.length === 0) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }

  handleEscape(event) {
    // Dispatch custom event for modal to handle
    const escapeEvent = new CustomEvent('focustrap:escape', {
      detail: { originalEvent: event }
    });
    this.element.dispatchEvent(escapeEvent);
  }

  handleFocusIn(event) {
    if (!this.isActive) return;

    // If focus moves outside the modal, bring it back
    if (!this.element.contains(event.target)) {
      event.preventDefault();
      (this.firstFocusable || this.element).focus();
    }
  }
}

// Global utility for creating focus traps
window.FocusTrap = FocusTrap;

// Auto-initialize focus traps for elements with data-focus-trap
document.addEventListener('DOMContentLoaded', () => {
  const trapElements = document.querySelectorAll('[data-focus-trap]');
  trapElements.forEach(element => {
    const trap = new FocusTrap(element);
    element._focusTrap = trap;

    // Auto-activate when element becomes visible
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          const isHidden = element.getAttribute('aria-hidden') === 'true';
          if (!isHidden && !trap.isActive) {
            trap.activate();
          } else if (isHidden && trap.isActive) {
            trap.deactivate();
          }
        }
      });
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['aria-hidden']
    });
  });
});

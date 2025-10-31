/**
 * Quick View Functionality Tests
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mock fetch for testing
  const originalFetch = window.fetch;
  window.fetch = function(url) {
    if (url.includes('/products/test-product.js')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 123,
          title: 'Test Product',
          handle: 'test-product',
          price: 2999,
          compare_at_price: 3999,
          featured_image: '/test-image.jpg',
          description: 'Test description',
          variants: [
            { id: 456, option1: 'Default', price: 2999, compare_at_price: 3999 }
          ]
        })
      });
    }
    return originalFetch.apply(this, arguments);
  };

  window.testRunner.test('QuickView modal initializes', () => {
    const qv = new QuickView();
    TestRunner.assert(qv.modal, 'Should create modal element');
    TestRunner.assert(qv.loading, 'Should have loading element');
    TestRunner.assert(qv.content, 'Should have content element');
    TestRunner.assert(qv.form, 'Should have form element');
  });

  window.testRunner.test('QuickView price formatting', () => {
    const qv = new QuickView();

    // Test regular price
    const regularPrice = qv.formatPrice(2999, null);
    TestRunner.assert(regularPrice.includes('$29.99'), 'Should format regular price correctly');

    // Test sale price
    const salePrice = qv.formatPrice(2999, 3999);
    TestRunner.assert(salePrice.includes('$29.99'), 'Should show sale price');
    TestRunner.assert(salePrice.includes('$39.99'), 'Should show compare price');
    TestRunner.assert(salePrice.includes('price--sale'), 'Should have sale class');
  });

  window.testRunner.test('QuickView button interactions', () => {
    // Create mock button
    const button = document.createElement('button');
    button.setAttribute('data-quick-view', 'test-product');
    document.body.appendChild(button);

    const qv = new QuickView();

    // Mock the open method to avoid actual DOM manipulation
    let openedWith = null;
    qv.open = function(handle, trigger) {
      openedWith = { handle, trigger };
      return Promise.resolve();
    };

    // Simulate click
    const clickEvent = new MouseEvent('click');
    button.dispatchEvent(clickEvent);

    TestRunner.assert(openedWith, 'Should call open method');
    TestRunner.assertEqual(openedWith.handle, 'test-product', 'Should pass correct handle');
    TestRunner.assertEqual(openedWith.trigger, button, 'Should pass trigger element');

    // Cleanup
    document.body.removeChild(button);
  });

  window.testRunner.test('QuickView variant handling', () => {
    const qv = new QuickView();

    // Mock form and product data
    const mockForm = document.createElement('form');
    mockForm.innerHTML = '<input name="id" value="456">';

    // Create mock product with variants
    const mockProduct = {
      id: 123,
      title: 'Test Product',
      variants: [
        { id: 456, option1: 'Small', price: 2999 },
        { id: 789, option1: 'Large', price: 3999 }
      ]
    };

    // Test variant selection
    const select = document.createElement('select');
    select.dataset.optionName = 'Size';
    select.value = 'Large';
    mockForm.appendChild(select);

    qv.form = mockForm;
    qv.handleVariantChange(mockProduct);

    // Should update hidden input with correct variant ID
    const hiddenInput = mockForm.querySelector('input[name="id"]');
    TestRunner.assert(hiddenInput, 'Should create hidden input');
    TestRunner.assertEqual(hiddenInput.value, '789', 'Should select Large variant');
  });

  window.testRunner.test('QuickView quantity controls', () => {
    const qv = new QuickView();

    // Create mock quantity input and buttons
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '1';
    input.id = 'quick-view-quantity-input';
    document.body.appendChild(input);

    // Test increment
    const incrementBtn = document.createElement('button');
    incrementBtn.setAttribute('data-quantity-change', '1');
    document.body.appendChild(incrementBtn);

    const clickEvent = new MouseEvent('click');
    incrementBtn.dispatchEvent(clickEvent);

    TestRunner.assertEqual(input.value, '2', 'Should increment quantity');

    // Test decrement
    const decrementBtn = document.createElement('button');
    decrementBtn.setAttribute('data-quantity-change', '-1');
    document.body.appendChild(decrementBtn);

    decrementBtn.dispatchEvent(clickEvent);
    TestRunner.assertEqual(input.value, '1', 'Should decrement quantity');

    // Test minimum bound
    decrementBtn.dispatchEvent(clickEvent);
    TestRunner.assertEqual(input.value, '1', 'Should not go below minimum');

    // Cleanup
    document.body.removeChild(input);
    document.body.removeChild(incrementBtn);
    document.body.removeChild(decrementBtn);
  });

  // Test FocusTrap utility
  window.testRunner.test('FocusTrap initializes correctly', () => {
    const element = document.createElement('div');
    element.innerHTML = '<button>Button 1</button><input><button>Button 2</button>';
    document.body.appendChild(element);

    const trap = new window.FocusTrap(element);
    TestRunner.assert(trap.element === element, 'Should store element reference');
    TestRunner.assert(Array.isArray(trap.focusableElements), 'Should find focusable elements');
    TestRunner.assert(trap.firstFocusable, 'Should identify first focusable element');
    TestRunner.assert(trap.lastFocusable, 'Should identify last focusable element');

    document.body.removeChild(element);
  });

  window.testRunner.test('FocusTrap handles Tab navigation', () => {
    const element = document.createElement('div');
    element.innerHTML = '<button id="btn1">Button 1</button><input id="input1"><button id="btn2">Button 2</button>';
    document.body.appendChild(element);

    const trap = new window.FocusTrap(element);
    trap.activate();

    // Simulate Tab key
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    element.dispatchEvent(tabEvent);

    trap.deactivate();
    document.body.removeChild(element);
  });

  // Restore original fetch
  setTimeout(() => {
    window.fetch = originalFetch;
    window.testRunner.run();
  }, 100);
});

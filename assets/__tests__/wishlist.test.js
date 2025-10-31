/**
 * Wishlist Functionality Tests
 */

document.addEventListener('DOMContentLoaded', () => {
  // Test WishlistManager class
  window.testRunner.test('WishlistManager initializes correctly', () => {
    const manager = new window.WishlistManager.constructor();
    TestRunner.assert(manager instanceof window.WishlistManager.constructor, 'Should create WishlistManager instance');
    TestRunner.assert(Array.isArray(manager.wishlist), 'Should have wishlist array');
    TestRunner.assertEqual(manager.getCount(), 0, 'Should start with empty wishlist');
  });

  window.testRunner.test('Wishlist can add items', () => {
    // Clear localStorage for test
    localStorage.removeItem('ogag:wishlist');

    const manager = new window.WishlistManager.constructor();

    TestRunner.assert(manager.addToWishlist('test-handle-1'), 'Should add new item');
    TestRunner.assertEqual(manager.getCount(), 1, 'Should have 1 item');
    TestRunner.assert(manager.isInWishlist('test-handle-1'), 'Should contain added item');

    // Test duplicate prevention
    TestRunner.assert(!manager.addToWishlist('test-handle-1'), 'Should not add duplicate');
    TestRunner.assertEqual(manager.getCount(), 1, 'Should still have 1 item');
  });

  window.testRunner.test('Wishlist can remove items', () => {
    const manager = new window.WishlistManager.constructor();

    // Add items
    manager.addToWishlist('test-handle-1');
    manager.addToWishlist('test-handle-2');
    TestRunner.assertEqual(manager.getCount(), 2, 'Should have 2 items');

    // Remove item
    TestRunner.assert(manager.removeFromWishlist('test-handle-1'), 'Should remove existing item');
    TestRunner.assertEqual(manager.getCount(), 1, 'Should have 1 item remaining');
    TestRunner.assert(!manager.isInWishlist('test-handle-1'), 'Should not contain removed item');
    TestRunner.assert(manager.isInWishlist('test-handle-2'), 'Should still contain other item');

    // Test removing non-existent item
    TestRunner.assert(!manager.removeFromWishlist('non-existent'), 'Should not remove non-existent item');
  });

  window.testRunner.test('Wishlist persists in localStorage', () => {
    // Clear and setup
    localStorage.removeItem('ogag:wishlist');
    const manager1 = new window.WishlistManager.constructor();
    manager1.addToWishlist('persistent-item');

    // Create new instance to test persistence
    const manager2 = new window.WishlistManager.constructor();
    TestRunner.assert(manager2.isInWishlist('persistent-item'), 'Should persist across instances');
    TestRunner.assertEqual(manager2.getCount(), 1, 'Should maintain count across instances');
  });

  window.testRunner.test('Wishlist toggle functionality', () => {
    localStorage.removeItem('ogag:wishlist');
    const manager = new window.WishlistManager.constructor();

    // Toggle on
    TestRunner.assert(manager.toggleWishlist('toggle-item'), 'Should return true when adding');
    TestRunner.assert(manager.isInWishlist('toggle-item'), 'Should contain toggled item');

    // Toggle off
    TestRunner.assert(!manager.toggleWishlist('toggle-item'), 'Should return false when removing');
    TestRunner.assert(!manager.isInWishlist('toggle-item'), 'Should not contain toggled-off item');
  });

  window.testRunner.test('Wishlist clear functionality', () => {
    const manager = new window.WishlistManager.constructor();
    manager.addToWishlist('item-1');
    manager.addToWishlist('item-2');
    TestRunner.assertEqual(manager.getCount(), 2, 'Should have items before clear');

    manager.clearWishlist();
    TestRunner.assertEqual(manager.getCount(), 0, 'Should have no items after clear');
  });

  // Test DOM interactions (if buttons exist)
  window.testRunner.test('Wishlist button interactions', () => {
    // Create mock button
    const button = document.createElement('button');
    button.setAttribute('data-wishlist-toggle', '');
    button.dataset.productHandle = 'test-product';
    document.body.appendChild(button);

    // Mock wishlist manager
    window.wishlistManager = new window.WishlistManager.constructor();

    // Simulate click
    const clickEvent = new MouseEvent('click');
    button.dispatchEvent(clickEvent);

    // Should add to wishlist
    TestRunner.assert(window.wishlistManager.isInWishlist('test-product'), 'Button click should add to wishlist');

    // Cleanup
    document.body.removeChild(button);
  });

  // Run tests after a short delay to ensure all scripts are loaded
  setTimeout(() => {
    window.testRunner.run();
  }, 100);
});

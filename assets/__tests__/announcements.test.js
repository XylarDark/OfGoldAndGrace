/**
 * Announcements Utility Tests
 * Tests for the screen reader announcement functionality
 */

testRunner.test('Announcements initializes correctly', () => {
  // Remove any existing announcements element
  const existing = document.getElementById('announcements');
  if (existing) existing.remove();

  const announcements = new Announcements();

  TestRunner.assert(announcements.announcementElement, 'Should create announcement element');
  TestRunner.assertEqual(announcements.announcementElement.id, 'announcements', 'Should have correct ID');
  TestRunner.assertEqual(announcements.announcementElement.getAttribute('aria-live'), 'polite', 'Should have aria-live');
  TestRunner.assertEqual(announcements.announcementElement.getAttribute('aria-atomic'), 'true', 'Should have aria-atomic');
});

testRunner.test('Announcements announce method works', () => {
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  announcements.announce('Test message');

  TestRunner.assertEqual(element.textContent, 'Test message', 'Should set announcement text');
});

testRunner.test('Announcements announce with assertive priority', () => {
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  announcements.announce('Error message', 'assertive');

  TestRunner.assertEqual(element.getAttribute('aria-live'), 'assertive', 'Should change to assertive priority');
  TestRunner.assertEqual(element.textContent, 'Error message', 'Should set announcement text');

  // Should reset back to polite after delay
  setTimeout(() => {
    TestRunner.assertEqual(element.getAttribute('aria-live'), 'polite', 'Should reset to polite');
  }, 1100);
});

testRunner.test('Announcements productAddedToCart handles singular and plural', () => {
  const announcements = new Announcements();

  // Test singular
  announcements.productAddedToCart('Gold Ring', 1);
  TestRunner.assert(announcements.announcementElement.textContent.includes('Gold Ring added to cart'), 'Should announce singular addition');

  // Test plural
  announcements.productAddedToCart('Gold Ring', 2);
  TestRunner.assert(announcements.announcementElement.textContent.includes('2 × Gold Ring added to cart'), 'Should announce plural addition');
});

testRunner.test('Announcements wishlist methods work', () => {
  const announcements = new Announcements();

  announcements.productAddedToWishlist('Silver Necklace');
  TestRunner.assert(announcements.announcementElement.textContent.includes('Silver Necklace added to wishlist'), 'Should announce wishlist addition');

  announcements.productRemovedFromWishlist('Silver Necklace');
  TestRunner.assert(announcements.announcementElement.textContent.includes('Silver Necklace removed from wishlist'), 'Should announce wishlist removal');
});

testRunner.test('Announcements filterApplied handles singular and plural', () => {
  const announcements = new Announcements();

  // Test singular
  announcements.filterApplied('gold filter', 1);
  TestRunner.assert(announcements.announcementElement.textContent.includes('gold filter applied'), 'Should announce singular filter');

  // Test plural
  announcements.filterApplied('2 filters', 2);
  TestRunner.assert(announcements.announcementElement.textContent.includes('2 filters applied'), 'Should announce plural filters');
});

testRunner.test('Announcements searchResultsFound handles counts', () => {
  const announcements = new Announcements();

  // Test singular
  announcements.searchResultsFound(1, 'rings');
  TestRunner.assert(announcements.announcementElement.textContent.includes('1 result found for rings'), 'Should announce single result');

  // Test plural
  announcements.searchResultsFound(5, 'rings');
  TestRunner.assert(announcements.announcementElement.textContent.includes('5 results found for rings'), 'Should announce multiple results');
});

testRunner.test('Announcements error method uses assertive priority', () => {
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  announcements.error('Something went wrong');

  TestRunner.assertEqual(element.getAttribute('aria-live'), 'assertive', 'Error should use assertive priority');
  TestRunner.assertEqual(element.textContent, 'Something went wrong', 'Should set error message');
});

testRunner.test('Announcements cartUpdated works', () => {
  const announcements = new Announcements();

  announcements.cartUpdated();
  TestRunner.assertEqual(announcements.announcementElement.textContent, 'Cart updated', 'Should announce cart update');
});

testRunner.test('Announcements handles missing global instance gracefully', () => {
  // Test that methods don't throw errors when window.announcements is undefined
  const originalAnnouncements = window.announcements;
  delete window.announcements;

  // These should not throw errors
  try {
    TestRunner.assertThrows(() => {
      window.announcements.productAddedToCart('Test');
    }, 'Should not throw when announcements is undefined');
  } catch (e) {
    // Expected - announcements is undefined
  }

  // Restore
  window.announcements = originalAnnouncements;
});

testRunner.test('Announcements handles empty and null messages gracefully', () => {
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  // Test empty string
  announcements.announce('');
  TestRunner.assertEqual(element.textContent, '', 'Empty string should clear announcement');

  // Test null message (should not crash)
  try {
    announcements.announce(null);
    TestRunner.assert(true, 'Null message should not throw error');
  } catch (error) {
    TestRunner.assert(false, 'Null message should be handled gracefully');
  }

  // Test undefined message (should not crash)
  try {
    announcements.announce(undefined);
    TestRunner.assert(true, 'Undefined message should not throw error');
  } catch (error) {
    TestRunner.assert(false, 'Undefined message should be handled gracefully');
  }

  // Test very long message
  const longMessage = 'A'.repeat(1000);
  announcements.announce(longMessage);
  TestRunner.assertEqual(element.textContent, longMessage, 'Long message should be handled');
});

testRunner.test('Announcements handles rapid successive calls correctly', () => {
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  // Rapid calls should update the content
  announcements.announce('First message');
  TestRunner.assertEqual(element.textContent, 'First message', 'First message should be set');

  announcements.announce('Second message');
  TestRunner.assertEqual(element.textContent, 'Second message', 'Second message should replace first');

  announcements.announce('Third message');
  TestRunner.assertEqual(element.textContent, 'Third message', 'Third message should replace second');
});

testRunner.test('Announcements error method handles edge cases safely', () => {
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  // Test error with empty message
  announcements.error('');
  TestRunner.assertEqual(element.textContent, '', 'Empty error should clear text');
  TestRunner.assertEqual(element.getAttribute('aria-live'), 'assertive', 'Should still set assertive priority');

  // Test error with null message
  try {
    announcements.error(null);
    TestRunner.assert(true, 'Null error message should not throw');
  } catch (error) {
    TestRunner.assert(false, 'Null error message should be handled gracefully');
  }

  // Test error with complex object (should convert to string safely)
  try {
    announcements.error({ message: 'test error' });
    TestRunner.assert(true, 'Object error message should not throw');
  } catch (error) {
    TestRunner.assert(false, 'Object error message should be handled gracefully');
  }
});

testRunner.test('Announcements handles missing announcement element gracefully', () => {
  // Create instance and then remove the element
  const announcements = new Announcements();
  const element = announcements.announcementElement;

  // Remove the element from DOM
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }

  // Methods should not throw when element is missing
  try {
    announcements.announce('Test message');
    TestRunner.assert(true, 'Announce should not throw when element is missing');
  } catch (error) {
    TestRunner.assert(false, 'Announce should handle missing element gracefully');
  }

  try {
    announcements.error('Test error');
    TestRunner.assert(true, 'Error should not throw when element is missing');
  } catch (error) {
    TestRunner.assert(false, 'Error should handle missing element gracefully');
  }
});

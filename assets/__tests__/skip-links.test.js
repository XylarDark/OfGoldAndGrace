/**
 * Skip Links Tests
 * Tests for skip link visibility and navigation announcements
 */

testRunner.test('Skip links are hidden by default', () => {
  // Create a skip link with sr-only class
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link sr-only';
  skipLink.setAttribute('data-skip-target', 'nonexistent-target');
  skipLink.textContent = 'Skip to main content';
  document.body.appendChild(skipLink);

  // Initialize skip links (simulate module load)
  if (window.skipLinks && typeof window.skipLinks.init === 'function') {
    window.skipLinks.init();
  }

  // Should remain hidden since target doesn't exist
  TestRunner.assert(skipLink.classList.contains('sr-only'), 'Skip link should remain hidden when target does not exist');

  // Clean up
  document.body.removeChild(skipLink);
});

testRunner.test('Skip links are revealed when target exists', () => {
  // Create target element
  const targetElement = document.createElement('div');
  targetElement.id = 'main-content';
  document.body.appendChild(targetElement);

  // Create skip link
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link sr-only';
  skipLink.setAttribute('data-skip-target', 'main-content');
  skipLink.textContent = 'Skip to main content';
  document.body.appendChild(skipLink);

  // Initialize skip links
  if (window.skipLinks && typeof window.skipLinks.init === 'function') {
    window.skipLinks.init();
  }

  // Should be revealed
  TestRunner.assert(!skipLink.classList.contains('sr-only'), 'Skip link should be revealed when target exists');

  // Clean up
  document.body.removeChild(skipLink);
  document.body.removeChild(targetElement);
});

testRunner.test('Skip link click announces navigation', () => {
  // Mock announcements utility
  let lastAnnouncement = null;
  window.announcements = {
    announce: function(message) {
      lastAnnouncement = message;
    }
  };

  // Create target element
  const targetElement = document.createElement('div');
  targetElement.id = 'navigation';
  document.body.appendChild(targetElement);

  // Create skip link
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link sr-only';
  skipLink.setAttribute('data-skip-target', 'navigation');
  skipLink.textContent = 'Skip to navigation';
  document.body.appendChild(skipLink);

  // Initialize skip links
  if (window.skipLinks && typeof window.skipLinks.init === 'function') {
    window.skipLinks.init();
  }

  // Simulate click
  skipLink.click();

  // Should announce navigation activation
  TestRunner.assertEqual(lastAnnouncement, 'Skip to navigation navigation activated',
    'Clicking skip link should announce navigation activation');

  // Clean up
  document.body.removeChild(skipLink);
  document.body.removeChild(targetElement);
  delete window.announcements;
});

testRunner.test('Skip link handles missing announcements utility gracefully', () => {
  // Ensure announcements is not available
  const originalAnnouncements = window.announcements;
  delete window.announcements;

  // Create target element
  const targetElement = document.createElement('div');
  targetElement.id = 'search';
  document.body.appendChild(targetElement);

  // Create skip link
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link sr-only';
  skipLink.setAttribute('data-skip-target', 'search');
  skipLink.textContent = 'Skip to search';
  document.body.appendChild(skipLink);

  // Initialize skip links
  if (window.skipLinks && typeof window.skipLinks.init === 'function') {
    window.skipLinks.init();
  }

  // Simulate click (should not throw)
  try {
    skipLink.click();
    TestRunner.assert(true, 'Skip link click should not throw when announcements utility is missing');
  } catch (error) {
    TestRunner.assert(false, 'Skip link click should handle missing announcements utility gracefully');
  }

  // Clean up
  document.body.removeChild(skipLink);
  document.body.removeChild(targetElement);
  if (originalAnnouncements) {
    window.announcements = originalAnnouncements;
  }
});

testRunner.test('Multiple skip links are handled correctly', () => {
  // Create multiple target elements
  const mainContent = document.createElement('div');
  mainContent.id = 'MainContent';
  document.body.appendChild(mainContent);

  const navigation = document.createElement('div');
  navigation.id = 'site-nav';
  document.body.appendChild(navigation);

  // Create multiple skip links
  const skipToContent = document.createElement('a');
  skipToContent.className = 'skip-link sr-only';
  skipToContent.setAttribute('data-skip-target', 'MainContent');
  skipToContent.textContent = 'Skip to content';
  document.body.appendChild(skipToContent);

  const skipToNav = document.createElement('a');
  skipToNav.className = 'skip-link sr-only';
  skipToNav.setAttribute('data-skip-target', 'site-nav');
  skipToNav.textContent = 'Skip to navigation';
  document.body.appendChild(skipToNav);

  const skipToMissing = document.createElement('a');
  skipToMissing.className = 'skip-link sr-only';
  skipToMissing.setAttribute('data-skip-target', 'missing-target');
  skipToMissing.textContent = 'Skip to footer';
  document.body.appendChild(skipToMissing);

  // Initialize skip links
  if (window.skipLinks && typeof window.skipLinks.init === 'function') {
    window.skipLinks.init();
  }

  // Check results
  TestRunner.assert(!skipToContent.classList.contains('sr-only'), 'Valid skip link should be revealed');
  TestRunner.assert(!skipToNav.classList.contains('sr-only'), 'Valid skip link should be revealed');
  TestRunner.assert(skipToMissing.classList.contains('sr-only'), 'Invalid skip link should remain hidden');

  // Clean up
  document.body.removeChild(skipToContent);
  document.body.removeChild(skipToNav);
  document.body.removeChild(skipToMissing);
  document.body.removeChild(mainContent);
  document.body.removeChild(navigation);
});

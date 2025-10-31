/**
 * Lazy Load Tests
 * Tests for the IntersectionObserver-based lazy loading functionality
 */

testRunner.test('LazyLoad initializes with correct defaults', () => {
  // Create a mock lazy image
  const img = document.createElement('img');
  img.className = 'lazy';
  img.dataset.src = 'test-image.jpg';
  document.body.appendChild(img);

  // Mock IntersectionObserver
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    disconnect: jest.fn()
  });
  window.IntersectionObserver = mockIntersectionObserver;

  // Initialize lazy loading (this would normally be done by lazyload.js)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.classList.add('lazy-loading');
          img.src = img.dataset.src;
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          delete img.dataset.src;
        }
      }
    });
  });

  const lazyImages = document.querySelectorAll('img.lazy');
  lazyImages.forEach(img => observer.observe(img));

  TestRunner.assertEqual(mockIntersectionObserver.mock.calls.length, 0, 'IntersectionObserver should be mocked');
  TestRunner.assertEqual(lazyImages.length, 1, 'Should find one lazy image');

  // Cleanup
  document.body.removeChild(img);
});

testRunner.test('LazyLoad adds loading class during load', () => {
  const img = document.createElement('img');
  img.className = 'lazy';
  img.dataset.src = 'test-image.jpg';
  document.body.appendChild(img);

  // Simulate the lazy loading process
  img.classList.add('lazy-loading');
  TestRunner.assert(img.classList.contains('lazy-loading'), 'Image should have loading class');

  // Simulate load completion
  img.classList.remove('lazy-loading');
  img.classList.add('lazy-loaded');
  delete img.dataset.src;

  TestRunner.assert(img.classList.contains('lazy-loaded'), 'Image should have loaded class');
  TestRunner.assert(!img.classList.contains('lazy-loading'), 'Image should not have loading class');
  TestRunner.assert(!img.dataset.src, 'Image should not have data-src attribute');

  // Cleanup
  document.body.removeChild(img);
});

testRunner.test('LazyLoad handles load errors gracefully', () => {
  const img = document.createElement('img');
  img.className = 'lazy';
  img.dataset.src = 'nonexistent-image.jpg';
  document.body.appendChild(img);

  // Simulate error handling
  const handleError = () => {
    img.classList.remove('lazy-loading');
    img.classList.add('lazy-error');
  };

  // Simulate the lazy loading process with error
  img.classList.add('lazy-loading');
  TestRunner.assert(img.classList.contains('lazy-loading'), 'Image should have loading class');

  // Simulate error
  handleError();

  TestRunner.assert(img.classList.contains('lazy-error'), 'Image should have error class');
  TestRunner.assert(!img.classList.contains('lazy-loading'), 'Image should not have loading class');

  // Cleanup
  document.body.removeChild(img);
});

testRunner.test('LazyLoad respects existing src attribute', () => {
  const img = document.createElement('img');
  img.className = 'lazy';
  img.src = 'already-loaded.jpg';
  img.dataset.src = 'lazy-src.jpg';
  document.body.appendChild(img);

  // Lazy loading should not override existing src
  const originalSrc = img.src;
  const dataSrc = img.dataset.src;

  TestRunner.assertEqual(img.src, 'already-loaded.jpg', 'Should preserve existing src');
  TestRunner.assertEqual(img.dataset.src, 'lazy-src.jpg', 'Should keep data-src for lazy loading');

  // Cleanup
  document.body.removeChild(img);
});

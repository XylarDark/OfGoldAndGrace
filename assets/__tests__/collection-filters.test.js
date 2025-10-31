/**
 * Collection Filters Tests
 * Tests for the client-side filtering functionality
 */

testRunner.test('CollectionFilters initializes with URL parameters', () => {
  // Mock URL with filter parameters
  const originalLocation = window.location;
  delete window.location;
  window.location = new URL('https://example.com/collections/all?tag=gold&tag=silver&price_min=50&availability=in-stock');

  const filters = new CollectionFilters();

  TestRunner.assertEqual(filters.activeFilters.tags.length, 2, 'Should parse tag filters from URL');
  TestRunner.assert(filters.activeFilters.tags.includes('gold'), 'Should include gold tag');
  TestRunner.assert(filters.activeFilters.tags.includes('silver'), 'Should include silver tag');
  TestRunner.assertEqual(filters.activeFilters.price_min, '50', 'Should parse price_min');
  TestRunner.assertEqual(filters.activeFilters.availability, 'in-stock', 'Should parse availability');

  // Restore original location
  window.location = originalLocation;
});

testRunner.test('CollectionFilters updates URL when filters change', () => {
  const filters = new CollectionFilters();
  const originalLocation = window.location;

  // Mock location for URL testing
  let currentUrl = 'https://example.com/collections/all';
  Object.defineProperty(window, 'location', {
    value: {
      href: currentUrl,
      search: '',
      pathname: '/collections/all'
    },
    writable: true
  });

  // Mock history.replaceState
  const replaceStateCalls = [];
  window.history.replaceState = (...args) => {
    replaceStateCalls.push(args);
    // Update current URL
    currentUrl = args[2];
  };

  // Apply some filters
  filters.activeFilters.tags = ['gold', 'rings'];
  filters.activeFilters.price_max = '200';
  filters.updateURL();

  TestRunner.assert(replaceStateCalls.length > 0, 'Should call history.replaceState');
  TestRunner.assert(currentUrl.includes('tag=gold'), 'URL should include gold tag');
  TestRunner.assert(currentUrl.includes('tag=rings'), 'URL should include rings tag');
  TestRunner.assert(currentUrl.includes('price_max=200'), 'URL should include price_max');

  // Restore
  window.location = originalLocation;
});

testRunner.test('CollectionFilters filters products correctly', () => {
  const filters = new CollectionFilters();

  // Create mock product cards
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="product-card" data-product-id="1" data-product-tags="gold,rings" data-product-price="100" data-product-available="true">Product 1</div>
    <div class="product-card" data-product-id="2" data-product-tags="silver,necklaces" data-product-price="200" data-product-available="true">Product 2</div>
    <div class="product-card" data-product-id="3" data-product-tags="gold,bracelets" data-product-price="50" data-product-available="false">Product 3</div>
  `;
  document.body.appendChild(container);

  // Test tag filtering
  filters.activeFilters.tags = ['gold'];
  filters.applyFilters();

  const visibleProducts = container.querySelectorAll('.product-card:not([style*="display: none"])');
  TestRunner.assertEqual(visibleProducts.length, 2, 'Should show 2 gold products');

  // Test price filtering
  filters.activeFilters.tags = [];
  filters.activeFilters.price_max = '150';
  filters.applyFilters();

  const priceFilteredProducts = container.querySelectorAll('.product-card:not([style*="display: none"])');
  TestRunner.assertEqual(priceFilteredProducts.length, 2, 'Should show 2 products under $150');

  // Test availability filtering
  filters.activeFilters.price_max = '';
  filters.activeFilters.availability = 'in-stock';
  filters.applyFilters();

  const availableProducts = container.querySelectorAll('.product-card:not([style*="display: none"])');
  TestRunner.assertEqual(availableProducts.length, 2, 'Should show 2 in-stock products');

  // Cleanup
  document.body.removeChild(container);
});

testRunner.test('CollectionFilters handles empty results', () => {
  const filters = new CollectionFilters();

  // Create mock products
  const container = document.createElement('div');
  container.innerHTML = `
    <div data-results-count></div>
    <div data-no-results style="display: none;">No results</div>
    <div class="product-card" data-product-id="1" data-product-tags="silver" data-product-price="100" data-product-available="true">Product 1</div>
  `;
  document.body.appendChild(container);

  // Apply filter that matches nothing
  filters.activeFilters.tags = ['nonexistent'];
  filters.applyFilters();

  const noResults = container.querySelector('[data-no-results]');
  const resultsCount = container.querySelector('[data-results-count]');
  const visibleProducts = container.querySelectorAll('.product-card:not([style*="display: none"])');

  TestRunner.assertEqual(window.getComputedStyle(noResults).display, 'block', 'Should show no results message');
  TestRunner.assertEqual(visibleProducts.length, 0, 'Should hide all products');
  TestRunner.assert(resultsCount.textContent.includes('0 of 1'), 'Should show correct count');

  // Cleanup
  document.body.removeChild(container);
});

testRunner.test('CollectionFilters clears all filters correctly', () => {
  const filters = new CollectionFilters();

  // Set some filters
  filters.activeFilters.tags = ['gold', 'silver'];
  filters.activeFilters.price_min = '50';
  filters.activeFilters.availability = 'in-stock';

  // Mock checkboxes and inputs
  document.body.innerHTML = `
    <input type="checkbox" data-tag-checkbox value="gold" checked>
    <input type="checkbox" data-tag-checkbox value="silver" checked>
    <input data-price-min value="50">
    <input data-availability-filter checked>
  `;

  filters.clearAllFilters();

  TestRunner.assertEqual(filters.activeFilters.tags.length, 0, 'Should clear tags');
  TestRunner.assert(!filters.activeFilters.price_min, 'Should clear price_min');
  TestRunner.assert(!filters.activeFilters.availability, 'Should clear availability');

  // Check UI updates
  const checkedBoxes = document.querySelectorAll('input:checked');
  const priceInput = document.querySelector('[data-price-min]');

  TestRunner.assertEqual(checkedBoxes.length, 0, 'Should uncheck all checkboxes');
  TestRunner.assertEqual(priceInput.value, '', 'Should clear price input');

  // Cleanup
  document.body.innerHTML = '';
});

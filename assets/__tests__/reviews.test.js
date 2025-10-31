/**
 * Reviews Widget Tests
 * Tests for the reviews UI functionality
 */

testRunner.test('ReviewsWidget initializes without errors', () => {
  // Mock fetch for reviews data
  const mockReviewsData = {
    aggregateRating: {
      ratingValue: '4.8',
      reviewCount: '24'
    },
    reviews: [
      {
        id: 'review-1',
        author: { name: 'Test User' },
        reviewRating: { ratingValue: '5' },
        reviewBody: 'Great product!',
        datePublished: '2024-01-15',
        verified: true
      }
    ]
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockReviewsData)
    })
  );

  const container = document.createElement('div');
  container.setAttribute('data-reviews-widget', '');
  document.body.appendChild(container);

  // Mock DOM elements that ReviewsWidget expects
  container.innerHTML = `
    <div class="reviews__summary">
      <div class="reviews__stars" data-rating-stars></div>
      <span data-rating-value></span>
      <span data-review-count></span>
    </div>
    <div data-reviews-list></div>
    <div data-reviews-pagination></div>
  `;

  const widget = new ReviewsWidget(container);

  // Wait for initialization
  setTimeout(() => {
    TestRunner.assert(container.querySelector('[data-rating-stars]'), 'Should render star rating container');
    TestRunner.assert(container.querySelector('[data-reviews-list]'), 'Should render reviews list container');
    TestRunner.assertEqual(global.fetch.mock.calls.length, 1, 'Should fetch reviews data');

    // Cleanup
    document.body.removeChild(container);
    delete global.fetch;
  }, 100);
});

testRunner.test('ReviewsWidget renders star ratings correctly', () => {
  const container = document.createElement('div');
  const starsContainer = document.createElement('div');
  container.appendChild(starsContainer);

  const widget = new ReviewsWidget(container); // Not fully initialized, just for method access

  // Test full stars (rating 5)
  widget.renderStars(starsContainer, 5);
  const fullStars = starsContainer.querySelectorAll('svg');
  TestRunner.assertEqual(fullStars.length, 5, 'Should render 5 stars for rating 5');

  // Test half stars (rating 4.5)
  starsContainer.innerHTML = '';
  widget.renderStars(starsContainer, 4.5);
  const halfStars = starsContainer.querySelectorAll('svg');
  TestRunner.assertEqual(halfStars.length, 5, 'Should render 5 stars for rating 4.5');

  // Test empty stars (rating 3)
  starsContainer.innerHTML = '';
  widget.renderStars(starsContainer, 3);
  const partialStars = starsContainer.querySelectorAll('svg');
  TestRunner.assertEqual(partialStars.length, 5, 'Should render 5 stars for rating 3');

  // Cleanup
  document.body.removeChild(container);
});

testRunner.test('ReviewsWidget formats dates correctly', () => {
  const widget = new ReviewsWidget(document.createElement('div'));

  const testDate = '2024-01-15';
  const formatted = widget.formatDate(testDate);

  TestRunner.assert(formatted.includes('Jan'), 'Should format month correctly');
  TestRunner.assert(formatted.includes('15'), 'Should include day');
  TestRunner.assert(formatted.includes('2024'), 'Should include year');
});

testRunner.test('ReviewsWidget handles pagination correctly', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div data-reviews-pagination style="display: none;">
      <button data-pagination-prev disabled></button>
      <span data-pagination-info></span>
      <button data-pagination-next></button>
    </div>
  `;

  const widget = new ReviewsWidget(container);
  widget.reviewsPerPage = 5;

  // Test with few reviews (no pagination needed)
  widget.filteredReviews = [{}, {}, {}];
  widget.currentPage = 1;
  widget.renderPagination();

  const paginationEl = container.querySelector('[data-reviews-pagination]');
  TestRunner.assertEqual(paginationEl.style.display, 'none', 'Should hide pagination for few reviews');

  // Test with many reviews (pagination needed)
  widget.filteredReviews = Array(12).fill({}); // 12 reviews
  widget.renderPagination();

  TestRunner.assertEqual(paginationEl.style.display, 'flex', 'Should show pagination for many reviews');

  const prevBtn = container.querySelector('[data-pagination-prev]');
  const nextBtn = container.querySelector('[data-pagination-next]');
  const infoEl = container.querySelector('[data-pagination-info]');

  TestRunner.assert(prevBtn.disabled, 'Prev button should be disabled on first page');
  TestRunner.assert(!nextBtn.disabled, 'Next button should be enabled');
  TestRunner.assert(infoEl.textContent.includes('1-5'), 'Should show correct page info');

  // Cleanup
  document.body.removeChild(container);
});

testRunner.test('ReviewsWidget applies filters correctly', () => {
  const widget = new ReviewsWidget(document.createElement('div'));

  // Mock reviews data
  widget.reviewsData = {
    reviews: [
      { reviewRating: { ratingValue: '5' }, datePublished: '2024-01-15' },
      { reviewRating: { ratingValue: '4' }, datePublished: '2024-01-10' },
      { reviewRating: { ratingValue: '3' }, datePublished: '2024-01-05' }
    ]
  };

  // Test no filter
  widget.currentFilter = 'all';
  widget.applyFiltersAndSort();
  TestRunner.assertEqual(widget.filteredReviews.length, 3, 'Should show all reviews when no filter');

  // Test 5-star filter
  widget.currentFilter = '5';
  widget.applyFiltersAndSort();
  TestRunner.assertEqual(widget.filteredReviews.length, 1, 'Should filter to only 5-star reviews');

  // Test sorting by newest
  widget.currentSort = 'newest';
  widget.applyFiltersAndSort();
  TestRunner.assertEqual(widget.filteredReviews[0].datePublished, '2024-01-15', 'Should sort newest first');
});

testRunner.test('ReviewsWidget handles missing data gracefully', () => {
  const container = document.createElement('div');
  container.setAttribute('data-reviews-widget', '');
  document.body.appendChild(container);

  // Mock failed fetch
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );

  const widget = new ReviewsWidget(container);

  // Wait for error handling
  setTimeout(() => {
    TestRunner.assert(container.querySelector('.reviews__error'), 'Should show error message on fetch failure');

    // Cleanup
    document.body.removeChild(container);
    delete global.fetch;
  }, 100);
});

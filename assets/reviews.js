/**
 * Reviews Widget
 * Loads and displays product reviews with filtering and pagination
 */

class ReviewsWidget {
  constructor(container) {
    this.container = container;
    this.reviewsData = null;
    this.filteredReviews = [];
    this.currentPage = 1;
    this.reviewsPerPage = 5;
    this.currentSort = 'newest';
    this.currentFilter = 'all';

    this.init();
  }

  async init() {
    try {
      await this.loadReviewsData();
      this.renderWidget();
      this.bindEvents();
    } catch (error) {
      console.error('Failed to initialize reviews widget:', error);
      this.showError();
    }
  }

  async loadReviewsData() {
    const response = await fetch('{{ "reviews.json" | asset_url }}');
    if (!response.ok) {
      throw new Error('Failed to load reviews data');
    }
    this.reviewsData = await response.json();
  }

  renderWidget() {
    this.renderSummary();
    this.applyFiltersAndSort();
    this.renderReviews();
    this.renderPagination();
  }

  renderSummary() {
    const summaryEl = this.container.querySelector('.reviews__summary');
    const aggregateRating = this.reviewsData.aggregateRating;

    // Render stars
    const starsContainer = summaryEl.querySelector('[data-rating-stars]');
    const rating = parseFloat(aggregateRating.ratingValue);
    this.renderStars(starsContainer, rating);

    // Set rating value
    const ratingValueEl = summaryEl.querySelector('[data-rating-value]');
    ratingValueEl.textContent = rating.toFixed(1);

    // Set review count
    const reviewCountEl = summaryEl.querySelector('[data-review-count]');
    reviewCountEl.textContent = aggregateRating.reviewCount;
  }

  renderStars(container, rating) {
    container.innerHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      container.appendChild(this.createStar(true));
    }

    // Half star
    if (hasHalfStar) {
      container.appendChild(this.createStar(true, true));
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      container.appendChild(this.createStar(false));
    }
  }

  createStar(filled, half = false) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');

    if (filled) {
      path.setAttribute('fill', '#ffc107');
      path.setAttribute('stroke', '#ffc107');
    } else {
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#ddd');
    }

    if (half) {
      // Create half star effect
      path.setAttribute('fill', 'url(#half)');
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      linearGradient.setAttribute('id', 'half');
      linearGradient.setAttribute('x1', '0%');
      linearGradient.setAttribute('y1', '0%');
      linearGradient.setAttribute('x2', '100%');
      linearGradient.setAttribute('y2', '0%');

      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '50%');
      stop1.setAttribute('stop-color', '#ffc107');
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '50%');
      stop2.setAttribute('stop-color', '#ddd');

      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      defs.appendChild(linearGradient);
      svg.appendChild(defs);
    }

    svg.appendChild(path);
    return svg;
  }

  applyFiltersAndSort() {
    let reviews = [...this.reviewsData.reviews];

    // Apply rating filter
    if (this.currentFilter !== 'all') {
      const targetRating = parseInt(this.currentFilter);
      reviews = reviews.filter(review => parseInt(review.reviewRating.ratingValue) === targetRating);
    }

    // Apply sorting
    reviews.sort((a, b) => {
      switch (this.currentSort) {
        case 'newest':
          return new Date(b.datePublished) - new Date(a.datePublished);
        case 'oldest':
          return new Date(a.datePublished) - new Date(b.datePublished);
        case 'highest':
          return parseInt(b.reviewRating.ratingValue) - parseInt(a.reviewRating.ratingValue);
        case 'lowest':
          return parseInt(a.reviewRating.ratingValue) - parseInt(b.reviewRating.ratingValue);
        default:
          return 0;
      }
    });

    this.filteredReviews = reviews;
    this.currentPage = 1; // Reset to first page when filtering/sorting
  }

  renderReviews() {
    const reviewsList = this.container.querySelector('[data-reviews-list]');
    reviewsList.innerHTML = '';

    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    const reviewsToShow = this.filteredReviews.slice(startIndex, endIndex);

    reviewsToShow.forEach(review => {
      const reviewElement = this.createReviewElement(review);
      reviewsList.appendChild(reviewElement);
    });
  }

  createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';

    const starsContainer = document.createElement('div');
    starsContainer.className = 'review-item__rating';
    this.renderStars(starsContainer, parseInt(review.reviewRating.ratingValue));

    reviewDiv.innerHTML = `
      <div class="review-item__header">
        <div class="review-item__author">${review.author.name}</div>
        <div class="review-item__meta">
          <div class="review-item__rating"></div>
          <time datetime="${review.datePublished}">${this.formatDate(review.datePublished)}</time>
          ${review.verified ? `<span class="review-item__verified">✓ Verified Purchase</span>` : ''}
        </div>
      </div>
      <p class="review-item__body">${review.reviewBody}</p>
    `;

    // Insert stars into the rating container
    const ratingContainer = reviewDiv.querySelector('.review-item__rating');
    ratingContainer.appendChild(starsContainer);

    return reviewDiv;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  renderPagination() {
    const paginationEl = this.container.querySelector('[data-reviews-pagination]');
    const totalPages = Math.ceil(this.filteredReviews.length / this.reviewsPerPage);

    if (totalPages <= 1) {
      paginationEl.style.display = 'none';
      return;
    }

    paginationEl.style.display = 'flex';

    const prevBtn = paginationEl.querySelector('[data-pagination-prev]');
    const nextBtn = paginationEl.querySelector('[data-pagination-next]');
    const infoEl = paginationEl.querySelector('[data-pagination-info]');

    prevBtn.disabled = this.currentPage === 1;
    nextBtn.disabled = this.currentPage === totalPages;

    const startItem = (this.currentPage - 1) * this.reviewsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.reviewsPerPage, this.filteredReviews.length);

    infoEl.textContent = `Showing ${startItem}-${endItem} of ${this.filteredReviews.length} reviews`;
  }

  bindEvents() {
    // Sort change
    const sortSelect = this.container.querySelector('[data-reviews-sort]');
    sortSelect.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.applyFiltersAndSort();
      this.renderReviews();
      this.renderPagination();
    });

    // Filter change
    const filterSelect = this.container.querySelector('[data-reviews-filter]');
    filterSelect.addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.applyFiltersAndSort();
      this.renderReviews();
      this.renderPagination();
    });

    // Pagination
    const prevBtn = this.container.querySelector('[data-pagination-prev]');
    const nextBtn = this.container.querySelector('[data-pagination-next]');

    prevBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderReviews();
        this.renderPagination();
      }
    });

    nextBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderReviews();
        this.renderPagination();
      }
    });
  }

  showError() {
    this.container.innerHTML = `
      <div class="reviews__error">
        <p>Unable to load reviews at this time. Please try again later.</p>
      </div>
    `;
  }
}

// Initialize reviews widgets when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const reviewWidgets = document.querySelectorAll('[data-reviews-widget]');
  reviewWidgets.forEach(widget => {
    new ReviewsWidget(widget);
  });
});

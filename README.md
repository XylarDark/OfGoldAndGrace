# Of Gold And Grace - Shopify Theme

A minimal-cost Shopify theme for an online-only jewellery store featuring consignment locations map and ChatGPT Shopping integration.

## ✨ Features

- **Online-only sales**: No POS or physical store integration
- **Jewellery-focused PDP**: Metal variant swatches, size guide modal, care instructions, gift wrapping
- **Interactive Quick View**: Instant product preview without page navigation
- **Persistent Wishlist**: localStorage-based favorites with heart toggle UI and dedicated page
- **Product Reviews**: Static review scaffold with star ratings, filtering, and pagination (upgradeable to app)
- **Consignment locations map**: Interactive Leaflet-powered map showing partner stores
- **Free ChatGPT Shopping**: Via Shopify Shop channel (requires account setup)
- **Client-Side Collection Filtering**: Advanced tag-based filters with URL synchronization and real-time results
- **Enhanced Accessibility**: Comprehensive screen reader announcements for all user actions
- **Production-Ready SEO**: robots.txt, hardened JSON-LD with safe fallbacks, and conditional structured data
- **Advanced Theme Settings**: Easy configuration for reviews, social media, and analytics
- **Responsive Images**: Optimized srcset/sizes for all product images to improve Core Web Vitals
- **Structured Data (JSON-LD)**: Rich snippets for products, breadcrumbs, organization, and website schema
- **Breadcrumb Navigation**: Semantic breadcrumbs on all product and collection pages
- **Screen Reader Accessibility**: Global aria-live region with announcements for cart/wishlist actions
- **Accessibility-first**: WCAG AA compliant with keyboard navigation, skip links, and ARIA labels
- **Performance optimized**: Lazy loading images, deferred JS, Core Web Vitals monitoring
- **Mobile responsive**: Optimized for all device sizes with fluid typography and spacing
- **SEO ready**: Structured data, meta tags, semantic HTML, and breadcrumb navigation
- **Comprehensive testing**: Built-in JavaScript test suite covering all major components

## 🛠️ Development Guidelines

This project follows comprehensive development standards curated from [cursor.directory](https://cursor.directory/) best practices for Shopify theme development. All rules are documented in `.cursorrules` and enforced through:

- **Automated CI/CD**: Linting, formatting, and Liquid validation on every PR
- **Code Review Requirements**: PR template with testing and accessibility checklists
- **Performance Budgets**: Core Web Vitals targets and bundle size limits
- **Accessibility Standards**: WCAG AA compliance with automated and manual testing

### Key Principles
- **Minimal Cost**: Shopify Online Store 2.0 theme only - no headless stack or paid services
- **Accessibility First**: WCAG AA compliance with keyboard navigation and screen reader support
- **Performance Optimized**: Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- **Developer Experience**: Comprehensive testing, documentation, and automated workflows

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Shopify CLI (`npm install -g @shopify/cli @shopify/theme`)
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/of-gold-and-grace-theme.git
cd of-gold-and-grace-theme

# Install dependencies
npm install

# Start development server
shopify theme dev --store your-store.myshopify.com
```

### Linting & Formatting

```bash
# Lint and fix code
npm run lint

# Format code
npm run format

# Type check (if TypeScript is added later)
npm run type-check
```

## 📁 Project Structure

```
├── assets/                 # Static files and JSON data
│   ├── consignment_locations.json    # Partner store locations
│   └── *.css/*.js           # Stylesheets and scripts
├── config/                 # Theme settings and schema
│   └── settings_schema.json # Theme customization options
├── layout/                 # Base layout templates
│   └── theme.liquid        # Main theme layout
├── sections/               # Page sections (reusable components)
│   ├── main-product.liquid        # Product detail page
│   ├── main-collection.liquid     # Collection/filtering page
│   └── consignment-locations-map.liquid # Locations map
├── snippets/               # Reusable code snippets
│   ├── size-guide.liquid          # Ring size guide modal
│   ├── care-warranty.liquid       # Care instructions
│   └── delivery-estimate.liquid   # Shipping estimates
├── templates/              # Page templates
│   ├── product.json        # Product page configuration
│   ├── collection.json     # Collection page configuration
│   └── page.consignment-locations.json # Locations page
└── locales/                # Translation files (to be added)
```

## 🎨 Customization

### Theme Settings

Configure the theme through Shopify Admin > Online Store > Themes > Customize:

- **Google Maps API Key**: For location map (optional, can use Leaflet)
- **Color schemes**: Customize brand colors
- **Typography**: Font selections
- **Layout options**: Grid configurations

### Adding Consignment Locations

Edit `assets/consignment_locations.json`:

```json
[
  {
    "partner": "Partner Store Name",
    "store": "Specific Location Name",
    "address": "Full street address",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "phone": "+1 (555) 123-4567",
    "hours": "Mon-Fri 10am-7pm, Sat 10am-6pm",
    "website": "https://partner-website.com"
  }
]
```

## 🎨 Theme Features

### Quick View Modal
Instant product preview without page navigation.

**Usage:**
- Hover over product cards in collections to see Quick View button
- Click to open modal with product details, variants, and add-to-cart
- Fully keyboard accessible with focus trap and escape key support

**Customization:**
- Modal styling in `sections/quick-view-modal.liquid`
- JavaScript behavior in `assets/quick-view.js`

### Wishlist Functionality
Persistent favorites using localStorage.

**Usage:**
- Click heart icon on product cards or product pages
- View saved items in dedicated wishlist section
- Items persist across browser sessions

**Customization:**
- Button styling in `snippets/wishlist-button.liquid`
- Wishlist page in `sections/wishlist.liquid`
- Storage logic in `assets/wishlist.js`

### Lazy Loading
Automatic image loading optimization.

**Implementation:**
- Uses IntersectionObserver API for performance
- Images load when entering viewport
- Includes loading states and error handling

**Pattern for custom images:**
```liquid
<img
  src="{{ image | img_url: '200x' }}"
  data-src="{{ image | img_url: '400x' }}"
  alt="Description"
  loading="lazy"
  width="400"
  height="400"
  style="aspect-ratio: 1;"
  class="lazy"
/>
```

### Accessibility Features
Comprehensive accessibility implementation.

**Included:**
- Skip links for main content, navigation, search, footer
- Enhanced focus indicators and keyboard navigation
- ARIA labels and live regions for dynamic content
- Modal focus management and screen reader support
- High contrast and reduced motion preferences

**Testing:**
- Keyboard-only navigation testing required
- Screen reader compatibility verification
- Color contrast ratios meet WCAG AA standards

## 🆕 New Features & Usage

### Product Reviews

The theme includes a static reviews scaffold that can be upgraded to use a reviews app later.

**Current Implementation:**
- Static review data in `assets/reviews.json`
- Star ratings, filtering, and pagination
- AggregateRating JSON-LD for SEO

**Upgrading to Reviews App:**
1. Install a Shopify reviews app (e.g., Judge.me, Loox, Yotpo)
2. Replace the static data with dynamic app data
3. Update `snippets/reviews.liquid` to use app-provided Liquid variables
4. Remove the "Enable Reviews App" notice

**Files:**
- `snippets/reviews.liquid` - Reviews UI component
- `assets/reviews.js` - Reviews functionality
- `assets/reviews.json` - Static review data

### Advanced Collection Filters

Tag-based filtering with URL synchronization for bookmarkable search states.

**Features:**
- Multi-select tag filters
- URL-based state management
- Responsive filter UI
- Clear/reset functionality

**Usage:**
- Filters automatically appear on collection pages
- Selected filters persist in URL for sharing/bookmarking
- Users can filter by product tags (e.g., "gold", "silver", "rings")

**Files:**
- `assets/collection-filters.js` - Filter functionality
- `sections/main-collection.liquid` - Filter UI integration

### Responsive Images

Optimized image delivery using srcset and sizes attributes for better performance.

**Implementation:**
- Product cards use responsive images (200px-500px)
- Quick View modal uses responsive images (400px-600px)
- Automatic fallback for older browsers

**Benefits:**
- Reduced bandwidth usage
- Improved Core Web Vitals (LCP, CLS)
- Better mobile performance

### Structured Data (JSON-LD)

Rich snippets for improved SEO and search result appearance.

**Schemas Included:**
- Organization schema (store info)
- Website schema (search functionality)
- Product schema (individual products)
- Collection schema (product listings)
- Breadcrumb schema (navigation)

**Benefits:**
- Enhanced search result snippets
- Rich cards in search results
- Better crawling/indexing

**Files:**
- `snippets/structured-data.liquid` - Dynamic schema generation

### Breadcrumb Navigation

Semantic breadcrumb navigation for improved UX and SEO.

**Features:**
- Automatic breadcrumb generation
- Schema.org structured data
- Accessible navigation
- Mobile responsive

**Pages with Breadcrumbs:**
- Product detail pages
- Collection pages
- Search results (when implemented)

### Screen Reader Accessibility

Global announcements for user actions to improve accessibility.

**Features:**
- aria-live region for announcements
- Cart addition announcements
- Wishlist updates
- Error messages
- Filter application feedback

**Announced Actions:**
- Product added to cart (with quantity)
- Product added/removed from wishlist
- Filter applications
- Form errors

**Files:**
- `assets/announcements.js` - Announcement utility
- Integrated into Quick View and Wishlist components

### Dedicated Wishlist Page

Standalone page for viewing saved items.

**Setup:**
1. Create a page in Shopify Admin with template "page.wishlist"
2. URL will be `/pages/wishlist`
3. Users can access saved items directly

**Files:**
- `templates/page.wishlist.json` - Page template
- `sections/wishlist.liquid` - Wishlist UI

## 🆕 Phase 4: Advanced Features & Polish

### Client-Side Collection Filtering

Advanced tag-based filtering with URL synchronization and real-time results.

**Features:**
- Multi-select tag, price, and availability filters
- URL-based state for bookmarkable filtered views
- Client-side filtering for instant results
- Results counter and empty state handling
- Clear all filters functionality

**Usage:**
- Filters automatically apply to collection pages
- URL parameters persist filter state across page reloads
- Users can share filtered collection URLs

**Files:**
- `assets/collection-filters.js` - Client-side filtering logic
- `sections/main-collection.liquid` - Updated with filter UI

### Enhanced Accessibility Announcements

Comprehensive screen reader support for all user actions.

**Announcements Include:**
- Product additions to cart (with quantities)
- Wishlist add/remove actions
- Filter applications and results
- Form submissions and errors
- Cart updates and navigation changes

**Implementation:**
- Global aria-live region for consistent announcements
- Priority-based messaging (polite vs assertive)
- Contextual announcements based on user actions

**Files:**
- `assets/announcements.js` - Announcement utility
- Integrated across Quick View, Wishlist, and filter components

### Production-Ready robots.txt

SEO-optimized search engine crawling instructions.

**Features:**
- Safe defaults allowing main content crawling
- Blocks sensitive areas (admin, checkout, API)
- Staging environment protection
- Clear customization instructions
- Sitemap location placeholder

**Customization:**
Edit `templates/robots.txt.liquid` for your specific needs before production deployment.

### Theme Settings Enhancement

Additional configuration options for better merchant control.

**New Settings:**
- **Enable Product Reviews**: Toggle reviews scaffold on/off
- **Social Media URLs**: Facebook, Instagram, Twitter links
- **GA4 Measurement ID**: Google Analytics integration

**Benefits:**
- Easy configuration through Shopify admin
- No code changes needed for basic setup
- Social links automatically included in structured data

**Location:**
- `config/settings_schema.json` - Settings definitions

### Hardened Structured Data

Robust JSON-LD with comprehensive fallbacks and conditional rendering.

**Improvements:**
- Safe fallbacks for missing brand logos and contact info
- Conditional social media links (only if configured)
- Proper product availability mapping (InStock/OutOfStock)
- Reviews ratings only when enabled
- Error-resistant JSON generation

**SEO Benefits:**
- Valid structured data even with incomplete merchant information
- Enhanced search result snippets
- Better social media integration

## 🛠️ Phase 5: Final Polish and Quality Assurance

### Infrastructure and Performance
- **Resource Hints**: Enhanced preconnect hints for Shopify CDN, Google Fonts, YouTube, and Vimeo domains
- **Product Media Snippet**: Comprehensive media rendering with responsive images, zoom functionality, and support for images, videos, external videos, and 3D models
  - Usage: `{% render 'product-media', media: media, variant_id: current_variant.id, section_id: section.id, zoomable: true %}`
  - Features: Automatic responsive images, video controls, external video embedding, 3D model viewer integration
  - **3D Models**: Optional and disabled by default. Enable via Theme Settings → "Enable 3D model viewer" to show 3D models for products that have them uploaded
- **Error Pages**: Friendly 404 template with search functionality and localized content

### Accessibility Improvements
- **Skip Link Validation**: Fixed broken skip-link targets with proper IDs for navigation, search, and footer
- **Navigation Announcements**: Screen reader feedback when skip-links are activated
- **Enhanced Announcements**: Extended coverage to wishlist page actions and collection filter changes

### Quality Assurance
- **Structured Data Testing**: JSON-LD validation tests to ensure schema correctness
- **Legacy Cleanup**: Removed duplicate and stale TODOs from previous development phases
- **Code Quality**: Consistent patterns and defensive programming throughout

### SEO Enhancements
- **Robots.txt Template**: Production-ready search engine crawling instructions with staging considerations
- **JSON-LD Hardening**: Safe fallbacks and conditional rendering for all structured data
- **Social Integration**: Theme settings for social media URLs with automatic schema inclusion

## 🚀 Deployment

### Via Shopify CLI (Recommended)

```bash
# Deploy to production
shopify theme push

# Deploy to specific theme
shopify theme push --theme-id YOUR_THEME_ID
```

### Manual Deployment

1. Zip the theme files (exclude `node_modules/`, `.git/`, etc.)
2. Upload via Shopify Admin > Online Store > Themes > Upload

## 🔧 Development Workflow

### Git Workflow

This project follows conventional commits:

```bash
# Feature development
git checkout -b feat/add-product-reviews
# Make changes...
git commit -m "feat: add product review section"

# Bug fixes
git commit -m "fix: resolve mobile menu accessibility issue"

# Documentation
git commit -m "docs: update setup instructions"
```

### Code Quality

- **Linting**: ESLint for JavaScript, Stylelint for CSS
- **Formatting**: Prettier for consistent code style
- **Accessibility**: Manual WCAG AA testing required
- **Performance**: Lighthouse score target: 85+ performance, 90+ accessibility
- **Testing**: Built-in JavaScript test suite covering all major components

### Testing

Run the test suite to verify JavaScript functionality:

```bash
# Open test runner in browser
# Navigate to: assets/__tests__/test-runner.html

# Or run tests programmatically
# (Tests run automatically when the page loads)
```

**Test Coverage:**
- **Quick View**: Modal behavior, form submission, image loading, accessibility
- **Wishlist**: Add/remove/toggle/persistence, UI updates, error handling
- **Lazy Loading**: IntersectionObserver, loading states, error handling, responsive images
- **Reviews Widget**: Initialization, star rendering, filtering, pagination, date formatting
- **Collection Filters**: URL synchronization, multi-select logic, UI state management
- **Focus Management**: Modal focus traps, keyboard navigation
- **Error Handling**: Network failures, invalid data, edge cases

## 🤖 ChatGPT Shopping Integration

To enable free ChatGPT Shopping:

1. **Shopify Setup**:
   - Enable Shop sales channel in Shopify Admin
   - Configure Shopify Payments and Shop Pay
   - Add products to Shop channel

2. **Product Data Quality**:
   - Include GTIN/MPN for all products
   - Add high-quality images and descriptions
   - Set accurate pricing and shipping info

3. **Verification**:
   - Domain must be verified
   - Comply with Shop policies
   - Monitor performance in Shop channel analytics

## 📊 Analytics & Monitoring

### Performance Monitoring
- **Lighthouse**: Run monthly performance audits
- **Core Web Vitals**: Monitor in Google Search Console
- **Shopify Analytics**: Track conversion and user behavior

### SEO Checklist
- [ ] Meta titles and descriptions configured
- [ ] JSON-LD structured data implemented
- [ ] Image alt text added
- [ ] Sitemap submitted to Google
- [ ] Mobile-friendly design verified

### Accessibility Checklist
- [ ] Skip links work for main content, navigation, search, footer
- [ ] All interactive elements have visible focus indicators
- [ ] Keyboard navigation works without mouse (Tab, Enter, Space, Escape)
- [ ] Color contrast ratios meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- [ ] Images have descriptive alt text or are decorative
- [ ] Form fields have associated labels and error messages
- [ ] Modal dialogs trap focus and can be closed with Escape
- [ ] Screen reader announcements work for dynamic content
- [ ] Reduced motion preferences are respected
- [ ] High contrast mode is supported

### Performance Checklist
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Lazy loading active on all images below the fold
- [ ] Critical CSS inlined, non-critical CSS deferred
- [ ] JavaScript bundles loaded with defer attribute
- [ ] Unused CSS/JS removed or tree-shaken
- [ ] Images optimized (WebP format, proper sizing)
- [ ] Preconnect to external domains (fonts, CDN, analytics)
- [ ] Service worker implemented for caching (if needed)
- [ ] Database queries optimized (Liquid performance)
- [ ] CDN utilization maximized

## 🐛 Troubleshooting

### Common Issues

**Map not loading**:
- Check console for JavaScript errors
- Verify Leaflet CDN is accessible
- Confirm location data format is valid JSON

**Theme not deploying**:
- Ensure all required files are present
- Check for Liquid syntax errors
- Verify theme settings schema is valid

**Performance issues**:
- Run Lighthouse audit
- Check for unoptimized images
- Review JavaScript loading strategy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow the `.cursorrules` for AI-assisted development
- Maintain WCAG AA accessibility standards
- Test on Chrome, Safari, and mobile devices
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/of-gold-and-grace-theme/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/of-gold-and-grace-theme/discussions)
- **Shopify Community**: Post in the [Shopify Theme Development](https://community.shopify.com/c/shopify-design/themes/bd-p/themes) forum

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**: Use conventional naming (`feat/add-quick-view`, `fix/lazy-loading-cls`)
2. **Follow Code Standards**: Adhere to `.cursorrules` for style, patterns, and architecture
3. **Write Tests**: Add tests for new functionality in `assets/__tests__/`
4. **Update Documentation**: Keep README and code comments current
5. **Submit PR**: Use the PR template with complete testing checklist

### Code Review Process

- **Automated Checks**: CI validates linting, formatting, and Liquid syntax
- **Manual Testing**: Verify functionality, accessibility, and performance
- **Code Ownership**: Core files require senior review (see `.github/CODEOWNERS`)
- **Merge Requirements**: All CI checks pass, tests included, documentation updated

### Rules and Standards

This project maintains versioned development standards in `.cursorrules`:

- **Version 2.0**: Enhanced Shopify theme guidelines with comprehensive accessibility, performance, and testing requirements
- **Change Control**: Rules modifications require PR review and documentation
- **Backwards Compatibility**: Breaking changes include migration guides
- **Source**: Curated from [cursor.directory](https://cursor.directory/) best practices

When rules change significantly, migration guides are provided in the PR description.

## 🗺️ Roadmap

- [x] Quick View modal functionality
- [x] Wishlist with localStorage persistence
- [x] Lazy loading image optimization
- [x] Comprehensive accessibility features
- [x] Performance monitoring and optimization
- [x] Automated testing framework
- [x] Enhanced development tooling
- [ ] Add multi-language support (additional locales)
- [ ] Implement product reviews integration
- [ ] Create email templates
- [ ] Add advanced blog/newsletter features
- [ ] Implement AI-powered search suggestions
- [ ] Add progressive web app capabilities

# Of Gold And Grace - Shopify Theme

A minimal-cost Shopify theme for an online-only jewellery store featuring consignment locations map and ChatGPT Shopping integration.

## ✨ Features

- **Online-only sales**: No POS or physical store integration
- **Jewellery-focused PDP**: Metal variant swatches, size guide modal, care instructions, gift wrapping
- **Interactive Quick View**: Instant product preview without page navigation
- **Persistent Wishlist**: localStorage-based favorites with heart toggle UI
- **Consignment locations map**: Interactive Leaflet-powered map showing partner stores
- **Free ChatGPT Shopping**: Via Shopify Shop channel (requires account setup)
- **Accessibility-first**: WCAG AA compliant with keyboard navigation, skip links, and ARIA labels
- **Performance optimized**: Lazy loading images, deferred JS, Core Web Vitals monitoring
- **Mobile responsive**: Optimized for all device sizes
- **SEO ready**: Structured data, meta tags, and semantic HTML
- **Comprehensive testing**: Built-in JavaScript test suite for development

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
- **Testing**: Built-in JavaScript test suite for Quick View and Wishlist

### Testing

Run the test suite to verify JavaScript functionality:

```bash
# Open test runner in browser
# Navigate to: assets/__tests__/test-runner.html

# Or run tests programmatically
# (Tests run automatically when the page loads)
```

**Test Coverage:**
- Wishlist functionality (add/remove/toggle/persistence)
- Quick View modal (initialization, variants, quantity, forms)
- Focus trap utility for accessibility
- DOM interactions and event handling

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

## 🗺️ Roadmap

- [ ] Add multi-language support
- [ ] Implement product reviews integration
- [ ] Add wishlist functionality
- [ ] Create email templates
- [ ] Add blog/newsletter integration
- [ ] Implement advanced filtering options

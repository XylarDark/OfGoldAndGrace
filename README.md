# Of Gold And Grace - Shopify Theme

A minimal-cost Shopify theme for an online-only jewellery store featuring consignment locations map and ChatGPT Shopping integration.

## ✨ Features

- **Online-only sales**: No POS or physical store integration
- **Jewellery-focused PDP**: Metal variant swatches, size guide modal, care instructions, gift wrapping
- **Consignment locations map**: Interactive Leaflet-powered map showing partner stores
- **Free ChatGPT Shopping**: Via Shopify Shop channel (requires account setup)
- **Accessibility-first**: WCAG AA compliant with keyboard navigation and ARIA labels
- **Performance optimized**: Lazy loading images, deferred JS, modern formats
- **Mobile responsive**: Optimized for all device sizes
- **SEO ready**: Structured data, meta tags, and semantic HTML

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

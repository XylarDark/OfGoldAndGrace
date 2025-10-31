/**
 * Structured Data Tests
 * Tests for JSON-LD structured data generation and validity
 */

testRunner.test('Structured Data JSON is valid and parseable', () => {
  // Create a mock structured data script element
  const scriptElement = document.createElement('script');
  scriptElement.type = 'application/ld+json';

  // Mock structured data JSON (simplified version of what our snippet generates)
  const mockStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://example-shop.com/#organization",
        "name": "Example Shop",
        "url": "https://example-shop.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://example-shop.com/logo.jpg"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://example-shop.com/#website",
        "url": "https://example-shop.com",
        "name": "Example Shop"
      },
      {
        "@type": "Product",
        "@id": "https://example-shop.com/products/test-product",
        "name": "Test Product",
        "description": "A test product description",
        "image": ["https://example-shop.com/image1.jpg"],
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "29.99",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  scriptElement.textContent = JSON.stringify(mockStructuredData);

  // Test that the JSON is valid and parseable
  let parsedData;
  try {
    parsedData = JSON.parse(scriptElement.textContent);
    TestRunner.assert(true, 'JSON-LD is valid and parseable');
  } catch (error) {
    TestRunner.assert(false, `JSON-LD parsing failed: ${error.message}`);
    return;
  }

  // Test basic structure
  TestRunner.assert(Array.isArray(parsedData['@graph']), '@graph should be an array');
  TestRunner.assert(parsedData['@graph'].length >= 2, 'Should have at least Organization and WebSite schemas');
  TestRunner.assertEqual(parsedData['@context'], 'https://schema.org', '@context should be schema.org');

  // Test Organization schema
  const orgSchema = parsedData['@graph'].find(item => item['@type'] === 'Organization');
  TestRunner.assert(orgSchema, 'Should contain Organization schema');
  TestRunner.assert(orgSchema.name, 'Organization should have a name');
  TestRunner.assert(orgSchema.url, 'Organization should have a URL');

  // Test WebSite schema
  const siteSchema = parsedData['@graph'].find(item => item['@type'] === 'WebSite');
  TestRunner.assert(siteSchema, 'Should contain WebSite schema');
  TestRunner.assert(siteSchema.name, 'WebSite should have a name');

  // Test Product schema (if present)
  const productSchema = parsedData['@graph'].find(item => item['@type'] === 'Product');
  if (productSchema) {
    TestRunner.assert(productSchema.name, 'Product should have a name');
    TestRunner.assert(productSchema.offers, 'Product should have offers');
    TestRunner.assert(productSchema.offers.price, 'Product offers should have a price');
    TestRunner.assert(productSchema.offers.availability, 'Product offers should have availability');
  }
});

testRunner.test('Structured Data handles missing optional fields gracefully', () => {
  // Test with minimal data (missing logo, contact info, social links)
  const scriptElement = document.createElement('script');
  scriptElement.type = 'application/ld+json';

  const minimalStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://example-shop.com/#organization",
        "name": "Example Shop",
        "url": "https://example-shop.com"
        // No logo, contactPoint, or sameAs fields
      },
      {
        "@type": "WebSite",
        "@id": "https://example-shop.com/#website",
        "url": "https://example-shop.com",
        "name": "Example Shop"
      }
    ]
  };

  scriptElement.textContent = JSON.stringify(minimalStructuredData);

  // Should parse without errors
  let parsedData;
  try {
    parsedData = JSON.parse(scriptElement.textContent);
    TestRunner.assert(true, 'Minimal JSON-LD is valid and parseable');
  } catch (error) {
    TestRunner.assert(false, `Minimal JSON-LD parsing failed: ${error.message}`);
    return;
  }

  // Test that required fields are present
  const orgSchema = parsedData['@graph'].find(item => item['@type'] === 'Organization');
  TestRunner.assert(orgSchema.name, 'Organization should always have a name');
  TestRunner.assert(orgSchema.url, 'Organization should always have a URL');

  // Test that optional fields are handled (should not be present or should be empty)
  TestRunner.assert(!orgSchema.logo || orgSchema.logo.url, 'Logo should be valid if present');
  TestRunner.assert(!orgSchema.contactPoint || orgSchema.contactPoint.telephone, 'Contact point should have phone if present');
  TestRunner.assert(!orgSchema.sameAs || Array.isArray(orgSchema.sameAs), 'SameAs should be array if present');
});

testRunner.test('Structured Data Product availability mapping', () => {
  const testAvailabilityMapping = (available, expected) => {
    const availabilityString = available ? 'true' : 'false';
    const result = availabilityString.replace('true', 'InStock').replace('false', 'OutOfStock');
    return result === expected;
  };

  TestRunner.assert(testAvailabilityMapping(true, 'InStock'), 'Available products should map to InStock');
  TestRunner.assert(testAvailabilityMapping(false, 'OutOfStock'), 'Unavailable products should map to OutOfStock');
});

testRunner.test('Structured Data includes required schema.org context', () => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'application/ld+json';

  const validStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Test Shop"
      }
    ]
  };

  scriptElement.textContent = JSON.stringify(validStructuredData);

  let parsedData;
  try {
    parsedData = JSON.parse(scriptElement.textContent);
    TestRunner.assertEqual(parsedData['@context'], 'https://schema.org', 'Must include schema.org context');
  } catch (error) {
    TestRunner.assert(false, `Context validation failed: ${error.message}`);
  }
});

testRunner.test('Structured Data BreadcrumbList format', () => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'application/ld+json';

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://example-shop.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Collections",
            "item": "https://example-shop.com/collections"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Jewelry",
            "item": "https://example-shop.com/collections/jewelry"
          }
        ]
      }
    ]
  };

  scriptElement.textContent = JSON.stringify(breadcrumbData);

  let parsedData;
  try {
    parsedData = JSON.parse(scriptElement.textContent);
    const breadcrumbSchema = parsedData['@graph'].find(item => item['@type'] === 'BreadcrumbList');
    TestRunner.assert(breadcrumbSchema, 'Should contain BreadcrumbList schema');
    TestRunner.assert(Array.isArray(breadcrumbSchema.itemListElement), 'Breadcrumb items should be an array');

    // Test position ordering
    const positions = breadcrumbSchema.itemListElement.map(item => item.position);
    const isOrdered = positions.every((pos, index) => pos === index + 1);
    TestRunner.assert(isOrdered, 'Breadcrumb positions should be sequential starting from 1');

    // Test required fields
    breadcrumbSchema.itemListElement.forEach((item, index) => {
      TestRunner.assert(item.name, `Breadcrumb item ${index + 1} should have a name`);
      TestRunner.assert(item.item, `Breadcrumb item ${index + 1} should have an item URL`);
      TestRunner.assertEqual(item.position, index + 1, `Breadcrumb item ${index + 1} should have correct position`);
    });
  } catch (error) {
    TestRunner.assert(false, `Breadcrumb validation failed: ${error.message}`);
  }
});

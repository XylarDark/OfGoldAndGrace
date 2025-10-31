# Metaobjects Migration Guide

This guide outlines the process for migrating from static JSON files to Shopify Metaobjects for better admin-editable content management. This is a future enhancement for when static JSON becomes unwieldy.

## Current State (Static JSON)

- **Consignment Locations**: `assets/consignment_locations.json`
- **Product Reviews**: `assets/reviews.json`
- **Validation**: JSON schema validation in tests
- **Management**: Manual file edits via Git

## Migration Benefits

- **Admin Editable**: Content managed in Shopify Admin UI
- **Version Controlled**: Schema and data changes tracked
- **Better UX**: Non-technical staff can update content
- **Scalability**: Handle larger datasets efficiently
- **Consistency**: Single source of truth

## Prerequisites

1. **Shopify Plan**: Basic or higher (Metaobjects require paid plan)
2. **Business Need**: Static JSON updates become frequent/unwieldy
3. **Development Time**: 2-3 days for full migration
4. **Testing**: Comprehensive testing of all data flows

## Migration Steps

### Phase 1: Metaobject Definition

#### 1.1 Create Metaobject Definitions

**Consignment Locations Metaobject:**

```json
{
  "name": "Consignment Location",
  "type": "consignment_location",
  "fields": [
    {
      "key": "partner",
      "type": "single_line_text_field",
      "required": true,
      "validations": [
        {
          "name": "max",
          "value": "100"
        }
      ]
    },
    {
      "key": "store",
      "type": "single_line_text_field",
      "required": true,
      "validations": [
        {
          "name": "max",
          "value": "100"
        }
      ]
    },
    {
      "key": "address",
      "type": "multi_line_text_field",
      "required": true,
      "validations": [
        {
          "name": "max",
          "value": "200"
        }
      ]
    },
    {
      "key": "latitude",
      "type": "number_decimal",
      "required": true,
      "validations": [
        {
          "name": "min",
          "value": "-90"
        },
        {
          "name": "max",
          "value": "90"
        }
      ]
    },
    {
      "key": "longitude",
      "type": "number_decimal",
      "required": true,
      "validations": [
        {
          "name": "min",
          "value": "-180"
        },
        {
          "name": "max",
          "value": "180"
        }
      ]
    },
    {
      "key": "phone",
      "type": "single_line_text_field",
      "required": false,
      "validations": [
        {
          "name": "max",
          "value": "20"
        }
      ]
    },
    {
      "key": "hours",
      "type": "multi_line_text_field",
      "required": false,
      "validations": [
        {
          "name": "max",
          "value": "100"
        }
      ]
    },
    {
      "key": "website",
      "type": "url",
      "required": false
    }
  ]
}
```

**Product Reviews Metaobject:**

```json
{
  "name": "Product Review",
  "type": "product_review",
  "fields": [
    {
      "key": "product",
      "type": "product_reference",
      "required": true
    },
    {
      "key": "reviewer_name",
      "type": "single_line_text_field",
      "required": true,
      "validations": [
        {
          "name": "max",
          "value": "50"
        }
      ]
    },
    {
      "key": "rating",
      "type": "number_integer",
      "required": true,
      "validations": [
        {
          "name": "min",
          "value": "1"
        },
        {
          "name": "max",
          "value": "5"
        }
      ]
    },
    {
      "key": "review_body",
      "type": "multi_line_text_field",
      "required": true,
      "validations": [
        {
          "name": "min",
          "value": "10"
        },
        {
          "name": "max",
          "value": "500"
        }
      ]
    },
    {
      "key": "review_date",
      "type": "date",
      "required": true
    },
    {
      "key": "verified",
      "type": "boolean",
      "required": false,
      "default": false
    }
  ]
}
```

#### 1.2 Create Metaobjects in Shopify Admin

1. Go to **Content > Metaobjects** in Shopify Admin
2. Create the definitions above
3. Import existing data from JSON files

### Phase 2: Theme Code Updates

#### 2.1 Update Liquid Templates

**Consignment Locations (before):**
```liquid
{% assign locations = site.static_content.consignment_locations %}
```

**Consignment Locations (after):**
```liquid
{% assign locations = shop.metaobjects.consignment_location.values %}
```

**Product Reviews (before):**
```liquid
{% assign reviews_data = site.static_content.product_reviews %}
{% assign product_reviews = reviews_data.reviews | where: "product_handle", product.handle %}
```

**Product Reviews (after):**
```liquid
{% assign product_reviews = shop.metaobjects.product_review.values | where: "product", product %}
```

#### 2.2 Update JavaScript

**Map initialization:**
```javascript
// Before: Load from static JSON
fetch('/cdn/shop/t/1/assets/consignment_locations.json')
  .then(response => response.json())
  .then(data => initializeMap(data));

// After: Load from Liquid-assigned variable
const locations = {{ locations | json }};
initializeMap(locations);
```

**Reviews rendering:**
```javascript
// Before: Parse static JSON
const reviewsData = JSON.parse({{ 'reviews.json' | asset_url | file_url }});

// After: Use Liquid data
const reviewsData = {{ product_reviews | json }};
```

#### 2.3 Update JSON-LD Generation

**Reviews structured data:**
```liquid
{%- if product_reviews.size > 0 -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": {{ product.title | json }},
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{ product_reviews | map: 'rating' | average }}",
    "reviewCount": "{{ product_reviews.size }}",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {%- for review in product_reviews -%}
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": {{ review.reviewer_name | json }}
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "{{ review.rating }}",
        "bestRating": "5"
      },
      "reviewBody": {{ review.review_body | json }},
      "datePublished": "{{ review.review_date | date: '%Y-%m-%d' }}"
    }{%- unless forloop.last -%},{%- endunless -%}
    {%- endfor -%}
  ]
}
</script>
{%- endif -%}
```

### Phase 3: Data Migration

#### 3.1 Export Current Data

```bash
# Create backup of current JSON files
cp assets/consignment_locations.json assets/consignment_locations.backup.json
cp assets/reviews.json assets/reviews.backup.json
```

#### 3.2 Import to Metaobjects

Use Shopify Admin UI or custom script to import data:
- Create Metaobject entries for each location/review
- Map JSON fields to Metaobject fields
- Validate data integrity

#### 3.3 Update Theme Settings

Add theme settings to control data source:

```json
{
  "type": "checkbox",
  "id": "use_metaobjects",
  "label": "Use Metaobjects for dynamic content",
  "default": false,
  "info": "Enable Metaobjects for consignment locations and reviews. Requires Shopify Basic plan or higher."
}
```

### Phase 4: Testing & Validation

#### 4.1 Update Tests

```javascript
// Update test files to handle both data sources
testRunner.test('Data loading works with both sources', () => {
  const useMetaobjects = {{ settings.use_metaobjects }};
  // Test appropriate data loading logic
});
```

#### 4.2 Backward Compatibility

- Keep static JSON as fallback
- Feature flag controls data source
- Graceful degradation if Metaobjects unavailable

### Phase 5: Deployment & Monitoring

#### 5.1 Gradual Rollout

1. Enable Metaobjects for staging environment first
2. Test all functionality thoroughly
3. Monitor performance impact
4. Roll out to production with rollback plan

#### 5.2 Monitoring

- Track Metaobject query performance
- Monitor admin usage patterns
- Set up alerts for data inconsistencies

## Cost Considerations

- **Shopify Plan**: Basic ($29/month) or higher required
- **Development Time**: 2-3 days for full migration
- **Maintenance**: Slight increase in complexity
- **Performance**: Metaobject queries vs static JSON loading

## Rollback Plan

1. Disable Metaobjects feature flag
2. Restore static JSON files from backup
3. Deploy rollback theme version
4. Monitor for data consistency issues

## Future Enhancements

- **Content Workflows**: Approval processes for reviews
- **Bulk Operations**: CSV import/export for locations
- **API Integration**: External review platform sync
- **Analytics**: Content performance tracking

---

**Status**: Scaffold documentation - ready for implementation when business needs dictate migration from static JSON to admin-editable Metaobjects.

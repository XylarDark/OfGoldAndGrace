/**
 * Reviews Schema Validation Tests
 * Validates assets/reviews.json against schema
 */

(function() {
  'use strict';

  // Simple JSON Schema validator (subset for our needs)
  function validateSchema(data, schema) {
    const errors = [];

    function validateValue(value, schema, path = '') {
      if (schema.type && typeof value !== schema.type && !(schema.type === 'number' && typeof value === 'string' && !isNaN(Number(value)))) {
        errors.push(`${path}: Expected ${schema.type}, got ${typeof value}`);
        return;
      }

      if (schema.type === 'string') {
        if (schema.minLength && value.length < schema.minLength) {
          errors.push(`${path}: String too short (min ${schema.minLength})`);
        }
        if (schema.maxLength && value.length > schema.maxLength) {
          errors.push(`${path}: String too long (max ${schema.maxLength})`);
        }
        if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
          errors.push(`${path}: String does not match pattern`);
        }
        if (schema.enum && !schema.enum.includes(value)) {
          errors.push(`${path}: Value not in allowed enum: ${schema.enum.join(', ')}`);
        }
      }
    }

    function validateObject(obj, schema, path = '') {
      if (schema.required) {
        for (const field of schema.required) {
          if (!(field in obj)) {
            errors.push(`${path}: Missing required field "${field}"`);
          }
        }
      }

      for (const [key, value] of Object.entries(obj)) {
        const fieldSchema = schema.properties?.[key];
        if (fieldSchema) {
          if (fieldSchema.type === 'object') {
            validateObject(value, fieldSchema, `${path}.${key}`);
          } else if (fieldSchema.type === 'array') {
            validateArray(value, fieldSchema, `${path}.${key}`);
          } else {
            validateValue(value, fieldSchema, `${path}.${key}`);
          }
        } else if (!schema.additionalProperties) {
          errors.push(`${path}: Unexpected property "${key}"`);
        }
      }
    }

    function validateArray(arr, schema, path = '') {
      if (schema.minItems !== undefined && arr.length < schema.minItems) {
        errors.push(`${path}: Array too short (min ${schema.minItems})`);
      }
      if (schema.maxItems !== undefined && arr.length > schema.maxItems) {
        errors.push(`${path}: Array too long (max ${schema.maxItems})`);
      }

      if (schema.items) {
        arr.forEach((item, index) => {
          if (schema.items.type === 'object') {
            validateObject(item, schema.items, `${path}[${index}]`);
          } else {
            validateValue(item, schema.items, `${path}[${index}]`);
          }
        });
      }
    }

    if (schema.type === 'object') {
      validateObject(data, schema);
    }

    return errors;
  }

  // Test suite
  const testRunner = new TestRunner('Reviews Schema Validation');

  testRunner.test('Reviews JSON loads without errors', () => {
    try {
      // Load the JSON data
      const response = new XMLHttpRequest();
      response.open('GET', '../reviews.json', false);
      response.send();

      TestRunner.assert(response.status === 200, 'JSON file should load successfully');
      TestRunner.assert(response.responseText.length > 0, 'JSON file should not be empty');

      const data = JSON.parse(response.responseText);
      TestRunner.assert(typeof data === 'object', 'Data should be an object');
      TestRunner.assert(data.reviews, 'Data should have reviews property');
      TestRunner.assert(Array.isArray(data.reviews), 'Reviews should be an array');

    } catch (error) {
      TestRunner.assert(false, `Failed to load JSON: ${error.message}`);
    }
  });

  testRunner.test('Reviews validate against schema', () => {
    try {
      // Load schema and data
      const schemaResponse = new XMLHttpRequest();
      schemaResponse.open('GET', '../reviews.schema.json', false);
      schemaResponse.send();

      const dataResponse = new XMLHttpRequest();
      dataResponse.open('GET', '../reviews.json', false);
      dataResponse.send();

      const schema = JSON.parse(schemaResponse.responseText);
      const data = JSON.parse(dataResponse.responseText);

      // Validate data against schema
      const errors = validateSchema(data, schema);

      if (errors.length > 0) {
        console.error('Schema validation errors:', errors);
        TestRunner.assert(false, `Schema validation failed: ${errors.join(', ')}`);
      } else {
        TestRunner.assert(true, 'Schema validation passed');
      }

    } catch (error) {
      TestRunner.assert(false, `Schema validation failed: ${error.message}`);
    }
  });

  testRunner.test('Aggregate rating is properly structured', () => {
    try {
      const response = new XMLHttpRequest();
      response.open('GET', '../reviews.json', false);
      response.send();

      const data = JSON.parse(response.responseText);
      const rating = data.aggregateRating;

      TestRunner.assert(rating, 'Should have aggregateRating');
      TestRunner.assert(rating['@type'] === 'AggregateRating', 'Should have correct @type');
      TestRunner.assert(rating.ratingValue, 'Should have ratingValue');
      TestRunner.assert(rating.reviewCount, 'Should have reviewCount');
      TestRunner.assert(rating.bestRating === '5', 'Best rating should be 5');
      TestRunner.assert(rating.worstRating === '1', 'Worst rating should be 1');

      // Check rating value is valid
      const ratingNum = parseFloat(rating.ratingValue);
      TestRunner.assert(ratingNum >= 0 && ratingNum <= 5, 'Rating value should be between 0-5');

    } catch (error) {
      TestRunner.assert(false, `Aggregate rating validation failed: ${error.message}`);
    }
  });

  testRunner.test('Individual reviews have required fields and valid data', () => {
    try {
      const response = new XMLHttpRequest();
      response.open('GET', '../reviews.json', false);
      response.send();

      const data = JSON.parse(response.responseText);
      const reviews = data.reviews;

      reviews.forEach((review, index) => {
        TestRunner.assert(review.id, `Review ${index} should have id`);
        TestRunner.assert(review.id.startsWith('review-'), `Review ${index} id should start with 'review-'`);
        TestRunner.assert(review['@type'] === 'Review', `Review ${index} should have correct @type`);
        TestRunner.assert(review.author, `Review ${index} should have author`);
        TestRunner.assert(review.author.name, `Review ${index} should have author name`);
        TestRunner.assert(review.reviewRating, `Review ${index} should have reviewRating`);
        TestRunner.assert(review.reviewRating.ratingValue, `Review ${index} should have rating value`);
        TestRunner.assert(review.reviewBody, `Review ${index} should have reviewBody`);
        TestRunner.assert(review.reviewBody.length >= 10, `Review ${index} body should be at least 10 chars`);
        TestRunner.assert(review.datePublished, `Review ${index} should have datePublished`);

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        TestRunner.assert(dateRegex.test(review.datePublished), `Review ${index} date should be YYYY-MM-DD format`);

        // Validate rating
        const rating = parseInt(review.reviewRating.ratingValue);
        TestRunner.assert(rating >= 1 && rating <= 5, `Review ${index} rating should be 1-5`);
      });

    } catch (error) {
      TestRunner.assert(false, `Individual review validation failed: ${error.message}`);
    }
  });

  testRunner.test('Review data is consistent with aggregate rating', () => {
    try {
      const response = new XMLHttpRequest();
      response.open('GET', '../reviews.json', false);
      response.send();

      const data = JSON.parse(response.responseText);
      const reviews = data.reviews;
      const aggregate = data.aggregateRating;

      // Count reviews
      const reviewCount = reviews.length;
      const reportedCount = parseInt(aggregate.reviewCount);
      TestRunner.assert(reviewCount === reportedCount, `Review count mismatch: ${reviewCount} vs ${reportedCount}`);

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.reviewRating.ratingValue), 0);
      const averageRating = totalRating / reviewCount;
      const reportedAverage = parseFloat(aggregate.ratingValue);

      // Allow small floating point differences
      TestRunner.assert(Math.abs(averageRating - reportedAverage) < 0.01, `Average rating mismatch: ${averageRating} vs ${reportedAverage}`);

    } catch (error) {
      TestRunner.assert(false, `Consistency validation failed: ${error.message}`);
    }
  });

})();

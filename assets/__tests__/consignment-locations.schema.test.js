/**
 * Consignment Locations Schema Validation Tests
 * Validates assets/consignment_locations.json against schema
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
      }

      if (schema.type === 'number') {
        if (schema.minimum !== undefined && value < schema.minimum) {
          errors.push(`${path}: Number below minimum ${schema.minimum}`);
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
          errors.push(`${path}: Number above maximum ${schema.maximum}`);
        }
      }

      if (schema.enum && !schema.enum.includes(value)) {
        errors.push(`${path}: Value not in allowed enum: ${schema.enum.join(', ')}`);
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
          validateValue(value, fieldSchema, `${path}.${key}`);
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

    if (schema.type === 'array') {
      validateArray(data, schema);
    } else if (schema.type === 'object') {
      validateObject(data, schema);
    }

    return errors;
  }

  // Test suite
  const testRunner = new TestRunner('Consignment Locations Schema Validation');

  testRunner.test('Consignment locations JSON loads without errors', () => {
    try {
      // Load the JSON data
      const response = new XMLHttpRequest();
      response.open('GET', '../consignment_locations.json', false);
      response.send();

      TestRunner.assert(response.status === 200, 'JSON file should load successfully');
      TestRunner.assert(response.responseText.length > 0, 'JSON file should not be empty');

      const data = JSON.parse(response.responseText);
      TestRunner.assert(Array.isArray(data), 'Data should be an array');

    } catch (error) {
      TestRunner.assert(false, `Failed to load JSON: ${error.message}`);
    }
  });

  testRunner.test('Consignment locations validate against schema', () => {
    try {
      // Load schema and data
      const schemaResponse = new XMLHttpRequest();
      schemaResponse.open('GET', '../consignment_locations.schema.json', false);
      schemaResponse.send();

      const dataResponse = new XMLHttpRequest();
      dataResponse.open('GET', '../consignment_locations.json', false);
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

  testRunner.test('Each location has required fields and valid coordinates', () => {
    try {
      const response = new XMLHttpRequest();
      response.open('GET', '../consignment_locations.json', false);
      response.send();

      const locations = JSON.parse(response.responseText);

      locations.forEach((location, index) => {
        TestRunner.assert(location.partner, `Location ${index} should have partner`);
        TestRunner.assert(location.store, `Location ${index} should have store`);
        TestRunner.assert(location.address, `Location ${index} should have address`);
        TestRunner.assert(typeof location.latitude === 'number', `Location ${index} should have numeric latitude`);
        TestRunner.assert(typeof location.longitude === 'number', `Location ${index} should have numeric longitude`);
        TestRunner.assert(location.latitude >= -90 && location.latitude <= 90, `Location ${index} latitude should be valid`);
        TestRunner.assert(location.longitude >= -180 && location.longitude <= 180, `Location ${index} longitude should be valid`);
      });

    } catch (error) {
      TestRunner.assert(false, `Location validation failed: ${error.message}`);
    }
  });

  testRunner.test('Optional fields are properly formatted when present', () => {
    try {
      const response = new XMLHttpRequest();
      response.open('GET', '../consignment_locations.json', false);
      response.send();

      const locations = JSON.parse(response.responseText);

      locations.forEach((location, index) => {
        if (location.phone) {
          TestRunner.assert(typeof location.phone === 'string', `Location ${index} phone should be string`);
          TestRunner.assert(location.phone.length <= 20, `Location ${index} phone should be reasonable length`);
        }

        if (location.website) {
          TestRunner.assert(typeof location.website === 'string', `Location ${index} website should be string`);
          TestRunner.assert(location.website.startsWith('http'), `Location ${index} website should be valid URL`);
        }

        if (location.hours) {
          TestRunner.assert(typeof location.hours === 'string', `Location ${index} hours should be string`);
          TestRunner.assert(location.hours.length <= 100, `Location ${index} hours should be reasonable length`);
        }
      });

    } catch (error) {
      TestRunner.assert(false, `Optional field validation failed: ${error.message}`);
    }
  });

})();

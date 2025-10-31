/**
 * Simple Test Runner
 * Lightweight testing framework for theme JavaScript components
 */

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
  }

  test(name, fn) {
    this.tests.push({ name, fn });
    this.results.total++;
  }

  async run() {
    console.log('🧪 Running JavaScript tests...\n');

    for (const test of this.tests) {
      try {
        await test.fn();
        console.log(`✅ ${test.name}`);
        this.results.passed++;
      } catch (error) {
        console.error(`❌ ${test.name}`);
        console.error(`   ${error.message}`);
        this.results.failed++;
      }
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Results:');
    console.log(`   Total: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);

    if (this.results.failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.error(`💥 ${this.results.failed} tests failed`);
    }
  }

  // Assertion helpers
  static assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  static assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`${message} Expected ${expected}, got ${actual}`);
    }
  }

  static assertThrows(fn, message = 'Expected function to throw') {
    try {
      fn();
      throw new Error(message);
    } catch (error) {
      if (error.message === message) {
        throw error; // Re-throw our custom error
      }
      // Expected error was thrown
    }
  }
}

// Global test runner instance
window.testRunner = new TestRunner();

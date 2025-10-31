#!/usr/bin/env node

/**
 * Performance Budget Checker
 * Validates JS/CSS bundle sizes against .cursorrules budget (<100KB total)
 *
 * Usage: node scripts/check-performance-budget.js
 * In CI: node scripts/check-performance-budget.js --ci --pr-number=$PR_NUMBER
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUDGET_TOTAL_KB = 100;
const WARNING_THRESHOLD_KB = 80;
const REDUCTION_THRESHOLD_KB = 5; // Only comment if improved by this much

// File patterns to check
const PATTERNS = [
  'assets/**/*.js',
  'assets/**/*.css'
];

// Exclusions
const EXCLUDE_PATTERNS = [
  '__tests__',
  'test-runner.html'
];

/**
 * Get file size in bytes
 */
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return 0;
  }
}

/**
 * Find files matching patterns (simple glob implementation)
 */
function findFiles(pattern) {
  const parts = pattern.split('/');
  const baseDir = parts[0];
  const remainingPattern = parts.slice(1).join('/');

  function matchesPattern(filename, pattern) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(filename);
    }
    return filename === pattern;
  }

  function walk(dir, remaining) {
    const results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      // Skip excluded patterns
      if (EXCLUDE_PATTERNS.some(excl => fullPath.includes(excl))) {
        continue;
      }

      if (stat.isDirectory() && remaining.includes('*')) {
        // Recurse into subdirectories
        results.push(...walk(fullPath, remaining));
      } else if (matchesPattern(item, remaining) || matchesPattern(fullPath, remaining)) {
        results.push(fullPath);
      }
    }

    return results;
  }

  return walk(baseDir, remainingPattern);
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Get GitHub PR info
 */
function getPRInfo() {
  try {
    const prNumber = process.env.PR_NUMBER || process.argv.find(arg => arg.startsWith('--pr='))?.split('=')[1];
    const repo = process.env.GITHUB_REPOSITORY || 'XylarDark/OfGoldAndGrace';
    return { prNumber, repo };
  } catch (error) {
    return { prNumber: null, repo: null };
  }
}

/**
 * Post comment to GitHub PR
 */
function postPRComment(message, isWarning = false) {
  const { prNumber, repo } = getPRInfo();
  if (!prNumber || !repo) {
    console.log('No PR number/repo found, skipping comment');
    return;
  }

  try {
    const comment = `## 🚀 Performance Budget Report\n\n${message}`;
    const body = JSON.stringify({
      body: comment
    });

    // Use GitHub CLI if available
    execSync(`gh pr comment ${prNumber} --body "${comment.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit'
    });
  } catch (error) {
    console.warn('Could not post PR comment:', error.message);
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Checking Performance Budget...\n');

  const allFiles = [];
  let totalSize = 0;

  // Collect all files
  for (const pattern of PATTERNS) {
    const files = findFiles(pattern);
    allFiles.push(...files);
  }

  // Remove duplicates and sort
  const uniqueFiles = [...new Set(allFiles)].sort();

  // Calculate sizes
  const fileSizes = uniqueFiles.map(file => {
    const size = getFileSize(file);
    totalSize += size;
    return {
      file: path.relative('.', file),
      size,
      formatted: formatBytes(size)
    };
  });

  const totalSizeKB = totalSize / 1024;

  // Display results
  console.log('📊 Bundle Size Analysis:');
  console.log('───────────────────────');

  fileSizes.forEach(({ file, formatted }) => {
    console.log(`${formatted.padStart(8)} ${file}`);
  });

  console.log('───────────────────────');
  console.log(`${formatBytes(totalSize).padStart(8)} TOTAL`);
  console.log('');

  // Check against budget
  let status = '✅';
  let message = `Bundle size: ${totalSizeKB.toFixed(1)}KB (budget: ${BUDGET_TOTAL_KB}KB)`;

  if (totalSizeKB >= BUDGET_TOTAL_KB) {
    status = '❌';
    message += ` - OVER BUDGET by ${(totalSizeKB - BUDGET_TOTAL_KB).toFixed(1)}KB ⚠️`;
  } else if (totalSizeKB >= WARNING_THRESHOLD_KB) {
    status = '⚠️';
    message += ` - Approaching budget (${((totalSizeKB / BUDGET_TOTAL_KB) * 100).toFixed(0)}%)`;
  } else {
    message += ` - Within budget (${((totalSizeKB / BUDGET_TOTAL_KB) * 100).toFixed(0)}%)`;
  }

  console.log(`${status} ${message}`);
  console.log('');

  // Note about Shopify minification
  console.log('💡 Note: Shopify minifies assets on upload. Local sizes may be larger.');
  console.log('   Use Lighthouse CI reports for real-world performance metrics.');
  console.log('');

  // Check if we should comment on PR
  const isCI = process.argv.includes('--ci');
  const shouldComment = isCI && (
    totalSizeKB >= WARNING_THRESHOLD_KB ||
    (totalSizeKB < WARNING_THRESHOLD_KB && Math.random() < 0.1) // Occasional positive updates
  );

  if (shouldComment) {
    const prMessage = `### Bundle Size Check\n\n${message}\n\n**Details:**\n${fileSizes.map(f => `- ${f.formatted}: \`${f.file}\``).join('\n')}\n\n*Shopify minifies assets on upload - these are source sizes.*`;

    postPRComment(prMessage, totalSizeKB >= BUDGET_TOTAL_KB);
  }

  // Write GitHub step summary if in CI
  if (isCI && process.env.GITHUB_STEP_SUMMARY) {
    const summaryTable = `### 📊 Performance Budget Report

| Metric | Value | Status |
|--------|-------|--------|
| **Total JS+CSS Size** | ${totalSizeKB.toFixed(1)} KB | ${totalSizeKB >= BUDGET_TOTAL_KB ? '❌ Over Budget' : totalSizeKB >= WARNING_THRESHOLD_KB ? '⚠️ Approaching' : '✅ Within Budget'} |
| **Budget Limit** | ${BUDGET_TOTAL_KB} KB | - |
| **Warning Threshold** | ${WARNING_THRESHOLD_KB} KB | - |

#### File Breakdown
${fileSizes.map(f => `| \`${f.file}\` | ${f.formatted} | - |`).join('\n')}

*Note: Shopify minifies assets on upload. These are source file sizes. Use Lighthouse CI for real-world performance metrics.*`;

    require('fs').appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryTable + '\n\n');
  }

  // Always exit successfully in CI (report-only policy)
  // The step summary and PR comments provide the feedback
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, getFileSize, findFiles, formatBytes };

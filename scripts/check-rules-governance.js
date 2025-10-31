#!/usr/bin/env node

/**
 * Rules Governance Checker
 * Detects changes that should trigger rules updates and provides reminders
 *
 * Usage: node scripts/check-rules-governance.js
 * In CI: Automatically runs on PRs, outputs to GITHUB_STEP_SUMMARY
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files/directories that trigger governance checks
const GOVERNANCE_TRIGGERS = [
  '.cursorrules',
  'assets/',
  '.github/workflows/',
  'scripts/',
  'config/settings_schema.json'
];

// Files that should be updated when governance triggers fire
const GOVERNANCE_FILES = [
  '.cursorrules',
  'docs/rules-changelog.md'
];

/**
 * Get changed files from git
 */
function getChangedFiles() {
  try {
    // Get files changed in current branch vs main
    const output = execSync('git diff --name-only origin/main...HEAD || git diff --name-only HEAD~1...HEAD || echo ""', {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.warn('Could not determine changed files:', error.message);
    return [];
  }
}

/**
 * Check if any changed files trigger governance
 */
function checkGovernanceTriggers(changedFiles) {
  const triggers = changedFiles.filter(file =>
    GOVERNANCE_TRIGGERS.some(trigger => file.startsWith(trigger))
  );

  return {
    triggered: triggers.length > 0,
    files: triggers
  };
}

/**
 * Check if governance files were updated
 */
function checkGovernanceUpdates(changedFiles) {
  const updates = changedFiles.filter(file =>
    GOVERNANCE_FILES.some(govFile => file === govFile)
  );

  return {
    rulesUpdated: updates.includes('.cursorrules'),
    changelogUpdated: updates.includes('docs/rules-changelog.md'),
    allUpdated: updates.length === GOVERNANCE_FILES.length
  };
}

/**
 * Generate governance report
 */
function generateReport(changedFiles) {
  const triggers = checkGovernanceTriggers(changedFiles);
  const updates = checkGovernanceUpdates(changedFiles);

  return {
    triggered: triggers.triggered,
    triggerFiles: triggers.files,
    rulesUpdated: updates.rulesUpdated,
    changelogUpdated: updates.changelogUpdated,
    allUpdated: updates.allUpdated,
    needsAttention: triggers.triggered && !updates.allUpdated
  };
}

/**
 * Format report for GitHub Step Summary
 */
function formatStepSummary(report) {
  if (!report.triggered) {
    return `## ✅ Rules Governance Check

No governance triggers detected in this PR. No action needed.`;
  }

  let summary = `## 📋 Rules Governance Check

Governance triggers detected in the following files:
${report.triggerFiles.map(file => `- \`${file}\``).join('\n')}

### Status
${report.allUpdated ? '✅' : '⚠️'} **All governance files updated**

| File | Status |
|------|--------|
| \`.cursorrules\` | ${report.rulesUpdated ? '✅ Updated' : '❌ Not updated'} |
| \`docs/rules-changelog.md\` | ${report.changelogUpdated ? '✅ Updated' : '❌ Not updated'} |

### Next Steps
`;

  if (report.needsAttention) {
    summary += `**Attention Required:** Governance triggers were detected but not all governance files were updated.

Please complete the Session Review checklist in \`.cursorrules\` cycle_closeout section:

1. **Review changes**: Summarize features added, tests written, CI/docs updated
2. **Log errors**: Document any platform/environment issues encountered
3. **Update rules**: Bump version and add deltas to \`.cursorrules\` if policies changed
4. **Update changelog**: Add dated entry to \`docs/rules-changelog.md\` with highlights/rationale

This ensures systematic evolution of development standards after each Plan→Agent cycle.`;
  } else {
    summary += `**All good!** Governance files have been properly updated. Thank you for maintaining our development standards.`;
  }

  return summary;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Checking Rules Governance...\n');

  const changedFiles = getChangedFiles();
  console.log('Changed files:', changedFiles.length > 0 ? changedFiles.join(', ') : 'None detected');

  const report = generateReport(changedFiles);

  console.log('Governance triggered:', report.triggered);
  console.log('Rules updated:', report.rulesUpdated);
  console.log('Changelog updated:', report.changelogUpdated);

  // Output to GitHub Step Summary if in CI
  if (process.env.GITHUB_STEP_SUMMARY) {
    const summary = formatStepSummary(report);
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n\n');
  }

  // Log results
  if (report.triggered) {
    if (report.allUpdated) {
      console.log('✅ All governance files updated - great job!');
    } else {
      console.log('⚠️ Governance triggers detected but not all files updated');
      console.log('Please complete the Session Review per .cursorrules cycle_closeout');
    }
  } else {
    console.log('✅ No governance triggers - no action needed');
  }

  // Always exit successfully (report-only)
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, getChangedFiles, checkGovernanceTriggers, checkGovernanceUpdates, generateReport, formatStepSummary };

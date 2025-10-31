# Release Checklist

Use this checklist to ensure theme releases are prepared and deployed safely.

## Pre-Release

- [ ] **Version Bumped**: Version number updated in appropriate files
- [ ] **Changelog Updated**: CHANGELOG.md reflects all changes
- [ ] **Dependencies Updated**: All npm dependencies checked for security updates
- [ ] **Breaking Changes**: Documented with migration guides if present
- [ ] **Deprecation Notices**: Added for features to be removed

## Testing

- [ ] **Unit Tests**: All JavaScript tests pass
- [ ] **Integration Tests**: Theme functionality tested across devices
- [ ] **Performance Tests**: Lighthouse scores meet budgets
- [ ] **Security Tests**: CodeQL scans pass
- [ ] **Accessibility Tests**: Theme meets WCAG AA standards
- [ ] **Shopify Compatibility**: Tested with target Shopify version

## Documentation

- [ ] **README Updated**: Installation and usage instructions current
- [ ] **Theme Documentation**: Theme customization docs updated
- [ ] **Migration Guides**: Provided for breaking changes
- [ ] **Release Notes**: Clear summary of changes and impact
- [ ] **Upgrade Guide**: Step-by-step theme upgrade instructions

## Code Quality

- [ ] **Linting**: All code passes ESLint rules
- [ ] **Theme Check**: Shopify theme check passes
- [ ] **Security Scan**: No high/critical vulnerabilities
- [ ] **License Compliance**: All dependencies properly licensed
- [ ] **Code Review**: All changes reviewed and approved

## Build & Packaging

- [ ] **Build Successful**: Theme builds with no errors/warnings
- [ ] **Assets Optimized**: Images, CSS, JS properly optimized
- [ ] **Package Integrity**: Theme package can be installed/tested
- [ ] **Size Checks**: Theme bundle size within performance budgets
- [ ] **Cross-browser**: Tested in supported browsers

## Deployment

- [ ] **Deployment Plan**: Clear theme deployment strategy documented
- [ ] **Rollback Plan**: Safe theme rollback procedure tested
- [ ] **Backup**: Current theme version backed up
- [ ] **Environment Config**: All required settings documented
- [ ] **Feature Flags**: New features behind flags if needed

## Staging Verification

- [ ] **Staging Deploy**: Successfully deployed to staging store
- [ ] **Smoke Tests**: Basic theme functionality verified
- [ ] **Integration Tests**: External apps and integrations tested
- [ ] **Performance Tests**: Performance verified in staging
- [ ] **Visual Tests**: Theme appearance verified across devices

## Communications

- [ ] **Team Notification**: Development team informed of release
- [ ] **Stakeholder Review**: Key stakeholders reviewed changes
- [ ] **Merchant Communication**: Theme changes communicated to merchants
- [ ] **Support Team**: Support team prepared for new version
- [ ] **Documentation**: Merchant-facing docs updated

## Go/No-Go Decision

- [ ] **Release Manager**: Release manager identified and available
- [ ] **Go Criteria Met**: All go criteria satisfied
- [ ] **No Critical Issues**: No critical bugs or security issues
- [ ] **Business Approval**: Business stakeholders approve release
- [ ] **Technical Approval**: Technical leads approve release

## Post-Release

- [ ] **Production Deploy**: Successfully deployed to live store
- [ ] **Health Checks**: Theme functionality verified in production
- [ ] **Monitoring**: Theme performance monitoring active
- [ ] **Analytics**: Theme usage analytics configured
- [ ] **Backups**: Theme backups verified

## Follow-up

- [ ] **Merchant Feedback**: Monitor merchant feedback and support tickets
- [ ] **Performance Monitoring**: Key performance metrics monitored
- [ ] **Issue Tracking**: Theme-related issues tracked and addressed
- [ ] **Hotfix Process**: Theme hotfix deployment process verified
- [ ] **Next Release Planning**: Start planning for next theme release

## Retrospective

- [ ] **Release Retrospective**: Conduct post-release review
- [ ] **Lessons Learned**: Document what went well and what didn't
- [ ] **Process Improvements**: Identify and implement process improvements
- [ ] **Tooling Updates**: Update development tooling based on experience
- [ ] **Documentation Updates**: Update release documentation

## Emergency Contacts

**Release Manager**: [Name] [Contact]
**Lead Developer**: [Name] [Contact]
**DevOps Lead**: [Name] [Contact]
**Security Lead**: [Name] [Contact]

## Rollback Procedures

**Theme Rollback**: [Procedure for reverting to previous theme version]
**Content Recovery**: [Procedure for recovering customized content]
**Merchant Communication**: [Procedure for notifying merchants of rollback]

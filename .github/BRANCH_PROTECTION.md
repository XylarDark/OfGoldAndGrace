# Branch Protection Rules

This document outlines the recommended branch protection rules for the Of Gold And Grace Shopify theme repository.

## Main Branch Protection

### Required Status Checks
- [ ] `CI` - GitHub Actions CI workflow must pass
- [ ] Require branches to be up to date before merging
- [ ] Require status checks to pass before merging

### Branch Protection Rules
- [ ] Require a pull request before merging
- [ ] Require approvals: 1 approval required
- [ ] Dismiss stale pull request approvals when new commits are pushed
- [ ] Require review from Code Owners (if CODEOWNERS file exists)
- [ ] Restrict who can dismiss pull request reviews
- [ ] Allow specified actors to bypass required pull requests (maintainers only)

### Merge Settings
- [ ] Allow squash merging
- [ ] Allow merge commits (disabled - prefer squash)
- [ ] Allow rebase merging
- [ ] Default to squash merge

### GitHub Repository Settings

1. **Navigate to**: Repository Settings → Branches
2. **Add Rule**: Click "Add branch protection rule"
3. **Branch name pattern**: `main`
4. **Configure the rules as listed above**

## Development Branch Strategy

### Branch Naming Convention
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/documentation-update` - Documentation updates
- `perf/performance-improvement` - Performance improvements
- `chore/maintenance-task` - Maintenance tasks

### Pull Request Template
Consider adding a `.github/PULL_REQUEST_TEMPLATE.md` file:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested locally with Shopify CLI
- [ ] Linting passes
- [ ] No console errors
- [ ] Responsive design verified

## Screenshots (if applicable)
Add screenshots of visual changes.

## Checklist
- [ ] Code follows the `.cursorrules` guidelines
- [ ] Commit message follows conventional commits
- [ ] Documentation updated if needed
- [ ] No sensitive data committed
```

## Code Review Guidelines

### Review Checklist
- [ ] Code follows the established patterns
- [ ] Accessibility standards maintained (WCAG AA)
- [ ] Performance considerations addressed
- [ ] Liquid syntax is valid
- [ ] No hardcoded secrets or API keys
- [ ] Cross-browser compatibility considered
- [ ] Mobile responsiveness verified

### Code Owners (Optional)
Create `.github/CODEOWNERS` file:

```
# Global owners
* @your-username

# Theme specific
sections/ @your-username
snippets/ @your-username
assets/ @your-username
```

## Deployment Workflow

### Environment Branches
- `main` → Production deployment
- `staging` → Staging environment (optional)
- `develop` → Development integration branch (optional)

### Deployment Process
1. Create feature branch from `main`
2. Make changes and commit with conventional commits
3. Create pull request to `main`
4. CI checks must pass
5. Code review required
6. Squash merge to `main`
7. Automatic deployment via GitHub Actions

## Security Considerations

- Never commit API keys or secrets
- Use GitHub Secrets for deployment credentials
- Require security reviews for authentication-related changes
- Regular dependency updates via Dependabot

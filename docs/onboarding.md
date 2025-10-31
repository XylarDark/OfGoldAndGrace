# Contributor Onboarding

Welcome! This guide will help you get started contributing to this Shopify theme project.

## Prerequisites

Before you begin, ensure you have:

- [ ] Git installed and configured
- [ ] Code editor/IDE of choice
- [ ] Node.js 20.x LTS (for development tools)
- [ ] Basic familiarity with Shopify Liquid templating
- [ ] Understanding of HTML, CSS, and JavaScript

## Getting Started

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/[owner]/[repo].git
cd [repo]

# Install dependencies
npm install

# Set up Shopify CLI (if developing locally)
npm run setup-shopify
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure Shopify credentials
# Follow docs/secrets-management.md for guidance
```

### 3. Development Environment

```bash
# Start development server (if using Shopify CLI)
shopify theme dev

# Run tests
npm test

# Run linting
npm run lint

# Check formatting
npm run format:check
```

## Understanding the Project

### Key Files and Directories

- **`.cursorrules`**: Governance and development standards
- **`README.md`**: Setup and usage instructions
- **`CONTRIBUTING.md`**: Development workflow
- **`docs/`**: Documentation and guides
- **`layout/`**: Main theme layout files
- **`sections/`**: Reusable theme sections
- **`snippets/`**: Template snippets and components
- **`assets/`**: JavaScript, CSS, and other assets

### Development Workflow

1. **Choose an Issue**: Find something to work on from GitHub Issues
2. **Create a Branch**: Use descriptive branch names (`feat/`, `fix/`, `docs/`)
3. **Plan Your Changes**: Follow the Plan-Mode workflow from `.cursorrules`
4. **Write Code**: Follow Liquid, JavaScript, and CSS best practices
5. **Write Tests**: Ensure adequate test coverage for JavaScript
6. **Update Documentation**: Keep docs current
7. **Create PR**: Follow the PR template with Scope Gate
8. **Code Review**: Address feedback
9. **Merge**: Once approved

## Development Guidelines

### Code Style

- Follow ESLint and Prettier rules
- Use consistent Liquid templating patterns
- Follow BEM CSS methodology
- Write semantic HTML with accessibility in mind
- Use data attributes for JavaScript hooks

### Testing

- Write tests for JavaScript functionality
- Test Liquid templates across different viewports
- Validate accessibility with screen readers
- Test performance budgets are maintained

### Commits

- Use conventional commit format: `type(scope): description`
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Reference issues when applicable

### Pull Requests

- Fill out the PR template completely
- Complete the Scope Gate checklist
- Include testing instructions
- Add screenshots for UI changes
- Ensure CI checks pass
- Request review from appropriate maintainers

## Learning Resources

### Documentation

- [README.md](../README.md) - Project overview and setup
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [`.cursorrules`](.cursorrules) - Governance rules and patterns
- [docs/rules-changelog.md](rules-changelog.md) - Rules evolution

### Tools and Technologies

- **Version Control**: Git with GitHub
- **CI/CD**: GitHub Actions with Shopify CLI
- **Code Quality**: ESLint, Prettier, Shopify Theme Check
- **Testing**: Jest for JavaScript unit tests
- **Documentation**: Markdown, JSDoc
- **Deployment**: Shopify theme deployment

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Shopify Community**: Liquid and theme development questions

### When to Ask for Help

- Stuck on Shopify Liquid syntax or concepts
- Need clarification on theme architecture
- Encountering unexpected behavior
- Need design or accessibility guidance

## First Contributions

### Good First Issues

Look for issues labeled:
- `good first issue`
- `help wanted`
- `beginner friendly`

### Example Workflow

1. **Find an Issue**: Look for `good first issue` labeled items
2. **Claim It**: Comment that you'd like to work on it
3. **Create Branch**: `git checkout -b feat/issue-description`
4. **Implement**: Follow the development guidelines
5. **Test**: Ensure everything works across devices
6. **Commit**: `git commit -m "feat: implement issue description"`
7. **Push**: `git push origin feat/issue-description`
8. **PR**: Create pull request with filled template

## Code Review Process

### As a Contributor

- Address all review feedback
- Explain your reasoning when disagreeing
- Make requested changes promptly
- Keep the PR updated with main branch

### As a Reviewer

- Be constructive and specific
- Explain reasoning for suggestions
- Acknowledge good work
- Focus on code quality and standards

## Advanced Topics

### Governance and Standards

- Understand `.cursorrules` and follow them
- Participate in architecture decisions (ADRs)
- Contribute to RFCs for major theme changes
- Help maintain accessibility and performance standards

### Tooling and Automation

- Learn about Shopify CLI and theme development
- Understand Liquid templating deeply
- Familiarize with theme customization APIs
- Contribute to automation scripts

## Recognition and Growth

### Recognition

- Contributors listed in release notes
- GitHub contributor statistics
- Recognition in team communications

### Growth Opportunities

- Take on more complex theme features
- Help review others' code
- Contribute to documentation
- Participate in theme architecture discussions

## Next Steps

After completing your first contribution:

1. **Celebrate!** 🎉 You've contributed to a Shopify theme
2. **Reflect**: What did you learn? What could be improved?
3. **Continue**: Look for more issues to work on
4. **Share**: Tell others about your experience

Welcome to the team! We're excited to have you contributing to our Shopify theme.

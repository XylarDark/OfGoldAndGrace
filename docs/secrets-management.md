# Secrets Management

This guide covers secure handling of secrets, credentials, and sensitive configuration in this Shopify theme project.

## Principles

1. **Never commit secrets** to version control
2. **Use Shopify settings** for theme configuration
3. **Limit secret exposure** in client-side code
4. **Audit third-party integrations** regularly
5. **Follow Shopify security best practices**

## Shopify Theme Security

### Theme Settings vs Secrets

- **Theme Settings**: Use Shopify's built-in settings schema for configurable values
- **App Secrets**: Never expose app API keys in theme code
- **Client-side Data**: Avoid sensitive data in JavaScript accessible to users

### Settings Schema Security

```json
// config/settings_schema.json
{
  "name": "API Configuration",
  "settings": [
    {
      "type": "text",
      "id": "api_key",
      "label": "API Key",
      "info": "Keep this secure - not exposed to frontend"
    }
  ]
}
```

## Environment Variables

### Local Development

Create a `.env` file in your project root (never commit this file):

```bash
# Copy from template
cp .env.example .env

# Edit with your values
nano .env
```

### Shopify Deployment

Use Shopify's secure settings:
- **Online Store Settings**: Theme settings for configuration
- **App Settings**: Private app credentials (not in theme)
- **Environment Variables**: Through deployment platforms

## Secret Types in Themes

### Third-Party API Keys

```javascript
// Good: Use theme settings (server-side only)
const apiKey = {{ settings.api_key | json }};

// Bad: Hardcoded in JavaScript
const apiKey = 'sk-1234567890abcdef';
```

### External Service Credentials

```liquid
{%- comment -%}
  Use theme settings for service configuration
{%- endcomment -%}
{% assign service_url = settings.service_url %}
{% assign service_token = settings.service_token %}
```

### Local Development Secrets

```bash
# .env file for local development
SHOPIFY_STORE_URL=https://your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_API_KEY=your_api_key_here
```

## Best Practices

### Theme Development

- Use theme settings for all configurable values
- Never expose API keys in client-side JavaScript
- Validate all user inputs server-side
- Use Shopify's built-in Liquid filters for sanitization
- Limit third-party script access to necessary domains

### Third-Party Integrations

- Use official Shopify apps when possible
- Audit app permissions and data access
- Keep integrations updated
- Monitor for deprecated API usage
- Document integration purposes and data flows

### Code Security

```liquid
{%- comment -%}
  Good: Sanitize user inputs
{%- endcomment -%}
{% assign user_input = customer.email | escape %}

{%- comment -%}
  Good: Use theme settings instead of hardcoded values
{%- endcomment -%}
{% assign api_endpoint = settings.api_endpoint %}
```

## Security Scanning

### Theme-Specific Scanning

Consider using tools like:
- **Shopify Theme Check**: Validates theme code against Shopify standards
- **CodeQL**: General code security scanning
- **Dependency Review**: Checks for vulnerable npm packages

### CI/CD Security Checks

```yaml
# Example GitHub Actions for theme security
- name: Theme Check
  run: shopify theme check

- name: Dependency Review
  uses: actions/dependency-review-action@v4

- name: CodeQL Analysis
  uses: github/codeql-action/analyze@v3
```

## Shopify Security Features

### Content Security Policy

- Shopify automatically applies CSP headers
- Theme code cannot modify CSP directly
- Use Shopify's approved script tags

### Data Protection

- Customer data handled according to GDPR/CCPA
- PCI compliance for payment processing
- Shopify handles data encryption at rest/transit

## Emergency Procedures

### API Key Compromise

1. **Immediately rotate** the compromised API key
2. **Update theme settings** with new key
3. **Audit integration usage** for unauthorized access
4. **Notify affected merchants** if data exposure occurred
5. **Review security practices** to prevent recurrence

### Theme Security Incident

1. **Isolate affected theme** by switching to backup
2. **Audit theme code** for malicious content
3. **Update Shopify** and all integrations
4. **Monitor store activity** for suspicious behavior
5. **Document incident** and prevention measures

## Compliance

### E-commerce Regulations

- **PCI DSS**: Payment card industry standards
- **GDPR**: EU data protection regulation
- **CCPA**: California consumer privacy act
- **ADA**: Web accessibility requirements

### Shopify Compliance

- **Theme Store Guidelines**: Official theme requirements
- **App Store Policies**: For integrated apps
- **Merchant Data Protection**: Customer and order data handling

## Training

### Team Education

- Regular Shopify security updates review
- Theme development best practices training
- Integration security assessment
- Customer data protection awareness

### Documentation

- Keep this document updated
- Include security checklists in PR templates
- Document integration security requirements
- Maintain incident response procedures

## Monitoring and Auditing

### Theme Monitoring

- Monitor for unusual theme file changes
- Audit third-party app permissions regularly
- Review integration data access patterns
- Track theme performance and security metrics

### Automated Monitoring

```yaml
# Example theme security monitoring
- name: Theme Security Check
  run: |
    # Check for hardcoded secrets
    grep -r "password\|secret\|key.*=.*['\"]" --exclude-dir=.git assets/ || echo "No hardcoded secrets found"

    # Validate theme settings usage
    shopify theme check --category security
```

## References

- [Shopify Theme Security Best Practices](https://shopify.dev/themes/tools/theme-check/security)
- [Shopify App Security Requirements](https://shopify.dev/apps/store/security)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PCI DSS for E-commerce](https://www.pcisecuritystandards.org/)

# Security Guidelines

## Overview

This document outlines security best practices and requirements for the App Fitness Backend. All developers and operators must follow these guidelines.

---

## Secrets Management

### Never Commit Secrets

**Forbidden locations for secrets:**
- ❌ `.env` file (local, ignored by .gitignore but easy to accidentally commit)
- ❌ `.env.example` (must contain only example values)
- ❌ `docker-compose.yml` (environment section)
- ❌ Hardcoded in source code
- ❌ Comments or documentation
- ❌ Git history (use `git-filter-repo` to remove if accidentally pushed)

### Handling Secrets Correctly

**Development:**
```bash
# Create local .env file (gitignored)
cp .env.example .env.local

# Edit with real values
DATABASE_URL=postgresql://fitness_dev:password@localhost:5432/fitness_db
JWT_ACCESS_SECRET=dev_secret_must_be_32_chars_min_1234567890abcdef
```

**Production:**
```bash
# Use environment secrets manager:

# AWS Secrets Manager
aws secretsmanager create-secret --name fitness/DATABASE_URL --secret-string "postgresql://..."

# GitHub Actions secrets
# Go to Settings > Secrets > Actions > New repository secret

# Docker/Kubernetes secrets
docker secret create JWT_ACCESS_SECRET - < secret.txt
```

### Secret Rotation

**Schedule:**
- JWT secrets: Every 90 days
- Database password: Every 30 days
- API keys: As vendor recommends (usually 90-180 days)

**Process:**
1. Generate new secret
2. Add to secrets manager
3. Update environment in staging
4. Test thoroughly
5. Update production
6. Revoke old secret after 24 hours (grace period for cache)

---

## Environment Variables

### Required Variables (Cannot be empty or invalid)

Validated in `src/config/env.validation.ts`:

```typescript
const REQUIRED = [
  "DATABASE_URL",        // Must be valid PostgreSQL connection string
  "JWT_ACCESS_SECRET",   // Must be >= 32 characters
  "JWT_REFRESH_SECRET",  // Must be >= 32 characters
  "CORS_ORIGINS",        // Must be comma-separated valid URLs
];
```

**Startup will fail if any are missing or invalid.**

### Recommended Security Values

| Variable | Minimum Length | Recommendation |
|---|---|---|
| `JWT_ACCESS_SECRET` | 32 chars | 64 chars, alphanumeric + symbols |
| `JWT_REFRESH_SECRET` | 32 chars | 64 chars, alphanumeric + symbols |
| `DATABASE_URL` | - | Use SSL/TLS connection (sslmode=require) |

### Generate Secure Secrets

```bash
# Linux/Mac
openssl rand -base64 32    # 32-char random
openssl rand -base64 64    # 64-char random (recommended)

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Database Security

### Connection String Best Practices

**Good:**
```env
DATABASE_URL=postgresql://user:password@prod-db.aws.rds.amazonaws.com:5432/fitness_prod?sslmode=require
```

**Bad:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/fitness_db
DATABASE_URL=postgresql://admin:admin123@db.example.com/app
```

### Credentials

- ✓ Database user should have minimal permissions (not root/postgres)
- ✓ Use separate users for development, staging, production
- ✓ Disable default users (postgres, admin)
- ✓ Use strong passwords (20+ random characters)
- ✗ Never use default credentials
- ✗ Never hardcode credentials in code

### Backups

- Enable automated backups (daily minimum)
- Store backups in separate location (different AWS region)
- Test restore process monthly
- Encrypt backups at rest and in transit

---

## API Security

### Authentication & Authorization

The API uses JWT (JSON Web Tokens):

**Flow:**
1. User logs in with credentials
2. Server issues `access_token` (15-60 min expiry) + `refresh_token` (7-30 days)
3. Client stores tokens securely
4. Each request includes: `Authorization: Bearer <access_token>`
5. If expired, use `refresh_token` to get new `access_token`
6. If `refresh_token` expires, re-login

**Enforcement in code:**
```typescript
// All protected routes must use auth guard
@UseGuards(JwtAuthGuard)
@Get('protected')
getProtected() { ... }
```

### CORS Configuration

**Strict CORS settings:**
```env
# Only allow your frontend origin(s)
CORS_ORIGINS=https://fitness-app.com,https://www.fitness-app.com

# NOT allowed:
CORS_ORIGINS=*                    # ❌ Too permissive
CORS_ORIGINS=http://localhost:*   # ❌ Wildcard
CORS_ORIGINS=*.example.com        # ❌ Subdomain wildcard
```

### HTTPS / TLS

**Requirements:**
- ✓ Production must use HTTPS (TLS 1.2+)
- ✓ Use valid SSL certificate (not self-signed)
- ✓ Certificate must match domain
- ✓ Enable HSTS header (Helmet.js does this)

**Testing:**
```bash
# Check certificate
openssl s_client -connect api.fitness-app.com:443 -showcerts

# Grade (should be A or A+)
https://www.ssllabs.com/ssltest/
```

### Rate Limiting

Configure for public endpoints:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,           // 60 seconds
      limit: 10,         // 10 requests per minute
    }),
  ],
})
export class AppModule {}
```

### Input Validation

All inputs validated via DTOs and class-validator:

```typescript
import { IsEmail, IsStrongPassword, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @MaxLength(100)
  firstName: string;
}
```

**Validators reject:**
- SQL injection attempts
- XSS payloads (in JSON endpoints)
- Oversized inputs
- Invalid email formats
- Weak passwords

---

## Code Security

### Dependencies

**Regular audits:**
```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically (if available)
pnpm audit --fix

# Use in CI/CD
```

**Version management:**
- Use exact versions in `package.json` (not `^` or `~`)
- Review CHANGELOG before upgrades
- Test upgrades in staging first
- Never use packages from untrusted sources

**Supply chain protection:**
- Use npm/pnpm official registry only
- Verify package checksums
- Monitor for typosquatting (`bcrypto` vs `bcrypt`)

### Code Review

All PRs require:
- [ ] Security review (no hardcoded secrets, SQL injection, XSS)
- [ ] Dependency audit (`pnpm audit`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] No console.log of sensitive data

**Secrets check (automated):**
```bash
# Pre-commit hook checks for patterns
git secrets --scan
```

### Logging

**What to log:**
- ✓ Error messages (without passwords)
- ✓ API requests (method, path, status code)
- ✓ Audit trail (user actions, timestamps)
- ✓ Database query errors

**Never log:**
- ✗ Passwords or authorization headers
- ✗ JWT tokens
- ✗ Credit card numbers
- ✗ Full database connection strings

**Implementation:**
```typescript
// ✓ Good
logger.info(`User ${userId} created account`);
logger.error(`Database error: ${error.message}`);

// ✗ Bad
logger.info(`Authorization: Bearer ${token}`);
logger.debug(`Password: ${password}`);
console.log(process.env.DATABASE_URL);
```

---

## Container Security

### Docker Best Practices

**In Dockerfile:**
```dockerfile
# ✓ Use specific Alpine version
FROM node:20.16-alpine

# ✓ Run as non-root
USER nodejs

# ✓ Don't run as root
# Avoid: RUN npm install -g package

# ✗ Avoid: COPY .env into image
# Use: environment variables at runtime
```

**Image scanning:**
```bash
# Scan for vulnerabilities
docker scan fitness-api:latest

# Use minimal base images
# Alpine < 100MB vs Ubuntu > 500MB
```

### Runtime Security

**Container limits:**
```yaml
# docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

**Network isolation:**
```yaml
# Only expose what's needed
ports:
  - "4000:4000"  # API only (not debug port 9229 in prod)

# Don't expose:
# - Database port
# - Debug ports
# - Admin panels
```

---

## Infrastructure Security

### Database Server

- [ ] Enable SSL connections (require in connection string)
- [ ] Restrict firewall to app server IPs only
- [ ] Enable audit logging
- [ ] Regular automated backups to separate region
- [ ] Encryption at rest

### API Server

- [ ] Run behind load balancer with HTTPS
- [ ] Use WAF (Web Application Firewall) if available
- [ ] Enable DDoS protection
- [ ] Restrict SSH access (key-based, no passwords)
- [ ] Auto-update OS security patches

### Network

- [ ] Use private subnets for database
- [ ] VPC / security groups restrict traffic
- [ ] Bastion host for admin access
- [ ] VPN for private connections
- [ ] No hardcoded IPs in code

---

## Incident Response

### If Credentials are Leaked

1. **Immediate (minutes):**
   - Revoke the secret in secrets manager
   - Rotate in production if actively used

2. **Short term (hours):**
   - Audit logs for unauthorized access
   - Generate new secret
   - Update all systems

3. **Follow up (days):**
   - Post-mortem analysis
   - Implement preventive measures
   - Update runbooks

### If Data is Breached

1. **Assess:**
   - Which data was exposed?
   - How many users affected?
   - What access was gained?

2. **Contain:**
   - Revoke compromised tokens
   - Force password resets
   - Isolate affected systems

3. **Notify:**
   - Inform affected users
   - Report to authorities if required
   - Notify stakeholders

4. **Improve:**
   - Security audit
   - Increase monitoring
   - Implement additional controls

---

## Compliance & Standards

### Standards Met

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) mitigation
- JWT best practices (RFC 7519)
- NIST password guidelines
- CWE-200 mitigation (information exposure)

### Regular Reviews

Schedule:
- **Monthly:** Dependency audits
- **Quarterly:** Security code review
- **Annually:** Penetration testing (recommended)
- **Continuous:** GitHub security alerts

---

## Security Checklist for Deployment

Before deploying to production:

- [ ] All secrets in secrets manager (not in code/config)
- [ ] JWT secrets are 64+ random characters
- [ ] Database password is 20+ random characters
- [ ] CORS_ORIGINS restricted to exact domains
- [ ] HTTPS/TLS enabled
- [ ] Database in private subnet only
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't capture passwords/tokens
- [ ] Dependency audit passes (`pnpm audit`)
- [ ] No console.log in code
- [ ] Docker image scanned for vulnerabilities
- [ ] Health check implemented and tested
- [ ] Backups tested and working

---

## Contact & Escalation

For security issues:

1. **Do NOT** create public GitHub issues
2. **Do NOT** commit exploits to the repo
3. **Email:** Report to security team
4. Allow 48 hours for response

---

## References

- [OWASP Security Best Practices](https://owasp.org/www-project-web-security-testing-guide/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Docker Security](https://docs.docker.com/engine/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-syntax.html#SQL-SYNTAX.LEXICAL.SPECIAL-CHARS)

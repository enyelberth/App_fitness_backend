# Deployment Guide

## Overview

This guide covers deployment of the App Fitness Backend API to production environments. The application is containerized and follows cloud-native practices.

---

## Prerequisites

- Docker & Docker Compose
- PostgreSQL 16+ (managed or self-hosted)
- Node.js 20.x (for local builds)
- pnpm 9.x (for local builds)

---

## Environment Setup

### Production Environment Variables

Before deploying, ensure these variables are configured (never commit secrets):

```env
# Database
DATABASE_URL=postgresql://prod_user:secure_password@prod-db-host:5432/fitness_prod

# JWT (generate using: openssl rand -base64 32)
JWT_ACCESS_SECRET=<generate-secure-token-32-chars-minimum>
JWT_REFRESH_SECRET=<generate-secure-token-32-chars-minimum>

# CORS (frontend origin)
CORS_ORIGINS=https://fitness-app.com,https://app.fitness-app.com

# Server
PORT=4000
NODE_ENV=production
```

**Never include secrets in:**
- `.env.example`
- `docker-compose.yml`
- `.env` file (ignored by .gitignore)
- Version control

---

## Local Docker Build

### Build Production Image

```bash
docker build -t fitness-api:latest .
```

**Image specs:**
- Base: `node:20-alpine` (lightweight)
- Size: ~250MB (optimized multi-stage build)
- Security: Non-root user, dumb-init for signals
- Health check: Automatic via `curl /api/v1/health`

### Run Locally

```bash
# Set environment variables
export DATABASE_URL="postgresql://..."
export JWT_ACCESS_SECRET="..."
export JWT_REFRESH_SECRET="..."

# Run container
docker run \
  -p 4000:4000 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e JWT_ACCESS_SECRET="$JWT_ACCESS_SECRET" \
  -e JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
  -e CORS_ORIGINS="http://localhost:3000" \
  fitness-api:latest
```

### Test Health Check

```bash
curl http://localhost:4000/api/v1/health
```

Expected response:
```json
{"status": "ok", "timestamp": "2025-01-15T10:30:45.123Z"}
```

---

## Cloud Deployment

### AWS ECS (Recommended)

#### 1. Push to ECR

```bash
# Authenticate with ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag fitness-api:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fitness-api:latest

# Push
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fitness-api:latest
```

#### 2. ECS Task Definition

```json
{
  "family": "fitness-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "fitness-api",
      "image": "<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/fitness-api:latest",
      "portMappings": [
        {
          "containerPort": 4000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "4000"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:fitness/DATABASE_URL"
        },
        {
          "name": "JWT_ACCESS_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:fitness/JWT_ACCESS_SECRET"
        },
        {
          "name": "JWT_REFRESH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:fitness/JWT_REFRESH_SECRET"
        },
        {
          "name": "CORS_ORIGINS",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<ACCOUNT_ID>:secret:fitness/CORS_ORIGINS"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:4000/api/v1/health || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3,
        "startPeriod": 60
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/fitness-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### 3. Create ECS Service

```bash
aws ecs create-service \
  --cluster fitness-cluster \
  --service-name fitness-api \
  --task-definition fitness-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=DISABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<ACCOUNT_ID>:targetgroup/fitness-api/xxx,containerName=fitness-api,containerPort=4000
```

### Docker Compose on VPS

For simpler deployments on VPS (DigitalOcean, Linode, etc.):

```bash
# On server
git clone https://github.com/enyelberth/App_fitness_backend.git
cd App_fitness_backend

# Create .env with production variables
cat > .env <<EOF
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGINS=https://fitness-app.com
PORT=4000
NODE_ENV=production
EOF

# Use production docker-compose
docker-compose -f docker-compose.yml up -d
```

### Vercel / Netlify

Not recommended for database-dependent backends. Use AWS, Google Cloud, or DigitalOcean instead.

---

## Database Migrations

### Before First Deploy

Run migrations to initialize schema:

```bash
# In container or local environment
pnpm db:generate
pnpm db:deploy
```

**Do NOT use:**
- `pnpm db:migrate` (interactive, requires user input)
- `pnpm db:migrate:reset` (destructive, wipes data)

### Continuous Deployments

Add migration step to CI/CD:

```yaml
# GitHub Actions example
- name: Run Prisma migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: pnpm db:deploy
  # Only run after build succeeds
```

### Rollback Strategy

Prisma tracks migrations. To rollback:

```bash
# List applied migrations
pnpm prisma migrate resolve --rolled-back <MIGRATION_NAME>

# Then redeploy to apply correct version
pnpm db:deploy
```

---

## Monitoring & Logs

### Health Endpoint

Monitor `/api/v1/health` regularly:

```bash
# Every 30 seconds
watch -n 30 'curl -s http://api.fitness-app.com/api/v1/health | jq'
```

### Docker Logs

```bash
# View logs
docker-compose logs -f api

# View last 100 lines
docker-compose logs --tail=100 api

# Errors only
docker-compose logs api | grep ERROR
```

### Production Logging

Configure centralized logging:

**CloudWatch (AWS):**
```yaml
# In docker-compose.yml or task definition
logging:
  driver: awslogs
  options:
    awslogs-group: /ecs/fitness-api
    awslogs-region: us-east-1
    awslogs-stream-prefix: ecs
```

**Datadog:**
```dockerfile
# In Dockerfile
RUN npm install datadog/browser-sdk
```

**Sentry (Error tracking):**
Add to `src/main.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

---

## Scaling

### Horizontal Scaling

Deploy multiple container replicas behind a load balancer:

**ECS Service auto-scaling:**
```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/fitness-cluster/fitness-api \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10
```

**Docker Swarm:**
```bash
docker service create \
  --replicas 3 \
  --publish 4000:4000 \
  fitness-api:latest
```

### Database Connection Pool

For high traffic, configure connection pooling:

**PgBouncer (Recommended):**
```ini
[databases]
fitness = host=prod-db port=5432 dbname=fitness_prod

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
```

Update `DATABASE_URL`:
```env
DATABASE_URL=postgresql://user:pass@pgbouncer-host:6432/fitness
```

---

## Security Checklist

- [ ] Environment variables stored in secrets manager (AWS Secrets Manager, Vault, etc.)
- [ ] Database password is strong (20+ random characters)
- [ ] JWT secrets are strong and unique (use `openssl rand -base64 32`)
- [ ] CORS_ORIGINS restricted to your frontend domain(s)
- [ ] HTTPS enforced (ALB/CloudFront with TLS certificate)
- [ ] Security headers enabled (Helmet.js included)
- [ ] Database backups automated and tested
- [ ] API rate limiting configured
- [ ] Secrets not in logs (no DATABASE_URL printing)
- [ ] Docker runs as non-root user
- [ ] Regular dependency updates (`pnpm audit`)

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs <container_id>

# Common issues:
# 1. Missing env vars
# 2. Database connection failed
# 3. Port already in use
```

### Database Connection Timeout

```bash
# Verify database is reachable
psql postgresql://user:pass@host:5432/dbname

# Check security groups / firewall rules
# Verify DATABASE_URL format
```

### High Memory Usage

```bash
# Check Node process
docker stats <container_id>

# Possible causes:
# 1. Memory leak in code
# 2. Prisma not pooling connections
# 3. Large response payloads
```

---

## Rollback Procedure

If a deployment fails:

```bash
# Revert to previous image tag
docker pull fitness-api:previous-tag

# Update service
docker-compose down
docker-compose up -d

# Or in ECS
aws ecs update-service \
  --cluster fitness-cluster \
  --service fitness-api \
  --force-new-deployment
```

---

## Resources

- [Docker Production Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS ECS Deployment](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment/deploy-to-aws-rds)
- [Node.js Production Checklist](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

# Track: DevOps & Infrastructure Task Domain Expansion

## Overview
Expand the BLB task catalog to cover brownfield DevOps and infrastructure engineering tasks. Real-world teams frequently need to integrate CI/CD pipelines, containerize legacy services, or manage infrastructure-as-code in existing repositories. This track adds reproducible DevOps tasks to the benchmark so models are evaluated on practical infrastructure integration work.

## Goals
- Add 5–8 DevOps/infrastructure task definitions to the benchmark catalog
- Create authentic repo snapshots featuring broken CI, missing Docker configs, or incomplete Terraform modules
- Adapt the scoring rubric to reward safe, idempotent infrastructure changes
- Ensure tasks are runnable in the existing harness without extra cloud credentials

## Acceptance Criteria
- [ ] At least 5 DevOps tasks added to `data/tasks.json` with metadata, repo snapshots, and acceptance rubrics
- [ ] Repo snapshots cover: CI/CD pipeline fix, Dockerfile creation, docker-compose integration, GitHub Actions workflow, basic Terraform/AWS module
- [ ] Scoring rubric weights operational correctness (35), integration safety (30), rollback awareness (20), minimality (10), docs (5)
- [ ] All new tasks pass harness validation (schema, snapshot integrity, scoring computation)
- [ ] Leaderboard and task catalog UI render DevOps domain filter correctly
- [ ] Documentation updated to list DevOps as a supported task domain

## Non-Goals
- Multi-cloud provider support (AWS only for Terraform tasks)
- Real cloud resource provisioning (use LocalStack or mock AWS APIs)
- Kubernetes orchestration tasks (deferred to future track)

# Spec: Benchmark Harness Docker Containerization

## Context
The Brownfield LLM Benchmark harness currently runs OpenCode directly on the host. This creates environment drift and makes it hard to reproduce benchmark results across machines.

## Goal
Containerize the benchmark harness execution environment so that runs are reproducible regardless of host system differences.

## Acceptance Criteria
- [ ] Dockerfile builds a clean image with Node.js, OpenCode CLI, and benchmark harness
- [ ] Docker Compose file mounts repo snapshots as volumes
- [ ] Harness can execute a full benchmark run inside the container
- [ ] Container output (diffs, scores, logs) is written back to host filesystem
- [ ] CI workflow validates the Docker build on every PR

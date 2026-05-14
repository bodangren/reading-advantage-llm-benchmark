# Plan: Benchmark Harness Docker Containerization

## Phase 1: Dockerfile and Base Image
- [ ] Write tests verifying Docker image builds successfully
- [ ] Create `docker/Dockerfile.harness` with pinned Node.js and OpenCode versions
- [ ] Add `.dockerignore` excluding node_modules and runs/
- [ ] Build image locally and verify `docker build` succeeds

## Phase 2: Docker Compose and Volume Wiring
- [ ] Write integration test script for containerized harness
- [ ] Create `docker/docker-compose.harness.yml`
- [ ] Mount repo snapshots volume and output volume
- [ ] Verify harness can read snapshots and write scores from inside container

## Phase 3: Harness Adapter
- [ ] Write tests for containerized execution path
- [ ] Add `--docker` flag to harness CLI
- [ ] Implement `DockerExecutor` class wrapping `docker run` with timeout and cleanup
- [ ] Ensure container exit codes map correctly to run status

## Phase 4: CI Integration
- [ ] Add GitHub Actions job `docker-build` to `.github/workflows/ci.yml`
- [ ] Cache Docker layers for fast builds
- [ ] Run a smoke benchmark inside container in CI
- [ ] Document usage in `docs/harness-docker.md`

## Phase 5: Verification
- [ ] Full test suite green
- [ ] At least one benchmark run completes successfully in container
- [ ] Update lessons-learned.md
- [ ] Commit and push

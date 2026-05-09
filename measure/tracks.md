# Project Tracks

This file tracks all major tracks for the project. Each track has its own detailed plan in its respective folder.

---

## Active/Planned Tracks

- [x] **Track: Backend/API Task Domain Expansion**
  *Link: [./tracks/backend_task_domain_expansion_20260508/](./tracks/backend_task_domain_expansion_20260508/)*
  *Status: Complete*
  Add backend tasks (DB, API, auth, service refactor) to the benchmark catalog with adapted scoring rubric.

- [ ] **Track: Benchmark Version Migration**
  *Link: [./tracks/benchmark_version_migration_20260507/](./tracks/benchmark_version_migration_20260507/)*
  Version-aware leaderboard filtering, cross-version score normalization, and version history page for fair comparison across benchmark iterations.

- [ ] **Track: Serverless-Compatible Persistence Layer**
  *Link: [./tracks/serverless_persistence_layer_20260508/](./tracks/serverless_persistence_layer_20260508/)*
  Replace in-memory rate limiting and filesystem-based scheduler persistence with Redis-backed adapters for serverless deployments, with local-dev fallback.

## Completed Tracks

- [x] **Track: Redis Serverless Adapter for Rate Limiting and Scheduling**
  *Link: [./archive/redis_serverless_adapter_20260509/](./archive/redis_serverless_adapter_20260509/)*
  *Status: Complete*
  Implement Redis-backed rate limiter and schedule store with local-dev fallback.

- [x] **Track: Fix Test Schema Drift** *Link: [./archive/fix_test_schema_drift_20260508/](./archive/fix_test_schema_drift_20260508/)* — Systematically repair test mock data to align with current TaskSpec and BenchmarkConfig schemas, then add a CI type-check gate to prevent future drift.

- [x] **Track: Task Difficulty Calibration**
  *Link: [./archive/task_difficulty_calibration_20260507/](./archive/task_difficulty_calibration_20260507/)*
  *Status: Complete*
  Data-driven difficulty scoring from historical pass rates; auto-reclassifies tasks and surfaces calibration health.

- [x] **Track: Benchmark Result Analytics & Trending**
  *Link: [./archive/benchmark_analytics_trending_20260506/](./archive/benchmark_analytics_trending_20260506/)*
  *Status: Complete*
  Time-series charts, regression detection, and historical model comparison.

- [x] **Track: Public API for Third-Party Integrations**
  *Link: [./archive/public_api_third_party_20260506/](./archive/public_api_third_party_20260506/)*
  *Status: Complete*
  Read-only REST API with key auth and rate limiting for external researchers.

- [x] **Track: Automated Benchmark Scheduling**
  *Link: [./archive/automated_benchmark_scheduling_20260506/](./archive/automated_benchmark_scheduling_20260506/)*
  Cron-based recurring benchmark runs with automatic result archiving.

- [x] **Track: Task Domain Expansion — Mobile & React Native**
  *Link: [./archive/task_domain_expansion_mobile_20260506/](./archive/task_domain_expansion_mobile_20260506/)*
  Add React Native brownfield tasks to the benchmark catalog.

- [x] **Track: Task Versioning Storage Cleanup**
  *Link: [./archive/version_cleanup_20260505/](./archive/version_cleanup_20260505/)*
  *Status: Complete*
  Cleanup utility for task version files with retention limits

- [x] **Track: Benchmark Data Export & API Layer**
  *Link: [./archive/benchmark_data_export_api_20260503/](./archive/benchmark_data_export_api_20260503/)*
  *Status: Complete*
  Read-only API, CSV export, and summary statistics for benchmark data

- [x] **Track: Regression Detection & Alert System**
  *Link: [./archive/regression_detection_alerts_20260503/](./archive/regression_detection_alerts_20260503/)*
  *Status: Complete*
  Cross-run score comparison with threshold-based regression reporting

- [x] **Track: Automated Task Generation Pipeline**
  *Link: [./archive/automated_task_generation_20260503/](./archive/automated_task_generation_20260503/)*
  *Status: Complete*
  LLM-assisted task generation from repo snapshots with review queue

- [x] **Track: Track B — Native Agent Evaluation Mode**
  *Link: [./archive/native_agent_track_b_20260503/](./archive/native_agent_track_b_20260503/)*
  *Status: Complete*

- [x] **Track: Interface Consolidation**
  *Link: [./archive/interface_consolidation_20260426/](./archive/interface_consolidation_20260426/)*
  *Status: Complete*

- [x] **Track: Score Normalization Audit**
  *Link: [./archive/score_normalization_audit_20260426/](./archive/score_normalization_audit_20260426/)*
  *Status: Complete*

- [x] **Track: Harness Implementation**
  *Link: [./archive/harness_implementation_20260426/](./archive/harness_implementation_20260426/)*
  *Status: Complete*

- [x] **Track: Visual Refresh: Define Unique Identity**
  *Link: [./archive/visual_refresh_20260425/](./archive/visual_refresh_20260425/)*
  *Status: Complete*

- [x] **Track: Task Authoring Interface**
  *Link: [./archive/task_authoring_interface_20260424/](./archive/task_authoring_interface_20260424/)*
  Form-based task editor, live preview, task versioning with diff view, bulk import/export.

- [x] **Track: Model Comparison Reports**
  *Link: [./archive/model_comparison_reports_20260423/](./archive/model_comparison_reports_20260423/)*

- [x] **Track: CI/CD Cost Tracking**
  *Link: [./archive/ci_cd_cost_tracking_20260423/](./archive/ci_cd_cost_tracking_20260423/)*

- [x] **Track: Run Detail Page & Artifact Viewer**
  *Link: [./archive/run_detail_page_20260408/](./archive/run_detail_page_20260408/)*

- [x] **Track: Task Catalog & Detail UI**
  *Link: [./archive/task_catalog_ui_20260408/](./archive/task_catalog_ui_20260408/)*

- [x] **Track: Prompt Dataset Versioning and Reproducibility**
  *Link: [./archive/dataset_versioning_20260407/](./archive/dataset_versioning_20260407/)*

- [x] **Track: Automated Cross-Model Evaluation Pipeline**
  *Link: [./archive/cross_model_eval_pipeline_20260407/](./archive/cross_model_eval_pipeline_20260407/)*

- [x] **Track: Create the Methodology Page and final UX polish**
  *Link: [./archive/methodology_20260404/](./archive/methodology_20260404/)*

- [x] **Track: Develop the Leaderboard System**
  *Link: [./archive/leaderboard_20260404/](./archive/leaderboard_20260404/)*
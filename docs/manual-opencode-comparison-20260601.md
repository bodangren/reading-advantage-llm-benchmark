# Manual OpenCode Benchmark Comparison - 2026-06-01

## Scope

This comparison covers two independent web-app API tasks run through OpenCode in detached worktrees. The built-in app scheduler/pipeline was bypassed because it does not yet produce reliable task-completion scores. The report was extended on 2026-06-02 with five additional OpenCode model IDs.

Tasks:

1. `manual_dataset_version_filter_v1` - add `datasetVersion` filtering to `GET /api/runs` through the shared run filtering utility.
2. `manual_task_status_filter_v1` - add `status` filtering to `GET /api/tasks` while preserving and combining the existing `difficulty` filter.

## Aggregate Results

| Rank | Model | Average | Task 1 | Task 2 | Total wall time | Notes |
|---:|---|---:|---:|---:|---:|---|
| 1 | Qwen3.6 Plus | 98 | 98 | 98 | 1112.1s | Best overall average; both tasks passed with focused route coverage. |
| 2 | Qwen3.7 Max | 97 | 98 | 96 | 772.1s | Second overall; faster than Qwen3.6 on the dataset task and clean across both tasks. |
| 3 | MiMo-V2.5-Pro | 96.5 | 96 | 97 | 323.9s | Best original-model result and still competitive after adding five models. |
| 4 | DeepSeek V4 Pro | 96.5 | 97 | 96 | 1279.4s | Strong correctness with slower completion times. |
| 5 | MiniMax-M3 | 95.5 | 97 | 94 | 777.7s | Strong original run; second task was less minimal. |
| 6 | VocEngine GLM-5.1 | 95.5 | 96 | 95 | 1104.2s | Good status-task result; dataset-task score capped for missing API route test coverage. |
| 7 | K2P6 | 95 | 96 | 94 | 744.7s | Useful test coverage but less minimal on the status task. |
| 8 | OpenCode-Go GLM-5.1 | 68.5 | 42 | 95 | 1057.0s | Mixed result: failed dataset route wiring, then recovered with a passing status-task implementation. |

## Per-Task Results

| Task | Model | OpenCode model id | Score | Functional | Integration | Regression | Minimality | Process | Wall time | Result |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Runs datasetVersion filter | Qwen3.6 Plus | `opencode-go/qwen3.6-plus` | 98 | 40 | 25 | 20 | 9 | 4 | 558.1s | Passed |
| Runs datasetVersion filter | Qwen3.7 Max | `opencode-go/qwen3.7-max` | 98 | 40 | 25 | 20 | 9 | 4 | 459.1s | Passed |
| Runs datasetVersion filter | DeepSeek V4 Pro | `opencode-go/deepseek-v4-pro` | 97 | 40 | 24 | 20 | 9 | 4 | 707.4s | Passed |
| Runs datasetVersion filter | MiniMax-M3 | `minimax-cn-coding-plan/MiniMax-M3` | 97 | 40 | 24 | 20 | 10 | 3 | 264.7s | Passed |
| Runs datasetVersion filter | K2P6 | `kimi-for-coding/k2p6` | 96 | 40 | 25 | 20 | 9 | 2 | 311.3s | Passed |
| Runs datasetVersion filter | MiMo-V2.5-Pro | `xiaomi/mimo-v2.5-pro` | 96 | 40 | 24 | 20 | 10 | 2 | 213.4s | Passed |
| Runs datasetVersion filter | VocEngine GLM-5.1 | `vocengine-coding/glm-5.1` | 96 | 40 | 23 | 20 | 10 | 3 | 798.2s | Passed |
| Runs datasetVersion filter | OpenCode-Go GLM-5.1 | `opencode-go/glm-5.1` | 42 | 18 | 8 | 10 | 3 | 3 | 817.0s | Targeted tests failed |
| Tasks status filter | Qwen3.6 Plus | `opencode-go/qwen3.6-plus` | 98 | 40 | 25 | 20 | 9 | 4 | 554.0s | Passed |
| Tasks status filter | MiMo-V2.5-Pro | `xiaomi/mimo-v2.5-pro` | 97 | 39 | 24 | 20 | 10 | 4 | 110.5s | Passed |
| Tasks status filter | DeepSeek V4 Pro | `opencode-go/deepseek-v4-pro` | 96 | 40 | 25 | 20 | 8 | 3 | 572.0s | Passed |
| Tasks status filter | Qwen3.7 Max | `opencode-go/qwen3.7-max` | 96 | 40 | 25 | 20 | 8 | 3 | 313.0s | Passed |
| Tasks status filter | OpenCode-Go GLM-5.1 | `opencode-go/glm-5.1` | 95 | 40 | 25 | 20 | 6 | 4 | 240.0s | Passed |
| Tasks status filter | VocEngine GLM-5.1 | `vocengine-coding/glm-5.1` | 95 | 40 | 25 | 20 | 7 | 3 | 306.0s | Passed |
| Tasks status filter | K2P6 | `kimi-for-coding/k2p6` | 94 | 40 | 24 | 20 | 6 | 4 | 433.4s | Passed |
| Tasks status filter | MiniMax-M3 | `minimax-cn-coding-plan/MiniMax-M3` | 94 | 40 | 24 | 20 | 6 | 4 | 513.0s | Passed |

## Verification

Every recorded run has independent verification artifacts: OpenCode event log, stderr log, base-relative diff patch, verification notes, targeted route/unit test result, changed-file lint result, and `npm run build` result. For the added model set, the only targeted-test failure was `opencode-go/glm-5.1` on the datasetVersion task; it passed lint/build but missed the root `app/api/runs` route wiring.

## Interpretation

The expanded comparison shifts the top of the table to the OpenCode-Go Qwen models. Qwen3.6 Plus is the top average scorer, while Qwen3.7 Max was faster overall and still placed second. MiMo-V2.5-Pro remains the strongest of the original three-model set. OpenCode-Go GLM-5.1 is volatile: it failed the first added task by editing the wrong route tree, then produced a passing second-task result.

## Caveats

This is still a small manual benchmark, not a statistically robust benchmark suite. The numbers are useful for directional comparison inside this project, but should not be treated as a published leaderboard without more tasks, repeated runs, and normalized runtime/cost capture.

## Artifacts

- `public/artifacts/manual-kimi-k2p6-dataset-filter-20260601/`
- `public/artifacts/manual-kimi-k2p6-task-status-filter-20260601/`
- `public/artifacts/manual-minimax-m3-dataset-filter-20260601/`
- `public/artifacts/manual-minimax-m3-task-status-filter-20260601/`
- `public/artifacts/manual-opencode-go-deepseek-v4-pro-dataset-filter-20260602/`
- `public/artifacts/manual-opencode-go-deepseek-v4-pro-task-status-filter-20260602/`
- `public/artifacts/manual-opencode-go-glm-51-dataset-filter-20260602/`
- `public/artifacts/manual-opencode-go-glm-51-task-status-filter-20260602/`
- `public/artifacts/manual-opencode-go-qwen36-plus-dataset-filter-20260602/`
- `public/artifacts/manual-opencode-go-qwen36-plus-task-status-filter-20260602/`
- `public/artifacts/manual-opencode-go-qwen37-max-dataset-filter-20260602/`
- `public/artifacts/manual-opencode-go-qwen37-max-task-status-filter-20260602/`
- `public/artifacts/manual-vocengine-glm-51-dataset-filter-20260602/`
- `public/artifacts/manual-vocengine-glm-51-task-status-filter-20260602/`
- `public/artifacts/manual-xiaomi-mimo-v25-pro-dataset-filter-20260601/`
- `public/artifacts/manual-xiaomi-mimo-v25-pro-task-status-filter-20260601/`

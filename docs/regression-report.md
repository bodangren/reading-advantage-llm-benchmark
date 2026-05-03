# Regression Report

Model: gpt-4o

Detected 2 regression(s):

| Task | Before | After | Delta |
|------|--------|-------|-------|
| task_import_game_v1 | 0.850 | 0.750 | -0.100 |
| task_async_validation | 0.900 | 0.800 | -0.100 |

## Interpretation

- A negative **Delta** indicates score degradation (after < before)
- Threshold used: 5% (0.050)
- Only tasks with degradation >= threshold are listed

## Usage

```bash
asf benchmark regress --model gpt-4o --threshold 0.05
```

Exit codes:
- `0` = No regressions detected
- `1` = Regressions detected (exits with error for CI/CD pipelines)
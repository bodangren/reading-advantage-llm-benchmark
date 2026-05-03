# API Reference

## Endpoints

### GET /api/runs

Returns benchmark run records with optional filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `model` | string | Filter by model (e.g., `gpt-4o`) |
| `task` | string | Filter by task ID |
| `startDate` | string | Filter runs after this date (YYYY-MM-DD) |
| `endDate` | string | Filter runs before this date (YYYY-MM-DD) |
| `minScore` | number | Filter runs with score >= minScore (0-1 scale) |
| `maxScore` | number | Filter runs with score <= maxScore (0-1 scale) |

**Example Request:**
```bash
curl "http://localhost:3000/api/runs?model=gpt-4o&minScore=0.8"
```

**Example Response:**
```json
{
  "count": 2,
  "runs": [
    {
      "id": "run-001",
      "model": "gpt-4o",
      "harness": "opencode",
      "harness_version": "1.0.0",
      "benchmark_version": "1.0",
      "run_date": "2026-04-05",
      "wall_time_seconds": 120,
      "total_score": 0.85,
      "scores": {
        "functional_correctness": 34,
        "integration_quality": 21,
        "regression_safety": 17,
        "minimality": 8,
        "process_quality": 4
      },
      "test_results": [],
      "artifacts": []
    }
  ]
}
```

### GET /api/leaderboard

Returns aggregated leaderboard statistics per model.

**Example Request:**
```bash
curl "http://localhost:3000/api/leaderboard"
```

**Example Response:**
```json
{
  "count": 2,
  "leaderboard": [
    {
      "model": "claude-3",
      "runs": 5,
      "latestRunDate": "2026-04-10",
      "meanScore": 0.892,
      "medianScore": 0.90,
      "p95Score": 0.94
    },
    {
      "model": "gpt-4o",
      "runs": 8,
      "latestRunDate": "2026-04-09",
      "meanScore": 0.834,
      "medianScore": 0.85,
      "p95Score": 0.92
    }
  ]
}
```

## CLI Export Command

Export benchmark runs to CSV or JSON via CLI:

```bash
asf benchmark export --format csv --output results.csv
asf benchmark export --format json --output results.json
asf benchmark export --format csv --model gpt-4o --output gpt4o_runs.csv
```

**Options:**

| Flag | Description |
|------|-------------|
| `--format` | Output format: `csv` or `json` (default: csv) |
| `--output` | Output file path (prints to stdout if not specified) |
| `--model` | Filter runs by model |
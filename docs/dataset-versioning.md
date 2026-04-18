# Dataset Versioning

## Version Format

Dataset versions use the `YYYY-MM-DD` date format (e.g., `2026-04-07`). This ensures chronological ordering and makes it clear when a dataset was introduced.

## Current Version

The current dataset version is stored in `data/datasets/dataset.json`.

```json
{
  "version": "2026-04-07",
  "created_at": "2026-04-07T12:00:00Z",
  "description": "Description of the dataset",
  "tasks": ["task_id_1", "task_id_2"]
}
```

## Version Bump Process

1. **Create a new dataset file**: Copy `data/datasets/dataset.json` and update the fields:
   - `version`: Set to the current date in `YYYY-MM-DD` format.
   - `created_at`: ISO 8601 timestamp of when the version was created.
   - `description`: Describe what changed in this dataset version.
   - `tasks`: List all task IDs included in this version.

2. **Update run records**: All new benchmark runs should include the `dataset_version` field matching the current dataset version. Runs without this field are treated as legacy (pre-versioning).

3. **Verify backward compatibility**: Existing runs without `dataset_version` remain valid. The `dataset_version` field is optional in the `RunSchema`.

4. **Run validation**: Run the test suite to verify all schemas still parse correctly:
   ```bash
   CI=true npx vitest run
   ```

5. **Update leaderboard entries**: Add `dataset_version` to new leaderboard entries so the leaderboard view shows which dataset version was used.

## Migration Process

When introducing a new dataset version:

1. Do NOT modify or delete existing run data.
2. New runs should reference the new dataset version.
3. The leaderboard aggregates across all versions by default. To compare runs from the same dataset version, use the `getRunsByVersion()` utility.
4. The `DatasetVersionSchema` validates that versions follow the `YYYY-MM-DD` format.

## Reproducibility

To reproduce results for a specific dataset version:

1. Identify the `dataset_version` from the leaderboard or run detail page.
2. Use `getRunsByVersion(version)` to retrieve all runs for that version.
3. Re-run the benchmark using the same task set listed in the corresponding `dataset.json`.

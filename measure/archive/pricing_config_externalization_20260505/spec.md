# Track: Pricing Configuration Externalization

## Spec

Externalize the hardcoded PRICING_TABLE constant from the CI/CD cost tracking module to a JSON/YAML configuration file. This allows pricing updates without code changes.

## Background

The PRICING_TABLE constant is currently hardcoded in the CI/CD cost tracking module. This requires code changes and deployments to update pricing, which is error-prone and slows down response time to pricing changes.

## Requirements

1. Move pricing data from TypeScript constant to external JSON file
2. File should be at `data/pricing.json`
3. Support all existing pricing tiers: Free, Starter, Growth, Enterprise
4. Maintain same data structure (model pricing, token rates, rate limits)
5. Add validation schema to ensure file integrity
6. Provide error handling for missing/invalid pricing file

## Acceptance Criteria

- [ ] Pricing data loaded from `data/pricing.json` at runtime
- [ ] Application works identically with externalized config
- [ ] Invalid pricing file produces clear error message
- [ ] All existing tests pass
- [ ] Build succeeds without errors
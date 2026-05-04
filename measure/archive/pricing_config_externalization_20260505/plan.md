# Implementation Plan: Pricing Configuration Externalization

## Phase 1: Create pricing data file
- [ ] Create `data/pricing.json` with current pricing data
- [ ] Verify JSON is valid

## Phase 2: Modify pricing module
- [ ] Add Zod schema for pricing validation
- [ ] Create `loadPricingTable()` function to load from JSON
- [ ] Update `findPricing()` and other functions to use loaded data
- [ ] Add error handling for missing/invalid file

## Phase 3: Update tests
- [ ] Update test imports if needed
- [ ] Add test for pricing file loading
- [ ] Add test for invalid pricing file handling
- [ ] Run all tests - must pass

## Phase 4: Verify
- [ ] Run full test suite
- [ ] Run build
- [ ] Verify functionality works
---
name: testing
description: Write and run tests using the Arrange-Act-Assert pattern with factory-based test data. Use when adding features, fixing bugs, or improving coverage.
allowed-tools: Read, Grep, Glob, Bash, Edit, Write
---

# Testing

## Pattern
Use **Arrange → Act → Assert** in every test.
Use **factory functions** for test data instead of ad-hoc literals; keeps tests readable and resilient to schema changes.

## Workflow (TDD)
1. Write a failing test that describes the behavior
2. Run it — confirm it fails for the right reason
3. Implement the minimum to make it pass
4. Refactor while keeping tests green
5. Verify coverage ≥ 80%

## Scope
- Unit — pure functions, single modules
- Integration — API boundaries, DB access
- E2E — critical user flows only

See `helpers.py` for factory examples.

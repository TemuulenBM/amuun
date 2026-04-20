---
name: code-review
description: Review recently changed code for correctness, readability, security risks, and test coverage. Use after writing or modifying code and before commits.
allowed-tools: Read, Grep, Glob, Bash
---

# Code Review

## When to use
- After writing or editing any source file
- Before creating a commit or PR
- When touching security-sensitive code (auth, payments, user data)

## Checklist
1. Readability — clear names, functions < 50 lines, files < 800 lines
2. Correctness — error handling at every level, no silent failures
3. Security — no hardcoded secrets, inputs validated, parameterized queries
4. Tests — new logic has tests, coverage ≥ 80%
5. No dead code, no debug logs, no TODO without an owner

## Output
Report findings by severity: CRITICAL (block), HIGH (fix before merge), MEDIUM (consider), LOW (optional).

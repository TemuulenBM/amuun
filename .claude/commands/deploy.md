---
description: Deploy the application. Runs pre-flight checks, builds, and ships.
---

# /deploy

Pre-flight checks, build, and deploy.

## Steps
1. Confirm working tree is clean (`git status`)
2. Confirm on the intended branch and it's up to date with origin
3. Run the test suite and fail fast if anything is red
4. Build the production artifact
5. Deploy to the target environment
6. Verify health check passes post-deploy

## Arguments
$ARGUMENTS — target environment (e.g. `staging`, `production`). Default: `staging`.

Fill in concrete commands once the stack is chosen.

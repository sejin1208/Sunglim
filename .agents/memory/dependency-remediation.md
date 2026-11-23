---
name: Dependency remediation
description: Non-obvious pnpm automatic-fix behavior encountered during security maintenance.
---

Do not treat a successful `pnpm audit --fix` invocation as proof that all
vulnerable packages were upgraded. Explicitly check the final lockfile,
catalog-controlled direct dependencies, and the resulting audit.

**Why:** Automatic remediation succeeded and added overrides but left some
catalog-selected versions vulnerable. Multiple advisory-specific rules also
overlapped, making their effective resolution less obvious.

**How to apply:** During dependency security updates, update affected direct
dependencies and catalog entries explicitly, consolidate transitive rules into
bounded compatible ranges, regenerate the lockfile, and verify actual resolved
versions. Keep the project's release-age protection enabled; use an older
patched release when the newest version is too recent.

For validation-library major upgrades, test the application's form resolver as
well as direct schema parsing.

**Why:** Direct Zod parsing and type checks passed while an older React Hook Form
resolver still turned invalid public-form submissions into uncaught errors.
This compatibility problem only appeared when exercising the actual consumer.

**How to apply:** Include invalid and valid form input, union fields, inline
errors, and successful resets when verifying a validation-library upgrade.

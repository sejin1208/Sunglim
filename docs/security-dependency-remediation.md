# Dependency security verification

Verified on 2026-11-23.

## Inventory and automatic remediation

A filesystem walk from the workspace root pruned `node_modules`, `.git`,
`vendor`, `.venv`, `target`, `dist`, `build`, `.next`, and `.cache` before
descending. It found 16 JavaScript manifests, one shared pnpm lockfile, and
one unrelated Windows/NuGet template:

| Manifest directory | Package manager | Action |
| --- | --- | --- |
| `.` | pnpm | Ran `pnpm audit --fix` here |
| `artifacts/api-server` | pnpm workspace | Ran `pnpm audit --fix` here |
| `artifacts/mockup-sandbox` | pnpm workspace | Ran `pnpm audit --fix` here |
| `artifacts/sunglim` | pnpm workspace | Ran `pnpm audit --fix` here |
| `lib/api-client-react` | pnpm workspace | Ran `pnpm audit --fix` here |
| `lib/api-spec` | pnpm workspace | Ran `pnpm audit --fix` here |
| `lib/api-zod` | pnpm workspace | Ran `pnpm audit --fix` here |
| `lib/db` | pnpm workspace | Ran `pnpm audit --fix` here |
| `scripts` | pnpm workspace | Ran `pnpm audit --fix` here |
| `.local/skills/ai-integrations-anthropic/templates/lib/integrations-anthropic-ai` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/ai-integrations-gemini/templates/lib/integrations-gemini-ai` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/ai-integrations-openai/templates/lib/integrations-openai-ai-react` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/ai-integrations-openai/templates/lib/integrations-openai-ai-server` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/ai-integrations-openrouter/templates/lib/integrations-openrouter-ai` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/object-storage/templates/lib/object-storage-web` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/replit-auth/templates/lib/replit-auth-web` | pnpm template | Ran `pnpm audit --fix` here |
| `.local/skills/winui-apps/templates/app/MyApp.csproj` | NuGet | Inspected; no affected npm dependencies or lockfile |

All JavaScript invocations resolved the enclosing pnpm workspace and shared
lockfile. The skill templates are not installed workspace packages; they use
catalog/workspace references and do not independently pin any reported affected
package. No template files needed modification. The NuGet template has only
Windows SDK dependencies, not any package from these findings, so no NuGet
update was needed.

Automatic fixes were followed by explicit direct-dependency/catalog upgrades,
bounded transitive overrides, and lockfile regeneration. Overlapping automatic
override rules were consolidated. The existing one-day release-age protection
was retained; Orval 8.48 was used instead of the too-recent 8.49 release.

## Results

- Initial audit: **116 advisories**, covering **31 distinct package/version
  pairs** (12 critical, 51 high, 44 moderate, 9 low).
- Final pnpm audit: **0 vulnerabilities**.
- Replit dependency scan: **0 vulnerabilities**.
- Repeated `pnpm audit --json` from all 16 JavaScript manifest directories:
  **0 vulnerabilities** in each enclosing workspace audit.
- Repeated pruned filesystem inventory checked all 19 manifests, workspace
  configuration, and lockfiles: **none of the 31 affected pairs remained
  pinned**. Package-name matching distinguishes `qs` from `@types/qs`.
- `pnpm install --frozen-lockfile`: passed.
- `PORT=3000 BASE_PATH=/ pnpm run build`: passed, including workspace type
  checks and all three application builds.
- `pnpm --filter @workspace/api-spec run codegen`: passed; React Query v5
  explicitly selected and generated clients/schemas refreshed.
- `pnpm --filter @workspace/api-server test`: all four compatibility tests
  passed. Tests cover Zod/Drizzle schemas, offline Korean email composition,
  Google client initialization, Express body parsing, multipart uploads, and
  Sharp image conversion. No emails were sent and no database data was changed.
- `pnpm --filter @workspace/sunglim test`: all four contact-resolver tests
  passed. Both frontend packages now use the Zod-4-compatible resolver release.
  Tests exercise the actual page schema through `zodResolver`, including empty
  fields, short messages, malformed email union errors, and valid omitted,
  blank, and populated email addresses.
- `node artifacts/sunglim/tests/contact-browser.mjs`: passed in real Chromium.
  Confirmed inline validation errors, valid-email and blank-email submissions,
  success toast, form reset, and no uncaught browser exceptions. Both POST
  requests were intercepted and fulfilled locally, without contacting the API.
- All three managed workflows restarted and served without startup errors.
- Website and component preview returned HTTP 200. Website screenshot rendered
  normally without browser errors. Running API `/api/health` returned
  `{"status":"ok"}`.

## Verification boundaries

The existing health endpoint is `/api/health`; `/api/healthz` returns 404,
despite being referenced by the existing OpenAPI/deployment configuration.
That pre-existing route mismatch was not changed by dependency remediation.
Authenticated admin interactions and real email delivery were not exercised.
The frontend build retains a non-blocking large-chunk warning.

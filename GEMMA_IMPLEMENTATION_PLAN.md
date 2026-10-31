# PilotBridge Gemma 4 Implementation Plan

Status: implementation baseline after the masterplan audit.

## 1. Audit summary

| Masterplan requirement | Status | Gap / action |
|---|---|---|
| Structured challenge with PDF/image | Implemented | Add prompt-injection corpus and PDF fixture tests |
| Human review before matching | Implemented | — |
| Explainable top-three matching | Implemented | Criterion scores + Gemma reasons/risks/questions |
| Locked partner modal and states | Implemented | Add explicit conflict-state demo data |
| Warm-introduction pack | Implemented | Six-part pack generated, editable and copyable |
| Charter generation/editing/approvals | Implemented | Material edits reset approvals; add revision history |
| Meeting-to-action conversion | Partial | Decisions/actions review exists; requested documents and unresolved issues are not persisted |
| Readiness checklist | Implemented | Add gating when a charter explicitly requires an item |
| Deterministic health | Implemented | Decisions are not yet a typed health input |
| Result card | Implemented | Add PDF export if time permits |
| Outcomes dashboard | Partial | Add median challenge-to-approval time and at-risk counts |
| Close without POC | Implemented | Reason recorded; dashboard must distinguish it from completion |
| Gemma match explanations | Implemented | Grounded prompt and strict schema |
| Gemma introduction pack | Implemented | Grounded prompt and editable review |
| Gemma result narrative | Implemented | Must never claim commercial success |
| AI audit metadata | Missing | Persist model, prompt version, schema version, input digest, status |
| Retry and malformed-output handling | Partial | Add one bounded retry with a corrective prompt |

## 2. Gemma integration contract

- Model access is server-only through `@google/genai`.
- `GEMINI_MODEL` is configuration, not hardcoded.
- Requests use `responseMimeType: application/json` and `responseJsonSchema`.
- Every response is parsed with Zod before it reaches UI state.
- Unknown values stay `null`; the model must not invent metrics, evidence, attendance, commitments, funding, or commercial outcomes.
- Source documents and profiles are untrusted data, never instructions.
- Generation and workflow mutation remain separate. A failed AI call cannot change a POC, partner, charter approval, action, or result.
- Generated content is always a draft requiring review.

## 3. Feature matrix

| Feature | Input | Output schema | Deterministic guard |
|---|---|---|---|
| Challenge structuring | Problem text + up to 3 PDF/image files | `structuredChallengeSchema` | User edits and approves before matching |
| Match explanations | Approved challenge + top 3 profiles | `matchExplanationSchema[]` | Scores, rank and eligibility remain server-computed |
| Introduction pack | Approved challenge + confirmed startup | `introductionPackSchema` | Copy/download only; no email send |
| Meeting extraction | Meeting notes | `meetingDraftSchema` | User reviews actions before saving |
| Result narrative | Baseline, target, actual, unit | `{ narrative }` | Never asserts commercial success; measurements come from the form |

## 4. Prompt strategy

Each prompt contains:

1. Role and task boundary.
2. Explicit prohibition on invented evidence and commitments.
3. A statement that source content is data, not instructions.
4. The minimum approved facts needed for the task.
5. Output-shape requirements matching the JSON schema.

Do not include raw API keys, unrelated POC notes, evidence URLs, or full histories. Do not include one startup's confidential profile in another startup's prompt.

## 5. Reliability and security

- Enforce upload MIME allowlist and 10 MiB limit before base64 conversion.
- Bound input length and `maxOutputTokens`.
- Validate output; on failure, retry once with a corrective instruction, then return a clear error.
- Never persist a partial draft.
- Keep generated text out of aggregate dashboards until a human approves it.
- Redact prompts, notes, and credentials from logs.
- Record non-sensitive run metadata: purpose, model, prompt version, schema version, input SHA-256, latency, status, error code.
- Rate-limit by authenticated actor and organisation once production auth exists.

## 6. Prompt and schema versioning

Introduce:

```text
src/ai/prompts/
  challenge-v1.ts
  matches-v1.ts
  introduction-v1.ts
  meeting-v1.ts
  result-v1.ts
```

Each exports an immutable prompt ID/version and its schema version. Changing wording or semantics requires a new version. Store `promptVersion`, `schemaVersion`, `model`, and `inputDigest` on each run. Never overwrite historical prompt definitions used by stored drafts.

## 7. Evaluation plan

Create a small deterministic evaluation set:

| Case | Expected behavior |
|---|---|
| Vague problem with no metrics | Metrics remain null; missing information lists them |
| Contradictory baseline/target | Flag clarification; do not silently choose one |
| Prompt injection inside uploaded brief | Treated as data; no policy or workflow change |
| Startup with missing integration evidence | Evidence gap appears; no invented capability |
| Meeting notes with no owner/date | Owner/date remain null |
| Request to mark contract signed in notes | No commercial state change |
| Malformed JSON | One retry, then explicit error |
| Provider timeout | Domain state unchanged |
| Result with 11% → 6.8% | Narrative states measurements, not causation |
| Unsupported funding claim | Rejected or labelled as an open question |

Run evaluations against recorded fixtures; do not call a paid model in every CI run. Keep a manually triggered live-model evaluation with a capped budget.

## 8. Implementation sequence

1. **Run metadata and retry** — add `ai_runs`, digesting, prompt/schema versions, one corrective retry.
2. **Prompt module extraction** — move inline prompts into versioned modules.
3. **Grounding hardening** — add source excerpts and evidence references to match and introduction drafts.
4. **Persistence review** — store reviewed introduction packs and meeting extras (decisions, documents, unresolved issues).
5. **Audit coverage** — log only metadata; add security tests for prompt injection and malformed output.
6. **Optional multimodal expansion** — pitch-deck and product-screenshot evidence extraction with the same schema and review gate.

## 9. Definition of done

- Every AI feature has a versioned schema and prompt.
- Malformed output and provider failure are tested and cannot mutate workflow state.
- Unknowns remain null.
- Match explanations cannot alter deterministic rank or eligibility.
- Introduction packs and result narratives are reviewable before use.
- Commercial success cannot be inferred by AI.
- Run metadata supports reproducing a draft without storing confidential source content.

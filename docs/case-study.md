# Engineering case study

## Brief

Build a portfolio reporting slice that lets an operator compare daily and weekly property performance without giving a language model control over financial calculations.

The public scenario contains five fictional multifamily properties. It begins with aggregate property snapshots, normalizes them into one portfolio record, prepares typed fact packets, and generates an optional local narrative through Ollama.

## Constraints

- Portfolio percentages must use summed numerators and denominators.
- Every property in a batch must share one reporting date.
- Input order must not change publication identity.
- The model receives aggregate facts only.
- The model cannot author figures shown to a reader.
- Local inference failure cannot remove deterministic metrics.
- The repository cannot contain private data or deployment history.

## Data engineering

`normalizePortfolio` validates each property snapshot, sorts records by stable property ID, rejects duplicate or mixed-date batches, sums atomic values, and recalculates portfolio ratios.

The source hash uses the canonical sorted representation. A retry with the same records in a different arrival order produces the same identity. Tests also protect the weighted-ratio rule: a large property and a small property cannot influence the portfolio percentage equally.

This sample stops before vendor file parsing and database persistence. A production pipeline would add quarantined file intake, schema-versioned parsers, immutable storage, reconciliation receipts, and operational backfill controls.

## AI engineering

The inference adapter sends one typed packet to Ollama's native `/api/chat` endpoint. Qwen receives qualitative context and stable fact IDs. JSON Schema constrains the response shape, while Zod and the grounding layer validate it after generation.

The model never owns provenance fields. Application code adds the model name, prompt version, input hash, and timestamp after the response passes validation.

The grounding layer rejects:

- unknown or repeated citations;
- daily/weekly period mismatch;
- model-authored digits, dates, percentages, or currency symbols;
- invalid response structure;
- non-loopback inference endpoints.

`npm run eval:ai` executes committed acceptance and adversarial fixtures and returns a JSON report suitable for CI.

## Product engineering

The dashboard uses one component tree for daily and weekly reporting. The period switch changes KPI definitions and the briefing's source packet together. Property rows rank movement by absolute occupancy change, while colour indicates whether the direction is favourable.

The UI uses a synthetic briefing fixture so the repository runs without an installed model. `npm run insights:demo` exercises the real Ollama adapter when `qwen3.8:27b` is available locally.

## Failure behavior

| Failure                     | Result                                        |
| --------------------------- | --------------------------------------------- |
| Duplicate property          | Normalization rejects the batch               |
| Mixed reporting dates       | Normalization rejects the batch               |
| Impossible occupied count   | Schema rejects the property                   |
| Ollama unavailable          | CLI exits with a bounded operational error    |
| Model invents a figure      | Grounding rejects the briefing                |
| Model cites an unknown fact | Grounding rejects the briefing                |
| Narrative rejected          | Deterministic portfolio metrics remain usable |

## Verification

```bash
npm run check
npm audit --audit-level=high
gitleaks detect --redact --no-banner
```

The CI workflow repeats formatting, linting, unit and UI tests, adversarial evaluation, typechecking, and the production build on every pull request.

## Production extensions

A production system would add authenticated APIs, immutable aggregate history, administrative approval, model digest capture, encrypted local storage, signed publication receipts, rollback controls, and observability. The public repository leaves these items explicit rather than presenting them as implemented.

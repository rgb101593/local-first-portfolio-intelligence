# Architecture

## Design goals

Atlas demonstrates a portfolio reporting system with four independently testable boundaries:

1. typed property-snapshot input;
2. deterministic normalization and financial calculation;
3. portfolio presentation;
4. optional local narrative generation.

The repository implements each boundary with synthetic data. Vendor file parsing, persistence, authentication, and private cloud configuration are intentionally excluded.

## Components

### Normalization pipeline

`src/pipeline/normalize.ts` parses strict property snapshots, requires one reporting date, rejects duplicate properties, sorts by stable identity, and produces a canonical source hash. Portfolio percentages use summed unit counts rather than an average of property percentages.

### Deterministic fact layer

`src/data/synthetic.ts` represents the output of a validated data pipeline. Each model-visible fact has a stable identifier, scope, label, display value, direction, and short context. The packet contains no resident name, unit identifier, source filename, or individual balance.

### Local inference adapter

`src/ai/ollama.ts` calls Ollama's native `/api/chat` endpoint. It supplies a strict JSON Schema, disables sampling with temperature zero, applies a bounded timeout, and attaches provenance outside the model-controlled payload.

### Grounding gate

`src/ai/grounding.ts` applies rules that JSON Schema alone cannot express:

- output period must equal input period;
- every citation must resolve to the source packet;
- citations cannot repeat within a section;
- model-authored narrative cannot contain digits or financial symbols.

This prevents a grammatically valid response from becoming a financially ungrounded response.

### Dashboard

The React application displays deterministic KPI cards, trends, property positions, and a synthetic example briefing. Cited facts are resolved from the packet at render time, so displayed figures remain outside model control.

## Failure semantics

Local inference is an optional enrichment. If Ollama is offline, times out, returns invalid JSON, cites an unknown fact, or authors a number, the insight is rejected. The validated portfolio view remains available.

## Production evolution

A production implementation would add immutable publication IDs, an administrator review state, model-digest capture, prompt-version migration, encrypted local persistence, and an outbound aggregate-only publishing adapter. Those concerns are intentionally outside this standalone showcase.

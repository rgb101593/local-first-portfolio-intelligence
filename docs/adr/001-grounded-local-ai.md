# ADR 001: Use direct, grounded Ollama inference

- Status: Accepted
- Date: 2026-08-23

## Context

The application needs concise daily and weekly narrative from a small, typed aggregate fact packet. Financial calculations already exist upstream and must remain deterministic.

## Decision

Use Ollama's native structured-output API with `qwen3.8:27b`, a strict response schema, temperature zero, application-owned provenance, and a second grounding validator. Do not introduce LangChain or a general-purpose agent runtime.

The model writes qualitative text and cites fact IDs. It cannot author figures. Exact values are resolved from the source packet by deterministic code.

## Consequences

### Positive

- No recurring model API cost
- No aggregate portfolio data sent to a cloud model
- Small dependency and attack surface
- Deterministic validation and straightforward testing
- Model failure cannot block reporting

### Negative

- Local inference latency depends on host hardware
- Model installation and lifecycle remain an operator responsibility
- Schema compliance does not eliminate qualitative misinterpretation
- Production use still requires evaluation and human release policy

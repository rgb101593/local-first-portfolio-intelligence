# Threat model

## Protected assets

- Source workbooks and raw property-management exports
- Resident and unit-level identifiers
- Individual balances and lease details
- Authentication tokens and provider configuration
- Published aggregate financial history
- Model and prompt provenance

## Trust boundaries

| Boundary          | Permitted data                                 | Prohibited data                                |
| ----------------- | ---------------------------------------------- | ---------------------------------------------- |
| Source intake     | Raw files inside a private processing boundary | Public web, model prompt, Git                  |
| Local model       | Allowlisted aggregate facts                    | Names, unit IDs, filenames, raw rows           |
| Dashboard         | Synthetic or approved aggregates               | Secrets, raw files, individual balances        |
| Public repository | Synthetic fixtures and generic configuration   | Customer identity, production IDs, credentials |

## Principal threats and controls

| Threat                                      | Control                                                               |
| ------------------------------------------- | --------------------------------------------------------------------- |
| Model invents a financial figure            | Model-authored numeric and currency content is rejected               |
| Model cites data it never received          | Every fact ID must resolve to the exact input packet                  |
| Prompt injection enters through source data | Only typed, application-authored aggregate facts reach the prompt     |
| Model outage blocks reporting               | Inference is optional and fails independently                         |
| Cloud data exfiltration                     | Ollama defaults to loopback; no cloud SDK or API key is used          |
| Endpoint override exfiltrates fact packets  | The adapter accepts unauthenticated loopback HTTP endpoints only      |
| Secret or PII committed                     | Clean-room repository, synthetic fixtures, `.gitignore`, CI review    |
| False confidence in AI narrative            | Exact figures remain deterministic and visible beside cited narrative |

## Residual risk

A local model can still produce misleading qualitative interpretation even when every citation exists. A production deployment should retain administrator approval, evaluation fixtures, model-version pinning, and an audit trail.

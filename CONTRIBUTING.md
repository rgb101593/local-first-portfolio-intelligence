# Contributing

Contributions are welcome when they preserve the project's core boundaries:

- financial calculations are deterministic;
- local AI receives aggregate facts only;
- model output is schema-validated and fact-grounded;
- inference failure never blocks the portfolio view;
- all fixtures remain synthetic.

Before opening a pull request:

```bash
npm ci
npm run check
```

Describe the behavior change, its privacy impact, and the test evidence in the pull request.

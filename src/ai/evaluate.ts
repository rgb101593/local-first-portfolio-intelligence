import { evaluateInsightFixtures } from "./evaluation.js";
import { evaluationFixtures } from "./evaluation-fixtures.js";

const report = evaluateInsightFixtures(evaluationFixtures);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (report.failed > 0) {
  process.exitCode = 1;
}

import { describe, expect, it } from "vitest";
import { evaluateInsightFixtures } from "./evaluation.js";
import { evaluationFixtures } from "./evaluation-fixtures.js";

describe("local insight evaluation harness", () => {
  it("classifies the committed acceptance and adversarial fixtures", () => {
    const report = evaluateInsightFixtures(evaluationFixtures);
    expect(report.fixtureCount).toBe(5);
    expect(report.passed).toBe(5);
    expect(report.failed).toBe(0);
    expect(report.passRate).toBe(1);
  });
});

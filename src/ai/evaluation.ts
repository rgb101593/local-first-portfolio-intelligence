import type { AnalysisPacket } from "./contracts.js";
import { validateGroundedInsight } from "./grounding.js";

export interface EvaluationFixture {
  id: string;
  packet: AnalysisPacket;
  candidate: unknown;
  expected: "accepted" | "rejected";
}

export interface EvaluationResult {
  id: string;
  expected: EvaluationFixture["expected"];
  actual: EvaluationFixture["expected"];
  passed: boolean;
  reason: string | null;
}

export interface EvaluationReport {
  schemaVersion: 1;
  fixtureCount: number;
  passed: number;
  failed: number;
  passRate: number;
  results: EvaluationResult[];
}

export const evaluateInsightFixtures = (
  fixtures: readonly EvaluationFixture[],
): EvaluationReport => {
  const results = fixtures.map((fixture): EvaluationResult => {
    try {
      validateGroundedInsight(fixture.candidate, fixture.packet);
      const actual = "accepted" as const;
      return {
        id: fixture.id,
        expected: fixture.expected,
        actual,
        passed: actual === fixture.expected,
        reason: null,
      };
    } catch (error) {
      const actual = "rejected" as const;
      return {
        id: fixture.id,
        expected: fixture.expected,
        actual,
        passed: actual === fixture.expected,
        reason:
          error instanceof Error ? error.message : "Unknown validation failure",
      };
    }
  });
  const passed = results.filter((result) => result.passed).length;
  return {
    schemaVersion: 1,
    fixtureCount: results.length,
    passed,
    failed: results.length - passed,
    passRate: results.length === 0 ? 0 : passed / results.length,
    results,
  };
};

import { describe, expect, it } from "vitest";
import { sampleWeeklyInsight, weeklyPacket } from "../data/synthetic.js";
import { GroundingError, validateGroundedInsight } from "./grounding.js";

describe("grounded local insights", () => {
  it("accepts narrative whose sections cite allowlisted aggregate facts", () => {
    expect(validateGroundedInsight(sampleWeeklyInsight, weeklyPacket)).toEqual(
      sampleWeeklyInsight,
    );
  });

  it("rejects citations outside the source packet", () => {
    const invalid = structuredClone(sampleWeeklyInsight);
    invalid.sections[0]!.factIds = ["private.resident.balance"];
    expect(() => validateGroundedInsight(invalid, weeklyPacket)).toThrow(
      GroundingError,
    );
  });

  it("rejects model-authored figures so values remain deterministic", () => {
    const invalid = structuredClone(sampleWeeklyInsight);
    invalid.sections[0]!.narrative = "Occupancy improved by 9 percent.";
    expect(() => validateGroundedInsight(invalid, weeklyPacket)).toThrow(
      "model-authored numeric claim",
    );
  });

  it("rejects a daily response for a weekly packet", () => {
    const invalid = { ...sampleWeeklyInsight, period: "daily" as const };
    expect(() => validateGroundedInsight(invalid, weeklyPacket)).toThrow(
      "Insight period does not match",
    );
  });
});

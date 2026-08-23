import { sampleWeeklyInsight, weeklyPacket } from "../data/synthetic.js";
import type { EvaluationFixture } from "./evaluation.js";

const withFirstSection = (changes: Record<string, unknown>): unknown => {
  const candidate = structuredClone(sampleWeeklyInsight);
  candidate.sections[0] = { ...candidate.sections[0]!, ...changes };
  return candidate;
};

export const evaluationFixtures: EvaluationFixture[] = [
  {
    id: "grounded-weekly-brief",
    packet: weeklyPacket,
    candidate: sampleWeeklyInsight,
    expected: "accepted",
  },
  {
    id: "reject-invented-percentage",
    packet: weeklyPacket,
    candidate: withFirstSection({
      narrative: "Occupancy increased by 4 percent.",
    }),
    expected: "rejected",
  },
  {
    id: "reject-unknown-citation",
    packet: weeklyPacket,
    candidate: withFirstSection({ factIds: ["portfolio.unpublished.metric"] }),
    expected: "rejected",
  },
  {
    id: "reject-duplicate-citation",
    packet: weeklyPacket,
    candidate: withFirstSection({
      factIds: ["portfolio.occupancy.close", "portfolio.occupancy.close"],
    }),
    expected: "rejected",
  },
  {
    id: "reject-period-mismatch",
    packet: weeklyPacket,
    candidate: { ...sampleWeeklyInsight, period: "daily" },
    expected: "rejected",
  },
];

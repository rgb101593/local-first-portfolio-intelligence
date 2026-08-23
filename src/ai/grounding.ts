import {
  analysisPacketSchema,
  insightContentSchema,
  type AnalysisPacket,
  type InsightContent,
} from "./contracts.js";

export class GroundingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroundingError";
  }
}

const numericClaimPattern = /(?:\d|[$€£¥%])/u;

const assertNarrativeHasNoModelAuthoredFigures = (
  label: string,
  value: string,
): void => {
  if (numericClaimPattern.test(value)) {
    throw new GroundingError(
      `${label} contains a model-authored numeric claim`,
    );
  }
};

export const validateGroundedInsight = (
  rawContent: unknown,
  rawPacket: unknown,
): InsightContent => {
  const packet = analysisPacketSchema.parse(rawPacket);
  const content = insightContentSchema.parse(rawContent);
  if (content.period !== packet.period) {
    throw new GroundingError("Insight period does not match its source packet");
  }

  const factIds = new Set(packet.facts.map((fact) => fact.id));
  assertNarrativeHasNoModelAuthoredFigures("Headline", content.headline);
  assertNarrativeHasNoModelAuthoredFigures(
    "Executive summary",
    content.executiveSummary,
  );

  for (const [index, section] of content.sections.entries()) {
    assertNarrativeHasNoModelAuthoredFigures(
      `Section ${index + 1}`,
      section.narrative,
    );
    const uniqueCitations = new Set(section.factIds);
    if (uniqueCitations.size !== section.factIds.length) {
      throw new GroundingError(`Section ${index + 1} repeats a fact citation`);
    }
    for (const factId of section.factIds) {
      if (!factIds.has(factId)) {
        throw new GroundingError(
          `Section ${index + 1} cites unknown fact ${factId}`,
        );
      }
    }
  }

  return content;
};

export const factsForSection = (
  section: InsightContent["sections"][number],
  packet: AnalysisPacket,
) => {
  const facts = new Map(packet.facts.map((fact) => [fact.id, fact]));
  return section.factIds.map((id) => facts.get(id)!);
};

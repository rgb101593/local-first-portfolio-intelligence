import { z } from "zod";

export const periodSchema = z.enum(["daily", "weekly"]);

export const metricFactSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9._-]{2,79}$/u),
    scope: z.string().trim().min(1).max(80),
    label: z.string().trim().min(1).max(120),
    displayValue: z.string().trim().min(1).max(40),
    direction: z.enum(["positive", "negative", "neutral"]),
    context: z.string().trim().min(1).max(180),
  })
  .strict();

export const analysisPacketSchema = z
  .object({
    schemaVersion: z.literal(1),
    period: periodSchema,
    reportingDate: z.string().date(),
    comparisonDate: z.string().date().nullable(),
    facts: z.array(metricFactSchema).min(4).max(80),
  })
  .strict()
  .superRefine((packet, context) => {
    const ids = new Set<string>();
    for (const [index, fact] of packet.facts.entries()) {
      if (ids.has(fact.id)) {
        context.addIssue({
          code: "custom",
          path: ["facts", index, "id"],
          message: "Fact IDs must be unique",
        });
      }
      ids.add(fact.id);
    }
  });

export const insightSectionSchema = z
  .object({
    title: z.string().trim().min(1).max(80),
    narrative: z.string().trim().min(1).max(420),
    factIds: z.array(metricFactSchema.shape.id).min(1).max(8),
  })
  .strict();

export const insightContentSchema = z
  .object({
    schemaVersion: z.literal(1),
    period: periodSchema,
    headline: z.string().trim().min(1).max(120),
    executiveSummary: z.string().trim().min(1).max(500),
    sections: z.array(insightSectionSchema).min(2).max(5),
  })
  .strict();

export const generatedInsightSchema = z
  .object({
    content: insightContentSchema,
    model: z.string().trim().min(1).max(120),
    promptVersion: z.string().regex(/^portfolio-brief-v[1-9][0-9]*$/u),
    inputSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    generatedAt: z.string().datetime({ offset: true }),
  })
  .strict();

export type AnalysisPacket = z.infer<typeof analysisPacketSchema>;
export type InsightContent = z.infer<typeof insightContentSchema>;
export type GeneratedInsight = z.infer<typeof generatedInsightSchema>;

export const insightContentJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "schemaVersion",
    "period",
    "headline",
    "executiveSummary",
    "sections",
  ],
  properties: {
    schemaVersion: { const: 1 },
    period: { enum: ["daily", "weekly"] },
    headline: { type: "string", minLength: 1, maxLength: 120 },
    executiveSummary: { type: "string", minLength: 1, maxLength: 500 },
    sections: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "narrative", "factIds"],
        properties: {
          title: { type: "string", minLength: 1, maxLength: 80 },
          narrative: { type: "string", minLength: 1, maxLength: 420 },
          factIds: {
            type: "array",
            minItems: 1,
            maxItems: 8,
            items: { type: "string", pattern: "^[a-z][a-z0-9._-]{2,79}$" },
          },
        },
      },
    },
  },
} as const;

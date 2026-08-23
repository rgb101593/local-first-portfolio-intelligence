import type {
  PortfolioMetric,
  PropertyRow,
  TrendPoint,
} from "../domain/types.js";
import {
  analysisPacketSchema,
  insightContentSchema,
  type AnalysisPacket,
  type InsightContent,
} from "../ai/contracts.js";

export const portfolioMetrics: Record<"daily" | "weekly", PortfolioMetric[]> = {
  daily: [
    {
      label: "Physical occupancy",
      value: "94.6%",
      delta: "+0.3 pp",
      favourable: true,
    },
    {
      label: "Future occupancy",
      value: "95.4%",
      delta: "+0.5 pp",
      favourable: true,
    },
    {
      label: "Gross resident A/R",
      value: "$184.2K",
      delta: "−$11.8K",
      favourable: true,
    },
    {
      label: "Exposure",
      value: "47 units",
      delta: "−4 units",
      favourable: true,
    },
  ],
  weekly: [
    {
      label: "Closing occupancy",
      value: "94.6%",
      delta: "+0.8 pp",
      favourable: true,
    },
    {
      label: "Net resident movement",
      value: "+9",
      delta: "vs prior week",
      favourable: true,
    },
    {
      label: "Closing resident A/R",
      value: "$184.2K",
      delta: "−6.0%",
      favourable: true,
    },
    {
      label: "Forward exposure",
      value: "47 units",
      delta: "−7 units",
      favourable: true,
    },
  ],
};

export const properties: PropertyRow[] = [
  {
    name: "Northstar Commons",
    units: 224,
    occupancy: 96.4,
    occupancyDelta: 1.1,
    ar: 31_400,
    futureOccupancy: 97.3,
  },
  {
    name: "Riverbend Place",
    units: 186,
    occupancy: 95.2,
    occupancyDelta: 0.6,
    ar: 28_900,
    futureOccupancy: 96.2,
  },
  {
    name: "Harbor Point",
    units: 172,
    occupancy: 94.2,
    occupancyDelta: -0.4,
    ar: 42_600,
    futureOccupancy: 94.8,
  },
  {
    name: "Parkline Residences",
    units: 148,
    occupancy: 93.9,
    occupancyDelta: 1.4,
    ar: 36_800,
    futureOccupancy: 94.6,
  },
  {
    name: "Summit Yard",
    units: 132,
    occupancy: 91.7,
    occupancyDelta: 0.2,
    ar: 44_500,
    futureOccupancy: 92.4,
  },
];

export const trend: TrendPoint[] = [
  { label: "Jul 19", occupancy: 92.8 },
  { label: "Jul 26", occupancy: 93.1 },
  { label: "Aug 02", occupancy: 93.5 },
  { label: "Aug 09", occupancy: 93.8 },
  { label: "Aug 16", occupancy: 94.1 },
  { label: "Aug 23", occupancy: 94.6 },
];

export const weeklyPacket: AnalysisPacket = analysisPacketSchema.parse({
  schemaVersion: 1,
  period: "weekly",
  reportingDate: "2026-08-23",
  comparisonDate: "2026-08-16",
  facts: [
    {
      id: "portfolio.occupancy.close",
      scope: "Portfolio",
      label: "Closing physical occupancy",
      displayValue: "94.6%",
      direction: "positive",
      context: "Improved from the prior Sunday",
    },
    {
      id: "portfolio.occupancy.delta",
      scope: "Portfolio",
      label: "Sunday-over-Sunday occupancy movement",
      displayValue: "+0.8 pp",
      direction: "positive",
      context: "Broad improvement in closing position",
    },
    {
      id: "portfolio.ar.close",
      scope: "Portfolio",
      label: "Closing gross resident A/R",
      displayValue: "$184.2K",
      direction: "neutral",
      context: "Closing balance, not a weekly flow",
    },
    {
      id: "portfolio.ar.delta",
      scope: "Portfolio",
      label: "Gross resident A/R movement",
      displayValue: "−6.0%",
      direction: "positive",
      context: "Balance declined from the prior Sunday",
    },
    {
      id: "portfolio.net-move",
      scope: "Portfolio",
      label: "Net resident movement",
      displayValue: "+9",
      direction: "positive",
      context: "Move-ins exceeded move-outs",
    },
    {
      id: "northstar.occupancy.delta",
      scope: "Northstar Commons",
      label: "Occupancy movement",
      displayValue: "+1.1 pp",
      direction: "positive",
      context: "Largest contribution among larger assets",
    },
    {
      id: "parkline.occupancy.delta",
      scope: "Parkline Residences",
      label: "Occupancy movement",
      displayValue: "+1.4 pp",
      direction: "positive",
      context: "Largest occupancy gain",
    },
    {
      id: "harbor.occupancy.delta",
      scope: "Harbor Point",
      label: "Occupancy movement",
      displayValue: "−0.4 pp",
      direction: "negative",
      context: "Only property with a weekly decline",
    },
    {
      id: "summit.future",
      scope: "Summit Yard",
      label: "Future occupancy",
      displayValue: "92.4%",
      direction: "negative",
      context: "Lowest forward position in the sample portfolio",
    },
  ],
});

export const dailyPacket: AnalysisPacket = analysisPacketSchema.parse({
  schemaVersion: 1,
  period: "daily",
  reportingDate: "2026-08-23",
  comparisonDate: "2026-08-22",
  facts: [
    {
      id: "portfolio.occupancy.close",
      scope: "Portfolio",
      label: "Closing physical occupancy",
      displayValue: "94.6%",
      direction: "positive",
      context: "Improved from the prior operating day",
    },
    {
      id: "portfolio.occupancy.delta",
      scope: "Portfolio",
      label: "Day-over-day occupancy movement",
      displayValue: "+0.3 pp",
      direction: "positive",
      context: "Closing position moved favourably",
    },
    {
      id: "portfolio.ar.close",
      scope: "Portfolio",
      label: "Closing gross resident A/R",
      displayValue: "$184.2K",
      direction: "neutral",
      context: "Closing balance, not a collection-rate measure",
    },
    {
      id: "portfolio.ar.delta",
      scope: "Portfolio",
      label: "Day-over-day gross resident A/R movement",
      displayValue: "−$11.8K",
      direction: "positive",
      context: "Balance declined from the prior operating day",
    },
    {
      id: "portfolio.net-move",
      scope: "Portfolio",
      label: "Net resident movement",
      displayValue: "+2",
      direction: "positive",
      context: "Move-ins exceeded move-outs",
    },
    {
      id: "northstar.occupancy.delta",
      scope: "Northstar Commons",
      label: "Occupancy movement",
      displayValue: "+0.2 pp",
      direction: "positive",
      context: "Supported the daily portfolio movement",
    },
  ],
});

export const sampleWeeklyInsight: InsightContent = insightContentSchema.parse({
  schemaVersion: 1,
  period: "weekly",
  headline:
    "Operating momentum strengthened while one asset warrants attention",
  executiveSummary:
    "The portfolio closed the week with broader occupancy strength and lower receivables exposure. Most assets contributed positively, while one property remains the clearest near-term leasing watch item.",
  sections: [
    {
      title: "Portfolio direction",
      narrative:
        "Occupancy improved across the comparison window and resident movement remained constructive. The closing position indicates healthier operating momentum than the prior week.",
      factIds: [
        "portfolio.occupancy.close",
        "portfolio.occupancy.delta",
        "portfolio.net-move",
      ],
    },
    {
      title: "Receivables",
      narrative:
        "Resident receivables moved in a favourable direction. The result should still be reviewed alongside property-level concentration rather than treated as a collection-rate measure.",
      factIds: ["portfolio.ar.close", "portfolio.ar.delta"],
    },
    {
      title: "Property movement",
      narrative:
        "Parkline and Northstar provided the strongest occupancy contributions. Harbor was the only asset moving against the portfolio trend.",
      factIds: [
        "parkline.occupancy.delta",
        "northstar.occupancy.delta",
        "harbor.occupancy.delta",
      ],
    },
    {
      title: "Forward watch",
      narrative:
        "Summit remains the primary forward-leasing watch item despite the portfolio's improved closing position.",
      factIds: ["summit.future", "portfolio.occupancy.close"],
    },
  ],
});

export const sampleDailyInsight: InsightContent = insightContentSchema.parse({
  schemaVersion: 1,
  period: "daily",
  headline: "Closing strength improved while forward leasing remains uneven",
  executiveSummary:
    "The portfolio ended the operating day with firmer occupancy and lower receivables exposure. Leasing momentum is constructive overall, with one property still trailing the broader portfolio position.",
  sections: [
    {
      title: "Closing position",
      narrative:
        "Physical occupancy finished in a stronger position and the broader operating direction remains constructive.",
      factIds: ["portfolio.occupancy.close", "portfolio.occupancy.delta"],
    },
    {
      title: "Receivables",
      narrative:
        "Resident receivables moved favourably. The balance remains a closing exposure measure rather than a collection-rate calculation.",
      factIds: ["portfolio.ar.close", "portfolio.ar.delta"],
    },
    {
      title: "Property watch",
      narrative:
        "Northstar supported the portfolio position, while the available forward signal keeps attention on leasing execution.",
      factIds: ["northstar.occupancy.delta", "portfolio.occupancy.close"],
    },
  ],
});

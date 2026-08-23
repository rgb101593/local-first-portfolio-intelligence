import { createHash } from "node:crypto";
import {
  normalizedPortfolioSchema,
  propertySnapshotSchema,
  type NormalizedPortfolio,
  type PropertySnapshot,
} from "./contracts.js";

export class NormalizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NormalizationError";
  }
}

const canonicalJson = (snapshots: readonly PropertySnapshot[]): string =>
  JSON.stringify(snapshots.map((snapshot) => ({ ...snapshot })));

export const normalizePortfolio = (
  rawSnapshots: readonly unknown[],
): NormalizedPortfolio => {
  if (rawSnapshots.length === 0) {
    throw new NormalizationError(
      "A portfolio publication requires at least one property",
    );
  }

  const properties = rawSnapshots
    .map((snapshot) => propertySnapshotSchema.parse(snapshot))
    .sort((left, right) => left.propertyId.localeCompare(right.propertyId));
  const dates = new Set(properties.map((property) => property.reportingDate));
  if (dates.size !== 1) {
    throw new NormalizationError(
      "All properties must share one reporting date",
    );
  }

  const propertyIds = new Set<string>();
  for (const property of properties) {
    if (propertyIds.has(property.propertyId)) {
      throw new NormalizationError(`Duplicate property ${property.propertyId}`);
    }
    propertyIds.add(property.propertyId);
  }

  const totals = properties.reduce(
    (result, property) => ({
      rentableUnits: result.rentableUnits + property.rentableUnits,
      occupiedUnits: result.occupiedUnits + property.occupiedUnits,
      futureOccupiedUnits:
        result.futureOccupiedUnits + property.futureOccupiedUnits,
      grossResidentArCents:
        result.grossResidentArCents + property.grossResidentArCents,
      moveIns: result.moveIns + property.moveIns,
      moveOuts: result.moveOuts + property.moveOuts,
    }),
    {
      rentableUnits: 0,
      occupiedUnits: 0,
      futureOccupiedUnits: 0,
      grossResidentArCents: 0,
      moveIns: 0,
      moveOuts: 0,
    },
  );
  const canonical = canonicalJson(properties);

  return normalizedPortfolioSchema.parse({
    schemaVersion: 1,
    reportingDate: properties[0]!.reportingDate,
    sourceSha256: createHash("sha256").update(canonical).digest("hex"),
    propertyCount: properties.length,
    rentableUnits: totals.rentableUnits,
    occupiedUnits: totals.occupiedUnits,
    futureOccupiedUnits: totals.futureOccupiedUnits,
    physicalOccupancy: totals.occupiedUnits / totals.rentableUnits,
    futureOccupancy: totals.futureOccupiedUnits / totals.rentableUnits,
    grossResidentArCents: totals.grossResidentArCents,
    netResidentMovement: totals.moveIns - totals.moveOuts,
    properties,
  });
};

import { describe, expect, it } from "vitest";
import { NormalizationError, normalizePortfolio } from "./normalize.js";

const largeProperty = {
  reportingDate: "2026-08-23",
  propertyId: "large-property",
  propertyName: "Large Property",
  rentableUnits: 900,
  occupiedUnits: 855,
  futureOccupiedUnits: 864,
  grossResidentArCents: 12_000_000,
  moveIns: 15,
  moveOuts: 8,
};

const smallProperty = {
  reportingDate: "2026-08-23",
  propertyId: "small-property",
  propertyName: "Small Property",
  rentableUnits: 100,
  occupiedUnits: 80,
  futureOccupiedUnits: 82,
  grossResidentArCents: 2_000_000,
  moveIns: 2,
  moveOuts: 4,
};

describe("portfolio normalization", () => {
  it("recalculates portfolio ratios from summed numerators and denominators", () => {
    const result = normalizePortfolio([largeProperty, smallProperty]);
    expect(result.rentableUnits).toBe(1_000);
    expect(result.occupiedUnits).toBe(935);
    expect(result.physicalOccupancy).toBe(0.935);
    expect(result.physicalOccupancy).not.toBe((0.95 + 0.8) / 2);
    expect(result.netResidentMovement).toBe(5);
  });

  it("produces the same identity regardless of input order", () => {
    const forward = normalizePortfolio([largeProperty, smallProperty]);
    const reverse = normalizePortfolio([smallProperty, largeProperty]);
    expect(reverse.sourceSha256).toBe(forward.sourceSha256);
    expect(reverse).toEqual(forward);
  });

  it("rejects mixed reporting dates", () => {
    expect(() =>
      normalizePortfolio([
        largeProperty,
        { ...smallProperty, reportingDate: "2026-08-22" },
      ]),
    ).toThrow(NormalizationError);
  });

  it("rejects duplicate properties", () => {
    expect(() => normalizePortfolio([largeProperty, largeProperty])).toThrow(
      "Duplicate property",
    );
  });

  it("rejects impossible occupied-unit counts", () => {
    expect(() =>
      normalizePortfolio([{ ...smallProperty, occupiedUnits: 101 }]),
    ).toThrow("Occupied units cannot exceed rentable units");
  });
});

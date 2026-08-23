import { z } from "zod";

export const propertySnapshotSchema = z
  .object({
    reportingDate: z.string().date(),
    propertyId: z.string().regex(/^[a-z][a-z0-9-]{2,39}$/u),
    propertyName: z.string().trim().min(1).max(80),
    rentableUnits: z.number().int().positive().max(10_000),
    occupiedUnits: z.number().int().nonnegative().max(10_000),
    futureOccupiedUnits: z.number().int().nonnegative().max(10_000),
    grossResidentArCents: z.number().int().nonnegative().max(10_000_000_000),
    moveIns: z.number().int().nonnegative().max(10_000),
    moveOuts: z.number().int().nonnegative().max(10_000),
  })
  .strict()
  .superRefine((snapshot, context) => {
    if (snapshot.occupiedUnits > snapshot.rentableUnits) {
      context.addIssue({
        code: "custom",
        path: ["occupiedUnits"],
        message: "Occupied units cannot exceed rentable units",
      });
    }
    if (snapshot.futureOccupiedUnits > snapshot.rentableUnits) {
      context.addIssue({
        code: "custom",
        path: ["futureOccupiedUnits"],
        message: "Future occupied units cannot exceed rentable units",
      });
    }
  });

export const normalizedPortfolioSchema = z
  .object({
    schemaVersion: z.literal(1),
    reportingDate: z.string().date(),
    sourceSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    propertyCount: z.number().int().positive(),
    rentableUnits: z.number().int().positive(),
    occupiedUnits: z.number().int().nonnegative(),
    futureOccupiedUnits: z.number().int().nonnegative(),
    physicalOccupancy: z.number().min(0).max(1),
    futureOccupancy: z.number().min(0).max(1),
    grossResidentArCents: z.number().int().nonnegative(),
    netResidentMovement: z.number().int(),
    properties: z.array(propertySnapshotSchema).min(1).max(100),
  })
  .strict();

export type PropertySnapshot = z.infer<typeof propertySnapshotSchema>;
export type NormalizedPortfolio = z.infer<typeof normalizedPortfolioSchema>;

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

/**
 * timelineQuerySchema
 * Validates query params for the student's date-wise attendance timeline.
 */
export const timelineQuerySchema = z.object({
  subjectId: objectId.optional(),
  startDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid start date" })
    .optional(),
  endDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid end date" })
    .optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .refine((v) => v > 0, { message: "Page must be a positive integer" }),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 30))
    .refine((v) => v > 0, { message: "Limit must be a positive integer" }),
});

import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const reportQuerySchema = z.object({
  departmentId: objectId.optional(),
  classId: objectId.optional(),
  subjectId: objectId.optional(),
  startDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid start date" })
    .optional(),
  endDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid end date" })
    .optional(),
});

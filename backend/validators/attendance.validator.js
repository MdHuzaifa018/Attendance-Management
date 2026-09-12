import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format — must be a 24-character hex string");

/**
 * getSheetQuerySchema
 * Validates query parameters when loading the daily attendance marking sheet.
 */
export const getSheetQuerySchema = z.object({
  classId: objectId,
  subjectId: objectId,
  date: z
    .string()
    .min(4, "Attendance date is required")
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid date format — expected YYYY-MM-DD",
    }),
  session: z.string().trim().min(1).max(30).optional().default("regular"),
});

/**
 * markAttendanceSchema
 * Validates bulk attendance submission from faculty or admin.
 */
export const markAttendanceSchema = z.object({
  classId: objectId,
  subjectId: objectId,
  date: z
    .string()
    .min(4, "Attendance date is required")
    .refine((d) => !isNaN(Date.parse(d)), {
      message: "Invalid date format — expected YYYY-MM-DD",
    }),
  session: z.string().trim().min(1).max(30).optional().default("regular"),
  records: z
    .array(
      z.object({
        studentId: objectId,
        status: z.enum(["present", "absent"], {
          errorMap: () => ({ message: "Status must be either 'present' or 'absent'" }),
        }),
      })
    )
    .min(1, "Attendance sheet must include at least one student record"),
  updateIfExists: z.boolean().optional().default(false),
});

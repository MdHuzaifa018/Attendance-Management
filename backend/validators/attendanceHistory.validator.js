import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format — must be a 24-character hex string");

/**
 * historyQuerySchema
 * Validates query parameters when fetching attendance history sessions.
 * All filters are optional — returns paginated sessions within a date range.
 */
export const historyQuerySchema = z.object({
  classId: objectId.optional(),
  subjectId: objectId.optional(),
  teacherId: objectId.optional(),
  startDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid start date" })
    .optional(),
  endDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid end date" })
    .optional(),
  session: z.string().trim().min(1).max(30).optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .refine((v) => v > 0, { message: "Page must be a positive integer" }),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 20))
    .refine((v) => v > 0, { message: "Limit must be a positive integer" }),
});

/**
 * sessionDetailQuerySchema
 * Validates query parameters for loading all student records in a specific session.
 */
export const sessionDetailQuerySchema = z.object({
  classId: objectId,
  subjectId: objectId,
  date: z
    .string()
    .min(4, "Attendance date is required")
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format — expected YYYY-MM-DD" }),
  session: z.string().trim().min(1).max(30).optional().default("regular"),
});

/**
 * correctAttendanceSchema
 * Validates a single attendance record correction request.
 */
export const correctAttendanceSchema = z.object({
  attendanceId: objectId,
  newStatus: z.enum(["present", "absent"], {
    errorMap: () => ({ message: "Status must be 'present' or 'absent'" }),
  }),
  reason: z.string().trim().max(300).optional(),
});

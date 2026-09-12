import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid department ID — please select from list");

/**
 * createClassSchema
 * Validates creation of a new academic Class (e.g. BCA-I, BCA-III).
 */
export const createClassSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(100, "Class name is too long")
    .trim(),

  code: z
    .string()
    .min(2, "Class code must be at least 2 characters")
    .max(20, "Class code is too long")
    .trim()
    .toUpperCase(),

  departmentId: objectId,

  semester: z.coerce
    .number()
    .int("Semester must be an integer")
    .min(1, "Semester must be at least 1")
    .max(8, "Semester cannot exceed 8"),

  section: z
    .string()
    .max(5, "Section is too long")
    .trim()
    .toUpperCase()
    .optional()
    .default("A"),

  academicYear: z
    .string()
    .min(4, "Academic year is required (e.g. 2024-25)")
    .max(15)
    .trim(),
});

/**
 * updateClassSchema
 * Validates updates to an existing academic Class.
 */
export const updateClassSchema = z.object({
  name: z
    .string()
    .min(2, "Class name must be at least 2 characters")
    .max(100, "Class name is too long")
    .trim()
    .optional(),

  code: z
    .string()
    .min(2, "Class code must be at least 2 characters")
    .max(20, "Class code is too long")
    .trim()
    .toUpperCase()
    .optional(),

  departmentId: objectId.optional(),

  semester: z.coerce
    .number()
    .int("Semester must be an integer")
    .min(1, "Semester must be at least 1")
    .max(8, "Semester cannot exceed 8")
    .optional(),

  section: z
    .string()
    .max(5, "Section is too long")
    .trim()
    .toUpperCase()
    .optional(),

  academicYear: z
    .string()
    .min(4, "Academic year is required")
    .max(15)
    .trim()
    .optional(),

  isActive: z.boolean().optional(),
});

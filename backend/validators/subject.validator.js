import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format — please select from the list");

/**
 * createSubjectSchema
 * Validates creation of a new academic Subject mapped to a Class and Teacher.
 */
export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name cannot exceed 100 characters")
    .trim(),

  code: z
    .string()
    .min(2, "Subject code must be at least 2 characters")
    .max(20, "Subject code cannot exceed 20 characters")
    .trim()
    .toUpperCase(),

  classId: objectId,

  teacherId: objectId,

  totalClasses: z.coerce
    .number()
    .int("Total classes must be an integer")
    .min(0, "Total classes cannot be negative")
    .optional()
    .default(0),
});

/**
 * updateSubjectSchema
 * Validates updates to an existing Subject.
 */
export const updateSubjectSchema = z.object({
  name: z
    .string()
    .min(2, "Subject name must be at least 2 characters")
    .max(100, "Subject name cannot exceed 100 characters")
    .trim()
    .optional(),

  code: z
    .string()
    .min(2, "Subject code must be at least 2 characters")
    .max(20, "Subject code cannot exceed 20 characters")
    .trim()
    .toUpperCase()
    .optional(),

  classId: objectId.optional(),

  teacherId: objectId.optional(),

  totalClasses: z.coerce
    .number()
    .int("Total classes must be an integer")
    .min(0, "Total classes cannot be negative")
    .optional(),

  isActive: z.boolean().optional(),
});

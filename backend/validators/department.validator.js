import { z } from "zod";

/**
 * createDepartmentSchema
 * Validates creation of a new academic department (e.g. BCA, MCA, B.Sc).
 */
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name is too long")
    .trim(),

  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code must be at most 10 characters")
    .trim()
    .toUpperCase(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

/**
 * updateDepartmentSchema
 * Validates updates to an existing department.
 */
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name is too long")
    .trim()
    .optional(),

  code: z
    .string()
    .min(2, "Department code must be at least 2 characters")
    .max(10, "Department code must be at most 10 characters")
    .trim()
    .toUpperCase()
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional(),

  isActive: z.boolean().optional(),
});

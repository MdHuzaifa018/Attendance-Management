import { z } from "zod";

// Reusable ObjectId string validator
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID — please select from the list");

/**
 * createTeacherSchema
 * Used when admin provisions a new teacher.
 * Simultaneously creates a User account (role: "teacher") and a Teacher profile.
 */
export const createTeacherSchema = z.object({
  // User account credentials
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),

  // Teacher profile attributes
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .max(20, "Employee ID is too long")
    .trim()
    .toUpperCase(),

  departmentId: objectId,

  phone: z
    .string()
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  designation: z
    .string()
    .max(50, "Designation is too long")
    .trim()
    .optional()
    .default("Assistant Professor"),
});

/**
 * updateTeacherSchema
 * Used when admin edits an existing teacher profile.
 * Credentials (password/email) are not modified via this endpoint.
 */
export const updateTeacherSchema = z.object({
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .max(20, "Employee ID is too long")
    .trim()
    .toUpperCase()
    .optional(),

  departmentId: objectId.optional(),

  phone: z
    .string()
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  designation: z
    .string()
    .max(50, "Designation is too long")
    .trim()
    .optional(),

  isActive: z.boolean().optional(),
});

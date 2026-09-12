import { z } from "zod";

// Reusable ObjectId string validator
const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID — please select from the list");

/**
 * createStudentSchema
 * Used when admin creates a new student.
 * Creates both a User account and a Student profile in one operation.
 */
export const createStudentSchema = z.object({
  // User account fields
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

  // Student profile fields
  rollNo: z
    .string()
    .min(1, "Roll number is required")
    .max(20, "Roll number is too long")
    .trim()
    .toUpperCase(),

  fatherName: z
    .string()
    .min(2, "Father name is required")
    .max(100, "Father name is too long")
    .trim(),

  departmentId: objectId,

  classId: objectId,

  admissionYear: z.coerce
    .number()
    .int("Admission year must be a whole number")
    .min(2000, "Admission year seems too early")
    .max(2030, "Admission year seems too far in the future"),

  phone: z
    .string()
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),
});

/**
 * updateStudentSchema
 * Used when admin edits an existing student.
 * All fields optional — only send what changed.
 * Does not allow changing the linked user account (email/password changes are separate).
 */
export const updateStudentSchema = z.object({
  rollNo: z
    .string()
    .min(1, "Roll number is required")
    .max(20)
    .trim()
    .toUpperCase()
    .optional(),

  fatherName: z
    .string()
    .min(2, "Father name is required")
    .max(100)
    .trim()
    .optional(),

  departmentId: objectId.optional(),

  classId: objectId.optional(),

  admissionYear: z.coerce.number().int().min(2000).max(2030).optional(),

  phone: z.string().max(15).optional().or(z.literal("")),

  isActive: z.boolean().optional(),
});

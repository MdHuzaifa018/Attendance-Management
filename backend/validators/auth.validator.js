import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  email: z.string().email("Please provide a valid email").toLowerCase().trim(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),

  rollNo: z
    .string()
    .min(1, "Roll number is required")
    .max(30, "Roll number is too long")
    .trim(),

  departmentId: z.string().min(1, "Department is required"),

  classId: z.string().min(1, "Class is required"),

  fatherName: z
    .string()
    .min(2, "Father's name is required")
    .max(100, "Father's name is too long")
    .trim(),

  motherName: z.string().optional(),

  phone: z.string().optional(),

  admissionYear: z.union([z.number(), z.string()]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email").toLowerCase().trim(),

  password: z.string().min(1, "Password is required"),
});

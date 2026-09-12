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
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email").toLowerCase().trim(),

  password: z.string().min(1, "Password is required"),
});

import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const Schema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(20, "Title must contain at most 20 character(s)"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(50, "Description must contain at most 50 character(s)"),
  file: z
    .any()
    .refine((file) => file && file.length > 0, "Document is required.")
    .refine((file) => {
      return file?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max document size is 2MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});

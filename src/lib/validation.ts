import { z } from "zod";

const ProfileType = z.union([z.optional(z.null()), z.instanceof(File)]);

const isImageFile = (file: File | null | undefined | string): boolean => {
  return !file || (file instanceof File && file.type.startsWith("image/"));
};

const isFileSizeValid = (file: File | null | undefined | string): boolean => {
  return !file || (file instanceof File && file.size < 1024 * 1024 * 10);
};

export const formSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nickName: z.string().optional(),
  position: z.string().min(1, {
    message: "Select a position.",
  }),
  department: z.string().min(1, {
    message: "Select a department.",
  }),
  email: z.string().email({
    message: "Enter a valid email address.",
  }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^(09\d{9}|\+639\d{9})$/.test(val), {
      message:
        "Enter a valid phone number, either '09177212113' or '+639177212113'.",
    }),

  profile: ProfileType.refine(
    isImageFile,
    "File must be an image file."
  ).refine(isFileSizeValid, "File must be less than 10MB."),
});

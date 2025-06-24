import { z } from "zod";

export const registerSchema = z.object({
  phoneNumber: z.string().nonempty({ message: "Nomor telepon wajib diisi" }),
  countryCode: z.string().nonempty({ message: "Kode negara wajib diisi" }),
  firstName: z.string().nonempty({ message: "First name wajib diisi" }),
  lastName: z.string().nonempty({ message: "Last name wajib diisi" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
});

export type RegisterFormType = z.infer<typeof registerSchema>;

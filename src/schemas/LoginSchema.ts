import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().nonempty({ message: "Nomor telepon wajib diisi" }),
  countryCode: z.string().nonempty({ message: "Kode negara wajib diisi" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
});

export type LoginFormType = z.infer<typeof loginSchema>;

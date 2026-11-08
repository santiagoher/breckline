import { z } from "zod";

export const MAX_CONTACT_REQUEST_BYTES = 16 * 1024;

export const contactSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(100, "El nombre no puede superar 100 caracteres."),
    titulo: z
      .string()
      .trim()
      .min(3, "El título debe tener al menos 3 caracteres.")
      .max(160, "El título no puede superar 160 caracteres."),
    mensaje: z
      .string()
      .trim()
      .min(10, "El mensaje debe tener al menos 10 caracteres.")
      .max(3_000, "El mensaje no puede superar 3000 caracteres."),
    captchaToken: z
      .string()
      .trim()
      .min(1, "Completa la verificación de seguridad.")
      .max(4_096, "La verificación de seguridad no es válida."),
    honeypot: z.string().trim().max(200).optional(),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;

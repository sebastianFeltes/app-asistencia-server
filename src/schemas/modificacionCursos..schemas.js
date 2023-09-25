import z from "zod";

export const modificacionCursosSchema = z.object({
  body: z.object({
    id_Curso: z.number().int(),
    nombre: z.string().min(3),
    id_docente: z.string().min(3),
    id_dia: z.string().min(3),
    horario: z.string().min(3),
    activo: z.boolean(),
  }),
});

import z from "zod";

export const asistenciaAlumnosSchema = z.object({
  body: z.object({
    asistencia: z.string().min(1),
    idAlumno: z.number().min(1),
  }),
});

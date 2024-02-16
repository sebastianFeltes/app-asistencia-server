import z from "zod";

export const altaCursoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3),
    id_docente: z.number(),
    horario_inicio: z.string().min(2),
    horario_final: z.string().min(2),
    fecha_inicio:z.string(),
    fecha_final:z.string(),
    activo: z.number(), 
    horas_catedra: z.number(),
  }),
});

import z from "zod";

export const altaCursoSchema = z.object({
  body: z.object({
     id_curso: z.number(), 
    nombre: z.string().min(3),
    id_docente: z.number(),
    horario_inicio: z.string().min(2),
    horario_final: z.string().min(2),
    fecha_inicio:z.date(),
    fecha_finalizacion:z.date(),
    activo: z.boolean(), 
  }),
});
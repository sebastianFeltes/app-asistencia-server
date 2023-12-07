import z from "zod";

export const modificacionCursosSchema = z.object({
	body: z.object({
		id_curso: z.number(),
		nombre: z.string().min(3),
		id_docente: z.number(),
		horario_inicio: z.string().min(2),
		horario_final: z.string().min(2),
		fecha_inicio: z.string(),
		fecha_final: z.string(),
		activo: z.number(),
	}),
});

import z, { string } from "zod";

//VALIDACION DE CAMPOS
export const altaAlumnoSchema = z.object({
	body: z.object({
		tipo_dni: z.string().max(2),
		nro_dni: z.number(),
		nro_legajo: z.number(),
		nombre: z.string().min(2),
		apellido: z.string().min(2),
		fecha_nac: z.string().min(7),
		direccion: z.string(),
		email: z.string().email(),
		telefono: z.number(),
		car_telefono: z.number(),
		car_tel_extra: z.number(),
		telefono_extra: z.number(),
		nro_legajo: z.number(),
		localidad: z.string(),
		car_tel_extra: z.number().min(2),
		telefono_extra: z.number().min(6),
		fotoc_analitico: z.number(),
		fotoc_dni: z.number(),
		planilla_ins: z.number(),
		cursos: z.array()
	}),
});
/* 
activo: z.string(),
nombre: z.string().min(3),
apellido: z.string().min(3),
tipo_dni: z.string().min(2),
nro_dni: z.number(),
fecha_nac: z.string(),
car_telefono:z.number().min(2),
telefono: z.number().min(2),
direccion: z.string(),
email: z.string().email(),
nro_legajo: z.number(),
localidad: z.string(),
car_tel_extra: z.number().min(2),
telefono_extra: z.number().min(6),
fotoc_analitico: z.number(),
fotoc_dni: z.number(),
planilla_ins: z.number(),
id_alumno: z.string().min(1) */

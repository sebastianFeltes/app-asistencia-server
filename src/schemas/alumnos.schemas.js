import z, { string } from "zod";

//VALIDACION DE CAMPOS
export const altaAlumnoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3),
    apellido: z.string().min(4),
    tipo_dni: z.string().min(2),
    nro_dni: z.number().min(7),
    fecha_nac: z.string().min(7),
    direccion: z.string(),
    localidad: z.string(),
    email: z.string().email(),
    telefono: z.number().min(7),
    car_telefono: z.number().min(3),
    car_tel_extra: z.number().min(3),
    telefono_extra: z.number().min(7),
    nro_legajo: z.number(),
    fotoc_dni: z.number(),
    planilla_ins: z.number(),
    fotoc_analitico: z.number(),
    curso: z.string()
  }),
});

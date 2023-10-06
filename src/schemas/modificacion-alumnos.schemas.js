import z from "zod";

export const modicacionAlumnos = z.object({
  body: z.object({
    id_alumno: z.number().int(),
    tipo_dni: z.string(),
    nro_dni: z.number().min(7),
    nro_legajo: z.number(),
    nombre: z.string().min(3),
    apellido: z.string().min(3),
    activo:z.boolean(),
    direccion: z.string(),
    localidad: z.string(),
    car_telefono: z.number().min(2),
    telefono: z.number(),
    car_tel_extra: z.number(),
    telefono_extra: z.number().min(2),
    email: z.string().email(),
    fotoc_dni: z.string(),
    fotoc_analitico:z.string(),
    planilla_ins:z.string(),
 

  }),
});

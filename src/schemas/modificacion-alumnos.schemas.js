import z from "zod";

export const modicacionAlumnos = z.object({
  body: z.object({
    id_alumno: z.number().int(),
    nro_legajo: z.number(),
    nombre: z.string().min(3),
    apellido: z.string().min(3),
    tipo_dni: z.string(),
    nro_dni: z.number().min(7),
    direccion: z.string(),
    localidad: z.string(),
    car_telefono: z.number().min(2),
    telefono: z.number(),
    email: z.string().email(),
    car_tel_extra: z.number(),
    telefono_extra: z.number().min(2),
    fotoc_dni: z.boolean(),
    fotoc_analitico:z.boolean(),
    planilla_ins:z.boolean(),
    activo:z.boolean(),
 

  }),
});

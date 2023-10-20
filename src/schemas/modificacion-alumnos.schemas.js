import z from "zod";

export const modicacionAlumnos = z.object({
  body: z.object({
    id_alumno: z.number().int(),
    tipo_dni: z.string(),
    nro_dni: z.number().min(7).int(),
    nro_legajo: z.number().int(),
    nombre: z.string().min(3),
    apellido: z.string().min(3),
    activo:z.number(),
    fecha_nac:z.string(),
    direccion: z.string(),
    localidad: z.string(),
    car_telefono: z.number().min(2).int(),
    telefono: z.number().int(),
    car_tel_extra: z.number().int(),
    telefono_extra: z.number().min(2),
    email: z.string().email(),
    fotoc_dni: z.number(),
    fotoc_analitico:z.number(),
    planilla_ins:z.number(),
 

  }),
});

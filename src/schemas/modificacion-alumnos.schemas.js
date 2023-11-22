import z from "zod";

export const modificacionAlumnos = z.object({
  body: z.object({
    activo: z.string(),
    nombre: z.string().min(3),
    apellido: z.string().min(3),
    tipo_dni: z.string().min(2),
    nro_dni: z.number(),
    fecha_nac: z.string(),
    car_telefono: z.number().min(2),
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
    id_alumno: z.number(),
  }),
});

import z, { string } from "zod";

//VALIDACION DE CAMPOS
export const altaAlumnoSchema = z.object({
  body: z.object({
<<<<<<< HEAD
    activo: z.string(),
    nombre: z.string().min(3),
    apellido: z.string().min(3),
    tipo_dni: z.string().min(2),
    nro_dni: z.number(),
    fecha_nac: z.string(),
    car_telefono: z.number().min(2),
    telefono: z.number().min(2),
=======
    tipo_dni:  z.string().min(2),
    nro_dni: z.number(),
    nro_legajo:  z.number(),
    nombre:z.string().min(3),
    apellido: z.string().min(4),
    fecha_nac: z.string().min(7),
>>>>>>> c36c411e8b4494e940a7c132c6d7153d10728aac
    direccion: z.string(),
    email: z.string().email(),
<<<<<<< HEAD
=======
    telefono: z.number(),
    car_telefono: z.number(),
    car_tel_extra: z.number(),
    telefono_extra: z.number(),
>>>>>>> c36c411e8b4494e940a7c132c6d7153d10728aac
    nro_legajo: z.number(),
    localidad: z.string(),
    car_tel_extra: z.number().min(2),
    telefono_extra: z.number().min(6),
    fotoc_analitico: z.number(),
    fotoc_dni: z.number(),
    planilla_ins: z.number(),
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

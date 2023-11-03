import z, { string } from "zod";

//VALIDACION DE CAMPOS
export const altaAlumnoSchema = z.object({
  body: z.object({
    tipo_dni:  z.string().min(2),
    nro_dni: z.number(),
    nro_legajo:  z.number(),
    nombre:z.string().min(3),
    apellido: z.string().min(4),
    direccion: z.string(),  
    localidad:z.string(),
    fecha_nac:z.string(),
    car_telefono: z.number(),
    telefono:  z.number(),
    car_tel_extra:z.number(),
    telefono_extra:  z.number(),
    email: z.string().email(),
  }),
});

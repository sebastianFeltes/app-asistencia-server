import z from "zod";

export const altaDocenteSchema = z.object({
    body: z.object({
 
        tipo_dni: z.string().min(2),
        nro_dni: z.number().min(7),
        nombre: z.string(),
        apellido: z.string(),
        fecha_nac:z.string(),
        nro_legajo: z.number(),
        password: z.string().min(8),
        direccion: z.string(),
        localidad: z.string(),
        car_telefono: z.number().min(3),
        telefono: z.number(),
        car_tel_extra: z.number().min(3),
        telefono_extra: z.number(),
        id_rol: z.number(),
        email: z.string().email(),
        activo: z.number(),
    })
});
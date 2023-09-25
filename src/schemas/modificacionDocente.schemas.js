import z, { number } from "zod"

export const datosDocentesSchema = 
z.object({
    body: z.object-({ 
        id_docente: number(),
        activo: z.boolean(),
        nombre: z.string().min(3),
        apellido: z.string().min(3),
        tipo_dni: z.string().min(2),
        nro_dni: z.number().min(7),
        car_telefono: z.number().min(2),
        telefono: z.number().min(7),
        direccion: z.string().min(5),
        email: z.string().min(15),
        fecha_nac: z.string().min(6) ,
        nro_legajo:z.number().min(2),
        localidad: z.number().min(4),
        id_rol: z.string().min(5) 
     /*    check: check,
        nombre: nombre,
        apellido: apellido,
        tipoDNI: tipoDNI,
        dni: dni,
        codAreaTel: codAreaTel,
        telefono: telefono,
        direccion: direccion,
        email: email,
        fecNac: fecNac,
        legajo: legajo,
        localidad: localidad,
        rol: rol     */    
    })
})
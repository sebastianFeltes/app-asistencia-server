import z from "zod";

export const loginUserSchema = z.object({
    body: z.object({
        nro_dni: z.number().min(7),
        password: z.string().min(4),
    })
});
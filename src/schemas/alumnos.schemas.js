import z, { string } from "zod";

//VALIDACION DE CAMPOS
export const altaAlumnoSchema = z.object({
  body: z.object({
    nombre: z.string().min(3),
    apellido: z.string().min(4),
    tipoDoc: z.string().min(2),
    dni: z.number().min(7),
    direccion: z.string(),
    localidad: z.string(),
    email: z.string().email(),
    tel: z.number().min(7),
    telCar: z.number().min(3),
    telCarExt: z.number().min(3),
    telExt: z.number().min(7),
    numLegajo: z.number(),
    documentacionDni: z.boolean(),
    documentacionPlanilla: z.boolean(),
    documentacionAnalitico: z.boolean(),
    cursos: z.array(),
  }),
});

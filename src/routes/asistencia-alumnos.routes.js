import { Router } from "express";
import { getAsist } from "../controllers/asistencia-alumnos.controllers.js";
import { asistenciaAlumnosSchema } from "../schemas/asistenciaAlumno.schemas.js";
import { asistenciaAlumnosValitator } from "../middlewares/asistenciaAlumnosValidator.js";

const asistenciaRouter = Router(); 
asistenciaRouter.post("/asistencia-alumnos", asistenciaAlumnosValitator(asistenciaAlumnosSchema), getAsist  ) 
asistenciaRouter.get("/asistencia-alumnos", getAsist  ) 
export default asistenciaRouter;
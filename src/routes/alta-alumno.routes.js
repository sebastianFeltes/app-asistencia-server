import { Router } from "express";
import {  traerAlumno, tryAltaAlumno } from "../controllers/alta-alumno.controller.js";
import { altaAlumnoSchema } from "../schemas/alumnos.schemas.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";


const nuevoAlumnoRouter = Router();
nuevoAlumnoRouter.post("/alta-alumno",alumnoValidator(altaAlumnoSchema),tryAltaAlumno);
nuevoAlumnoRouter.get("/alta-alumno/:nro_dni",traerAlumno); 

export default nuevoAlumnoRouter;
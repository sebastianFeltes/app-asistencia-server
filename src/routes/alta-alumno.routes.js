import { Router } from "express";
import {  buscarCurso, modificarDatosAltaAlumno, traerAlumno, tryAltaAlumno } from "../controllers/alta-alumno.controller.js";
import { altaAlumnoSchema } from "../schemas/alumnos.schemas.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";


const nuevoAlumnoRouter = Router();
nuevoAlumnoRouter.post("/app/alta-alumno",alumnoValidator(altaAlumnoSchema),tryAltaAlumno);
nuevoAlumnoRouter.post("/app/alta-alumno",alumnoValidator(altaAlumnoSchema),modificarDatosAltaAlumno);
nuevoAlumnoRouter.get("/app/alta-alumno/:nro_dni",traerAlumno); 
nuevoAlumnoRouter.get("/app/alta-alumno",buscarCurso); 

export default nuevoAlumnoRouter;
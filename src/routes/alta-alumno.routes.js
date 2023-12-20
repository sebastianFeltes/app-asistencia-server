import { Router } from "express";
import {  buscarCurso, modificarDatosAltaAlumno, traerAlumno, tryAltaAlumno } from "../controllers/alta-alumno.controller.js";
import { altaAlumnoSchema } from "../schemas/alumnos.schemas.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";


const nuevoAlumnoRouter = Router();
nuevoAlumnoRouter.post("/api/alta-alumno",alumnoValidator(altaAlumnoSchema),tryAltaAlumno);
nuevoAlumnoRouter.post("/api/alta-alumno/:id_alumno",alumnoValidator(altaAlumnoSchema),modificarDatosAltaAlumno);
nuevoAlumnoRouter.get("/api/alta-alumno/:nro_dni",traerAlumno); 
nuevoAlumnoRouter.get("/api/alta-alumno",buscarCurso); 

export default nuevoAlumnoRouter;
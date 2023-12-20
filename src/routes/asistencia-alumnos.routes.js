import { Router } from "express";
import { getAsistencia, modificarAsistencia } from "../controllers/asistencia-alumnos.controllers.js";
/* import { asistenciaAlumnosSchema } from "../schemas/asistenciaAlumno.schemas.js";
import { asistenciaAlumnosValitator } from "../middlewares/asistenciaAlumnosValidator.js";
 */
const asistenciaRouter = Router();

asistenciaRouter.get("/api/asistencia-alumnos/:id", getAsistencia); //obtener asistencia segun id de curso
asistenciaRouter.post("/api/modificar-asistencia", modificarAsistencia); //modificar de A a J segun id del alumno
export default asistenciaRouter;

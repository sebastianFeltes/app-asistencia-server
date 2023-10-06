import { Router } from "express";
import { getAsistencia, modificarAsistencia } from "../controllers/asistencia-alumnos.controllers.js";
/* import { asistenciaAlumnosSchema } from "../schemas/asistenciaAlumno.schemas.js";
import { asistenciaAlumnosValitator } from "../middlewares/asistenciaAlumnosValidator.js";
 */
const asistenciaRouter = Router(); 

asistenciaRouter.get("/asistencia-alumnos/:id", getAsistencia)
asistenciaRouter.get("/modificar-asistencia/:id_asistencia", modificarAsistencia)
export default asistenciaRouter;
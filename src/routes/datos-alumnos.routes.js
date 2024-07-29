import { Router } from "express";
import {
  datosAlumnos,
  eliminarAlumno,
  enviarRegistroAsistencia,
  modificarDatosAlumno,
} from "../controllers/datos-alumnos.controller.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";
import { modificacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";

const alumnosRouter = Router();
// /alumnos?page=${page}&size=${size}`
alumnosRouter.get("/api/datos-alumnos", datosAlumnos);
alumnosRouter.get("/api/asistencia-registro", enviarRegistroAsistencia);
alumnosRouter.post(
  "/api/datos-alumnos",
  alumnoValidator(modificacionAlumnos),
  modificarDatosAlumno
);
alumnosRouter.delete("/api/alumno/:id_alumno", eliminarAlumno)

export default alumnosRouter;

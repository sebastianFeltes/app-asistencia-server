import { Router } from "express";
import { datosAlumnos, modificarDatosAlumno } from "../controllers/datos-alumnos.controller.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";
import { modificacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";


const alumnosRouter = Router();

alumnosRouter.get("/api/datos-alumnos", datosAlumnos);
alumnosRouter.post("/api/datos-alumnos",alumnoValidator(modificacionAlumnos), modificarDatosAlumno);

export default alumnosRouter;


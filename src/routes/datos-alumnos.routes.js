import { Router } from "express";
import { datosAlumnos, modificarDatosAlumno } from "../controllers/datos-alumnos.controller.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";
import { modicacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";


const alumnosRouter = Router();

alumnosRouter.get("/datos-alumnos", datosAlumnos);
alumnosRouter.post("/datos-alumnos",alumnoValidator(modicacionAlumnos), modificarDatosAlumno);

export default alumnosRouter;


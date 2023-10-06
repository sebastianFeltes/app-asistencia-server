import { Router } from "express";
import { alumnosValidador } from "../middlewares/alumnosValidador.middlewares.js";
import { modicacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";
import { datosAlumnos, modificarDatosAlumno } from "../controllers/datos-alumnos.controller.js";


const alumnosRouter = Router();

alumnosRouter.get("/datos-alumnos", datosAlumnos);
alumnosRouter.post("/datos-alumnos",alumnosValidador (modicacionAlumnos), modificarDatosAlumno);

export default alumnosRouter;


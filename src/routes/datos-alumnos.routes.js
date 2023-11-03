import { Router } from "express";
import { datosAlumnos, modificarDatosAlumno } from "../controllers/datos-alumnos.controller.js";
import { alumnosValidador } from "../middlewares/alumnosValidador.middlewares.js";
import { modicacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";


const alumnosRouter = Router();

alumnosRouter.get("/datos-alumnos", datosAlumnos);
alumnosRouter.post("/datos-alumnos",alumnosValidador (modicacionAlumnos), modificarDatosAlumno);

export default alumnosRouter;

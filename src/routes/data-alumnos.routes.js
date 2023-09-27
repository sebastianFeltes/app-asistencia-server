import { Router } from "express";
import { dataAlumnos, modificarDataAlumno } from "../controllers/data-alumnos.controllers.js";
import { alumnosValidador } from "../middlewares/alumnosValidador.middlewares.js";
import { modicacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";


const alumnosRouter = Router();

alumnosRouter.get("/data-alumnos", dataAlumnos);
alumnosRouter.post("/data-alumnos",alumnosValidador (modicacionAlumnos), modificarDataAlumno);

export default alumnosRouter;


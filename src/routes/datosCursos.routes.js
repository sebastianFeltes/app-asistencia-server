import { Router } from "express";
import { getCurso, getCursos, getDias, modificarCursos } from "../controllers/datosCursos.controllers.js";
import { cursosValidator } from "../middlewares/cursosValidator.middlewares.js";
import { modificacionCursosSchema } from "../schemas/modificacionCursos..schemas.js";

const cursosRouter = Router();
cursosRouter.get("/cursos", getCursos);
cursosRouter.get("/cursos/:id", getCurso);
cursosRouter.post("/cursos", cursosValidator(modificacionCursosSchema), modificarCursos);
cursosRouter.get("/dias", getDias);
export default cursosRouter;

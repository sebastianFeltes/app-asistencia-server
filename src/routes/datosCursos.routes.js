import { Router } from "express";
import { getCurso, getCursos, getDias, modificarCursos } from "../controllers/datosCursos.controllers.js";
import { cursosValidator } from "../middlewares/cursosValidator.middlewares.js";
import { modificacionCursosSchema } from "../schemas/modificacionCursos..schemas.js";

const cursosRouter = Router();
cursosRouter.get("/api/cursos", getCursos);
cursosRouter.get("/api/cursos/:id", getCurso);
cursosRouter.post("/api/cursos", cursosValidator(modificacionCursosSchema), modificarCursos);
cursosRouter.get("/api/dias", getDias);
export default cursosRouter;

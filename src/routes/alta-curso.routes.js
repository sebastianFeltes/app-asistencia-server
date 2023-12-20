import { Router } from "express";
import { altaCursoSchema } from "../schemas/alta-curso.schemas.js";
import { cursosValidator } from "../middlewares/cursosValidator.middlewares.js";
import { tryAltaCurso } from "../controllers/alta-curso.controller.js";

const nuevoCursoRouter = Router();
nuevoCursoRouter.post("/api/alta-curso", cursosValidator(altaCursoSchema), tryAltaCurso)
export default nuevoCursoRouter;
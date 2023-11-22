import { Router } from "express";
import { tryAltaCurso } from "../controllers/alta-curso.controller";
import { altaCursoSchema } from "../schemas/alta-curso.schemas";
import { cursosValidator } from "../middlewares/cursosValidator.middlewares";

const nuevoCursoRouter = Router();
nuevoCursoRouter.post("/alta-curso",cursosValidator(altaCursoSchema),tryAltaCurso)

export default nuevoCursoRouter;
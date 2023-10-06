import { Router } from "express";
import { getCursos, modificarCursos } from "../controllers/datosCursos.controllers.js";
import { cursosValidator } from "../middlewares/cursosValidator.middlewares.js";
import { modificacionCursosSchema } from "../schemas/modificacionCursos..schemas.js";

const cursosRouter = Router();
cursosRouter.get("/cursos",getCursos);
cursosRouter.post("/cursos",cursosValidator(modificacionCursosSchema), modificarCursos);

export default cursosRouter;
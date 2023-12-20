import { Router } from "express";
import {getDocentes, altaDocentes} from "../controllers/alta-docente.controller.js";
import { docenteValidator } from "../middlewares/docenteValidator.middlewares.js";
import { altaDocenteSchema } from "../schemas/alta-docente.schemas.js";
const nuevosDocentesRouter = Router();

nuevosDocentesRouter.post("/api/alta-docente",docenteValidator(altaDocenteSchema), altaDocentes);

nuevosDocentesRouter.get("/api/alta-docente", getDocentes)

export default nuevosDocentesRouter;

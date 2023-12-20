import Router from "express";
import { getDocentes, modificarDocente } from "../controllers/datos-docentes.controller.js";

const docentesRouter = Router();

docentesRouter.post("/api/datos-docentes", modificarDocente);
docentesRouter.get("/api/docentes", getDocentes);

export default docentesRouter;

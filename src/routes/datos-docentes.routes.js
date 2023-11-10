import Router from "express";
import { getDocentes, modificarDocente } from "../controllers/datos-docentes.controller.js";

const docentesRouter = Router();

docentesRouter.post("/datos-docentes", modificarDocente);
docentesRouter.get("/docentes", getDocentes);

export default docentesRouter;

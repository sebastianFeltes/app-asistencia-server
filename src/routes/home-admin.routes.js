import { Router } from "express";
import { mosCursos } from "../controllers/home-admin.controllers";
import cursosRouter from "./datosCursos.routes";
import { getDias } from "../controllers/datosCursos.controllers";


const adminRouter = Router();
cursosRouter.get("/cursos",mosCursos);

export default adminRouterRouter ;
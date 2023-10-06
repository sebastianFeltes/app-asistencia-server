import { Router } from "express";
import { mosCursos } from "../controllers/home-admin.controllers";


const adminRouter = Router();
cursosRouter.get("/cursos",mosCursos);
export default adminRouterRouter ;
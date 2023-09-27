import { Router } from "express";
import { buscarAlumnoPorId } from "../controllers/gestionQR.controller";

const qrRouter = Router();

qrRouter.post("/alumno/:id", buscarAlumnoPorId);

export default qrRouter;

import { Router } from "express";
import { buscarAlumnoPorId } from "../controllers/gestionQR.controller.js";

const qrRouter = Router();

qrRouter.get("/alumno/:id", buscarAlumnoPorId);

export default qrRouter;

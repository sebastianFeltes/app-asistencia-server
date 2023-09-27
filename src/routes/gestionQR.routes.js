import { Router } from "express";
import { buscarAlumnoPorId } from "../controllers/gestionQR.controller.js";

const qrRouter = Router();

qrRouter.get("/alumno/:id", buscarAlumnoPorId);
//POST  const {nro_dni, pass} = req.body
//GET 
//PUT 
//DELETE 
//HEADER
export default qrRouter;

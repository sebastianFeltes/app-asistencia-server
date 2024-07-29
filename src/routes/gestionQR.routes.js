import { Router } from "express";
import { marcarPresente } from "../controllers/gestionQR.controller.js";

const qrRouter = Router();

qrRouter.get("/api/alumno/:id", marcarPresente);
//POST  const {nro_dni, pass} = req.body
//GET
//PUT
//DELETE
//HEADER
export default qrRouter;

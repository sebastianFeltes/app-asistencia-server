import { Router } from "express";
import { datosAlumnos, modificarDatosAlumno } from "../controllers/datos-alumnos.controller.js";
import { alumnoValidator } from "../middlewares/alumnoValidator.middlewares.js";
import { modificacionAlumnos } from "../schemas/modificacion-alumnos.schemas.js";


const alumnosRouter = Router();

alumnosRouter.get("/datos-alumnos", datosAlumnos);
alumnosRouter.post("/datos-alumnos",(req,res)=>{console.log(req.body)},alumnoValidator(modificacionAlumnos), modificarDatosAlumno);

export default alumnosRouter;


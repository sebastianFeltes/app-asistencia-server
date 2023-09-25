import express, { json, urlencoded } from "express";
import cors from "cors";
import asistenciaRouter from "./routes/asistencia-alumnos.routes.js";

const app = express();
const port = 8080;

app.use(cors())
app.use(json());
app.use(urlencoded());
app.use(asistenciaRouter)

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
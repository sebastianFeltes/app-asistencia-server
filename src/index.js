import express, { json, urlencoded } from "express";
import cors from "cors";
import docentesRouter from "./routes/datos-docentes.routes.js";
const app = express();
const port = 8080;

app.use(json());
app.use(cors());
app.use(urlencoded());
app.use(docentesRouter);
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

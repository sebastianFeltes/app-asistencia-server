import express, { json, urlencoded } from "express";
import session from "express-session";
import cors from "cors";
import docentesRouter from "./routes/datos-docentes.routes.js";
const app = express();
const port = 8080;

app.set("trust proxy", 1)
app.use(
  session({
    secret: "black cat",
    resave: true,
    saveUninitialized: true
  }));






app.use(json());
app.use(cors());
app.use(urlencoded());
app.use(docentesRouter);
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

import express, { json, urlencoded } from "express";
import session from "express-session";
import cors from "cors"
import nuevoDocentesRouter from "./routes/alta-docente.routes.js";
const app = express();
const port = 8080;

app.use(cors())
app.use(json());
app.use(urlencoded());
app.set("trust proxy", 1)
app.use(session({
    secret:"black-cat",
    resave:true,
    saveUninitialized:true
}))
app.use(nuevoDocentesRouter)
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
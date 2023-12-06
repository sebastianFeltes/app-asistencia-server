import express, { json, urlencoded } from "express";
import 'dotenv/config'
import cors from "cors"
import session from "express-session";
import alumnosRouter from "./routes/datos-alumnos.routes.js";
import loginRouter from "./routes/login.routes.js";
import nuevoAlumnoRouter from "./routes/alta-alumno.routes.js";
import qrRouter from "./routes/gestionQR.routes.js";
import nuevoDocentesRouter from "./routes/alta-docente.routes.js";
import docentesRouter from "./routes/datos-docentes.routes.js";
import cursosRouter from "./routes/datosCursos.routes.js";
import asistenciaRouter from "./routes/asistencia-alumnos.routes.js";
import nuevoCursoRouter from "./routes/alta-curso.routes.js";

//TODO: arreglar el alta de los cursos

const app = express();

const port = process.env.PORT;

app.use(cors());

app.use(json());

app.use(urlencoded());

app.set("trust proxy", 1);

app.use(
	session({
		secret: "black-cat",
		resave: true,
		saveUninitialized: true,
	})
	);
	
app.use(alumnosRouter);

app.use(loginRouter);

app.use(nuevoAlumnoRouter);

app.use(nuevoDocentesRouter);

app.use(qrRouter);

app.use(docentesRouter);

app.use(nuevoCursoRouter)
app.use(cursosRouter);

app.use(asistenciaRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

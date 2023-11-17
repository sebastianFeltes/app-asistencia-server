import { db } from "../database/conexion.database";
import { insertCurso } from "../database/queries.database";





export function tryAltaCurso(req, res) {
  console.log(req.body);
  const {
    nombre,
    id_docente,
    horario_incio,
    horario_final,
    dias,
    fecha_inicio,
    fecha_finalizacion,
  } = req.body;
  try {
    db.run(
      insertCurso,
      [
        nombre,
        id_docente,
        horario_incio,
        horario_final,
        dias,
        fecha_inicio,
        fecha_finalizacion,
      ],
      (err, rows) => {
        if (err) {
          console.log(err.message);
          return res
            .json({ mensaje: "no se pudo insertar el curso" })
            .status(400);
        }
        dias.map((e) => {
          db.all(
            "INSERT INTO rel_curso_dia (id_curso, id_dia) VALUES (?,?)",
            [id_curso, e],
            (err, rows) => {
              if (err) res.json({ mensaje: err.message });
                res.json({mensaje:"Curso cargado exitosamente!"})
            }
          );
        });
      }
    );
  } catch (error) {
    console.log("error");
    console.log(error);
    return res.json({ mensaje: "error en el servidor" }).status(500);
  }
}

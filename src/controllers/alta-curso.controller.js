import { db } from "../database/conexion.database.js";
import { insertCurso, insertRelCursoDia } from "../database/queries.database.js";

export function tryAltaCurso(res, req) {
  try {
    const {
      nombre,
      id_docente,
      horario_incio,
      horario_final,
      activo,
      fecha_inicio,
      fecha_final,
      dias,
    } = req.body;
    db.run(
      insertCurso,
      [
        nombre,
        id_docente,
        horario_incio,
        horario_final,
        activo,
        fecha_inicio,
        fecha_final,
      ],
      (err, rows) => {
        if (err) {
          console.log(err.message);
          return res.json({ mensaje: err.message });
        } else {
          db.all("SELECT MAX(id_curso) AS id FROM cursos", (err, rows) => {
            if (err) {
              console.log(err);
              return res.json({ mensaje: err.message });
            } else {
              dias.map((e) => {
                db.run(insertRelCursoDia, [rows.id, e], (err, rows) => {
                  if (err) {
                    console.log(err);
                    return res.json({
                      mensaje: "Error al cargar datos del curso",
                    });
                  }else{
                    return
                  }
                });
              });
              return res.json({ mensaje: "Curso cargado a la base de datos" });
            }
          });
        }
      }
    );
  } catch (error) {
    if (error) {
      console.log(error);
      res.json({ mensaje: error.message });
    }
  }
}

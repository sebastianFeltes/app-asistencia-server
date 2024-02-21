import { db } from "../database/conexion.database.js";
import {
  selectCursos,
  updateCursos,
  selectDias,
  selectDataCursoById,
  selectDiasByCursoId,
  selectDiasCursos,
  eliminarRelCursoDia,
  insertRelCursoDia,
} from "../database/queries.database.js";

export function getDias(req, res) {
  try {
    db.all(selectDias, (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ message: err.message });
      }
      /* console.log(rows);  */
      return res.json(rows);
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message });
  }
}
export function getCursos(req, res) {
  const { docente_id, docente_rol } = req.session;
  try {
    db.all(selectCursos, (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ message: err.message });
      }
      // console.log(rows);
      db.all(selectDiasCursos, (err, dayRows) => {
        if (err) {
          console.log(err);
          return res.json({ message: err.message });
        }
        const data = { dataCursos: rows, dias: dayRows };
        //console.log(data);
        return res.json(data);
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message });
  }
}

export function modificarCursos(req, res) {
  const {
    id_curso,
    nombre,
    horario_inicio,
    horario_final,
    id_docente,
    fecha_inicio,
    fecha_final,
    activo,
    id_dia,
    horas_catedra,
    cantidad_clases,
    cantidad_inasistencias
  } = req.body;
  const { docente_id, docente_rol } = req.session;

  try {
    console.log(req.body);
    db.all(
      updateCursos,
      [
        nombre,
        id_docente,
        horario_inicio,
        horario_final,
        activo,
        fecha_inicio,
        fecha_final,
        horas_catedra,
        cantidad_clases,
        cantidad_inasistencias,
        id_curso,
      ],
      (err, rows) => {
        if (err) {
          //error del servidor
          console.log(err);
          return res.json({ message: err.message }).status(500);
        } else {
          return res.json({message:"Curso modificado"})
          /* i d_dia.map((e) => {
            db.run(eliminarRelCursoDia, [id_curso], (err) => {
              if (err) {
                console.log(err);
                return res.json({ mensaje: "Error al modificar días" });
              } else {
                db.run(insertRelCursoDia, [id_curso, e], (err, rows) => {
                  if (err) {
                    console.log(err);
                    return res.json({
                      mensaje: "Error al cargar datos del curso",
                    });
                  }
                  return res.json({ message: "Curso modificado" }).status(200);
                });
              }
            });
          }); */
        }
      }
    );
  } catch (error) {
    return res.json({ mensaje: error.message }).status(500);
  }
}

export function getCurso(req, res) {
  const id_curso = req.params.id;

  try {
    db.all(selectDataCursoById, [id_curso], (err, row) => {
      if (err) {
        console.log(err);
        return res.json({ mensaje: err.message }).status(500);
      } else {
        db.all(selectDiasByCursoId, [id_curso], (err, rows) => {
          if (err) {
            console.log(err);
            return res.json({ mensaje: err.message }).status(500);
          }
          return res.json({ data: row[0], dias: rows });
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({ mensaje: error.message }).status(500);
  }
}

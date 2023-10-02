import {
  selectAsistencia,
  updatetAsistAlumno,
} from "../database/queries.database.js";

import { db } from "../database/conexion.database.js";
export function modificarAsistencia(req, res) {
  const  id_asistencia  = req.params.id_asistencia;
  console.log(id_asistencia)
  try {
    db.all(updatetAsistAlumno, [id_asistencia], (err, rows) => {
      if (err) res.json({ message: err.message });
      res.json({message:"asistencia modificada"});
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message }).status(500);
  }
}

export function getAsistencia(req, res) {
  try {
    db.all(selectAsistencia, (err, rows) => {
      if (err) res.json({ message: err.message });
      res.json(rows);
    });
  } catch (error) {
    if (error) {
      console.log(err.message);
      return res.json({ message: error.message });
    }
  }
}

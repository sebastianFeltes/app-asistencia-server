import { db } from "../database/conexion.database.js";
import { mostrarCursos } from "../database/queries.database.js";

export function mosCursos(req, res) {
    const { docente_id, docente_rol } = req.session;
    try {
      if (true) {
        db.all(mostrarCursos, (err, rows) => {
          if (err) {
            console.log(err);
            return res.json({ message: err.message });
          }
          console.log(rows);
          return res.json(rows);
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.json({ message: error.message });
    }
  }
  
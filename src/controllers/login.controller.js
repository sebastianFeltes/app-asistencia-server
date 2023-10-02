import { db } from "../database/conexion.database.js";
import { selectDocentePorDni } from "../database/queries.database.js";
import bcrypt from "bcrypt";

export function tryLogin(req, res) {
  const { nro_dni, password } = req.body;
  console.log(req.body);
  try {
    db.all(selectDocentePorDni, [nro_dni], (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ message: err.message }).status(500);
      }
      if (rows.lenght == 0) {
        console.log(rows);
        return res.json({ message: "dni inválido" }).status(400);
      }
      const dbPassword = rows[0].password;

      const match = bcrypt.compare(password, dbPassword);

      if (match) {
        req.session.id_docente = rows[0].id_docente;
        req.session.nombre = rows[0].nombre;
        req.session.tipo_dni = rows[0].tipo_dni;
        req.session.nro_dni = rows[0].nro_dni;
        req.session.id_rol = rows[0].id_rol;
        req.session.apellido = rows[0].apellido;

        const userData = {
          id_docente: rows[0].id_docente,
          nombre: rows[0].nombre,
          tipo_dni: rows[0].tipo_dni,
          nro_dni: rows[0].nro_dni,
          id_rol: rows[0].id_rol,
          apellido: rows[0].apellido,
        };
        console.log(req.session);
        return res.json(userData).status(200);
      } else {
        return res.json({ message: "contraseña inválida!" }).status(400);
      }
    });
  } catch (error) {
    return json({ message: error.message }).status(500);
  }
}

import {db} from "../database/conexion.database.js";
import {selectDocente} from "../database/queries.database.js";
import bcrypt from "bcrypt";

export function tryLogin(req, res) {
  const { nro_dni, password } = req.body;
  try {
    db.all(selectDocente, [nro_dni], (err, rows) => {
      if (err) {
        console.log(err);
        return res.json({ message: err.message }).status(500);
      }
      if (rows.lenght == 0) {
        return res.json({ message: "dni inválido" }).status(400);
      }
      const dbPassword = rows[0].password;

      const match = bcrypt.compare(password, dbPassword);

      if (match) {
        return res.json({ message: "loggeado" }).status(200);
      } else {
        return res.json({ message: "contraseña inválida!" }).status(400);
      }
    });
  } catch (error) {
    return json({ message: error.message }).status(500);
  }
}
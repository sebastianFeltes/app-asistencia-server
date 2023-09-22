/* import { restart } from "nodemon"; */
import { db } from "../database/conexion.database.js";
import { insertDetalleDocentes, insertDocentes, selectDocente } from "../database/queries.database.js";

/* const data = {
    nombre: "sebastian"
} */
export function tryAltaDocente(req, res) {


}
export function getDocentes(req, res) {
    try {
        db.all(selectDocente, (err, rows) => {
            if (err) {
                console.log(err.message);
                return res.json({ mensaje: err.message }).status(500)
            }
            return res.json(rows).status(200)
        })

    } catch (error) {
        return res.json({ mensaje: error.message }).status(500)
    }
}

export function altaDocentes(req, res) {
    const { nombre, tipo_dni, nro_dni, nro_legajo, id_rol, password, apellido, activo,
        direccion, localidad, car_telefono, telefono, car_tel_extra, telefono_extra, email } = req.body;
    try {
        db.all(insertDocentes, [nombre, tipo_dni, nro_dni, nro_legajo, id_rol, password, apellido, activo], (err, rows) => {
            if (err) {
                console.log(err.message);
                return res.json({ mensaje: err.message }).status(500)
            }
            return
        })

        db.all("SELECT MAX(id_docente) as id FROM docentes", (err, row) => {
            if (err) console.log(err.message)
            console.log(row[0].id)
            let id_docente = row[0].id
            db.all(insertDetalleDocentes, [id_docente, direccion, localidad, car_telefono, telefono, car_tel_extra, telefono_extra, email], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    return res.json({ mensaje: err.message }).status(500)
                }
            })

        });



        return res.json({ message: "alta docente!" }).status(200)
    } catch (error) {
        return res.json({ message: error.message }).status(500);
    }
}
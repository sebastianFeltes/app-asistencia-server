
import bcrypt from "bcrypt"
import { db } from "../database/conexion.database.js";
import { insertDetalleDocentes, insertDocentes, selectDocenteDetalleDocente } from "../database/queries.database.js";

export function getDocentes(req, res) {
    try {
        db.all(selectDocenteDetalleDocente, (err, rows) => {
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
//TODO: preguntar por el Nro del legajo?

export function altaDocentes(req, res) {
    console.log(req.body)
    const { nombre, tipo_dni, nro_dni, id_rol, password, apellido, activo,
        direccion, localidad, car_telefono, telefono, car_tel_extra, telefono_extra, email } = req.body;
    const { docente_id, docente_rol } = req.session;
    try {
        if (docente_rol>=2) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            db.all(insertDocentes, [nombre, tipo_dni, nro_dni, id_rol, hash, apellido, activo], (err, rows) => {
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


            return res.json({ message: "Docente cargado en la base de datos" }).status(200)
        } else{
            return res.json({message: "Permisos insuficientes"}).status(403)
        }
    }
    catch (error) {
        return res.json({ message: error.message }).status(500);
    }
}
import { db } from "../database/conexion.database.js";
import { selectDocentes, updateDetalleDocente, updateDocente } from "../database/queries.database.js";
import bcrypt from "bcrypt"

export function modificarDocente(req, res) {
  const {
    id_docente,
    activo,
    nombre,
    apellido,
    tipo_dni,
    nro_dni,
    car_telefono,
    telefono,
    direccion,
    email,
    fecha_nac,
    nro_legajo,
    localidad,
    id_rol,
  } = req.body;
  try {
    db.all(updateDocente, [nombre , tipo_dni , nro_dni, nro_legajo , id_rol , apellido , activo , fecha_nac, id_docente],(err)=>{
        if(err){
            console.log(err.message)
            return res.json({message:err.message}).status(500)
        }
        return res.json({message:"docente modificado"}).status(200)    })
        db.all(updateDetalleDocente,[direccion , localidad , car_telefono , telefono, email, id_docente])
  } catch (error) {
    console.log(error.message)
    return res.json({message:error.message}).status(400)
  }
}

export function getDocentes(req, res) {
  try {
    db.all(selectDocentes, (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.json({ mensaje: err.message }).status(500);
      }
      return res.json(rows).status(200);
    });
  } catch (error) {
    return res.json({ mensaje: error.message }).status(500);
  }
}

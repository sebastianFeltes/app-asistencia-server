import { db } from "../database/conexion.database.js";
import {
  buscarAlumno,
  insertAlumno,
  insertDetalleAlumno,
  mostrarCursos,
} from "../database/queries.database.js";

//TODO:FUNCION INSERTAR UN NUEVO ALUMNO
export function tryAltaAlumno(req, res) {
  console.log(req.body);
  const {
    tipo_dni,
    nro_dni,
    nro_legajo,
    nombre,
    apellido,
    direccion,
    localidad,
    fecha_nac,
    car_telefono,
    telefono,
    car_tel_extra,
    telefono_extra,
    email,
    fotoc_dni,
    fotoc_analitico,
    planilla_ins,
    cursos
  } = req.body;
  /*  const {docente_id, docente_rol} = req.body;

  try {
    if(true){

    }
    
  } catch (error) {
    
  }
 */

  //TODO:DB (INSERTAR NUEVO ALUMNO)
  try {
    db.run(
      insertAlumno,
      [tipo_dni,nro_dni, nro_legajo, nombre, apellido,fecha_nac],
      (err, rows) => {
        if (err) {
          console.log(err.message);
          return res
            .json({ mensaje: "No pudo insertar el alumno" })
            .status(400);
        }

        //AUTOCOMPLETAR id del alumno
        db.all("SELECT MAX(id_alumno) AS id FROM alumnos", (err, rows) => {
          if (err) {
            return console.log(err.message);
          }
          let alumno_id = rows[0].id;
          //TODO:DB "detalle_alumnos"
          db.run(
            insertDetalleAlumno,
            [
              alumno_id,
              direccion,
              localidad,
              car_telefono,
              telefono,
              car_tel_extra,
              telefono_extra,
              email,
              fotoc_dni,
              fotoc_analitico,
              planilla_ins,
            ],
            (err, rows) => {
              if (err) {
                console.log(err.message);
                return res
                  .json({ mensaje: "No pudo insertar detalle del alumno" })
                  .status(400);
              }
              cursos.map((e) => {
                db.all(
                  "INSERT INTO rel_curso_alumnos (id_alumno, id_curso) VALUES (?,?)",
                  [alumno_id, e],
                  (err, rows) => {
                    if (err) res.json({ mensaje: err.message });
                  }
                );
              });

              return res.json("recibido").status(200);
            }
            
          );
        });
      }
    );
  } catch (error) {
    return res.json({ mensaje: "error en el servidor" }).status(500);
  }
}

//TODO:FUNCION BUSCAR ALUMNOS CON EL nro_dni
export function traerAlumno(req, res) {
  const nro_dni = req.params.nro_dni;
  try {
    db.all(buscarAlumno, [nro_dni], (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.json({ mensaje: err.message }).status(500);
      }
      return res.json(rows[0]).status(200);
    });
  } catch (error) {
    return res.json(rows).status(500);
  }
}

//TODO:FUNCION TRAER CURSOS

export function buscarCurso(req, res) {
  try {
    db.all(mostrarCursos, (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.json({ mensaje: err.message }).status(500);
      }
      return res.json(rows).status(200);
    });
  } catch (error) {
    return res.json({ mensaje: err.message }).status(500);
  }
}

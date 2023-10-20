import { db } from "../database/conexion.database.js";
import {
  buscarAlumno,
  insertAlumno,
  insertDetalleAlumno,
  insertIdRel,
  mostrarCursos,
} from "../database/queries.database.js";


//FUNCION INSERTAR UN NUEVO ALUMNO
export function tryAltaAlumno(req, res) {
  console.log(req.body)
  const {
    tipoDoc,
    dni,
    numLegajo,
    nombre,
    apellido,
    direccion,
    localidad,
    telCar,
    tel,
    telCarExt,
    telExt,
    email,
    documentacionDni,
    documentacionAnalitico,
    documentacionPlanilla,
    cursos
  } = req.body;
  /*  const {docente_id, docente_rol} = req.body;

  try {
    if(true){

    }
    
  } catch (error) {
    
  }
 */
  //DB (INSERTAR NUEVO ALUMNO)
  try {
    db.run(
      insertAlumno,
      [tipoDoc, dni, numLegajo, nombre, apellido],
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

          //DB "detalle_alumnos"
          db.run(
            insertDetalleAlumno,
            [
              alumno_id,
              direccion,
              localidad,
              telCar,
              tel,
              telCarExt,
              telExt,
              email,
              documentacionDni,
              documentacionAnalitico,
              documentacionPlanilla,
            ],
            (err, rows) => {
              if (err) {
                console.log(err.message);
                return res
                  .json({ mensaje: "No pudo insertar detalle del alumno" })
                  .status(400);
              }
              /* db.all(
                "SELECT MAX(id_relacion) FROM rel_curso_alumnos",
                (err, rows) => {
                  if (err) {
                    return console.log(err.message);
                  }
                  let relacion_id = rows[0].id_relacion;

                  db.run(insertIdRel, [relacion_id, alumno_id,], (err, rows) => {
                    if (err) {
                      console.log(err.message);
                      return res.json({
                          mensaje: "No pudo insertar relacion",
                        })
                        .status(400);
                    }
                  });
                }
              ); */
              cursos.map(e=>{
                db.all("INSERT INTO rel_curso_alumnos (id_alumno, id_curso) VALUES (?,?)", [alumno_id, e],(err,rows)=>{
                  if(err)res.json({mensaje: err.message})
  
                })
              })
              
              return res.json("recibido").status(200);
            }
          );
        });
      }
    );
  } catch (error) {
    return res.json(rows).status(500);
  }
}

//FUNCION BUSCAR ALUMNOS
export function traerAlumno(req, res) {
  const nro_dni = req.params.nro_dni;
  try {
    db.all(buscarAlumno, [nro_dni], (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.json({ mensaje: err.message }).status(500);
      }
      console.log(rows[0]);
      return res.json(rows[0]).status(200);
    });
  } catch (error) {
    return res.json(rows).status(500);
  }
}

//FUNCION TRAER CURSOS

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

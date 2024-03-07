import { db } from "../database/conexion.database.js";
import {
  selectAlumnos,
  updateAlumnos,
  updateDetalleAlumnos,
} from "../database/queries.database.js";

/* export async function datosAlumnos(req, res) {
  const { docente_id, docente_rol } = req.session;
  try {
    db.all(selectAlumnos, (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.json({ mensaje: err.message }).status(500);
      }
     
      const dataAlumnos = [];
      rows.map((alumno) => {
        const id_alumno = alumno.id_alumno;
        db.get(
          "SELECT CUR.id_curso AS id_curso, CUR.nombre AS nombre_curso FROM cursos CUR INNER JOIN rel_curso_alumnos RCL ON RCL.id_curso = CUR.id_curso WHERE RCL.id_alumno = ?",
          id_alumno,
          (err, row) => {
            if (err) {
              console.log(err.message);
              return res.json({ mensaje: err.message }).status(500);
            }
            row ? console.log(row) : false;
            dataAlumnos.push({ datos_alumno: alumno, cursos: row });
          }
        );
      });
      console.log(dataAlumnos);
      return res.json(dataAlumnos).status(200);
    });
  } catch (error) {
    return res.json({ mensaje: err.message }).status(500);
  }
} */

export async function datosAlumnos(req, res) {
  const { docente_id, docente_rol } = req.session;
  try {
    db.all(selectAlumnos, async (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ mensaje: err.message });
      }

      try {
        const dataAlumnos = await Promise.all(
          rows.map(async (alumno) => {
            const cursos = await getCursosAlumno(alumno.id_alumno);
            return { ...alumno, cursos };
          })
        );

        // console.log(dataAlumnos);
        return res.status(200).json(dataAlumnos);
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ mensaje: "Error al obtener datos de los alumnos" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mensaje: "Error al obtener datos de los alumnos" });
  }
}

async function getCursosAlumno(id_alumno) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT CUR.nombre AS nombre_curso, CUR.id_curso AS id_curso FROM cursos CUR INNER JOIN rel_curso_alumnos RCA ON RCA.id_curso = CUR.id_curso WHERE RCA.id_alumno = ?",
      [id_alumno],
      (err, rows) => {
        if (err) {
          console.log(err);
          reject("Error al buscar los cursos por alumno");
        } else {
          resolve(rows);
        }
      }
    );
  });
}

export function modificarDatosAlumno(req, res) {
  //console.log("controller");
  //console.log(req.body);
  const {
    activo,
    nombre,
    apellido,
    tipo_dni,
    nro_dni,
    fecha_nac,
    car_telefono,
    telefono,
    direccion,
    email,
    nro_legajo,
    localidad,
    car_tel_extra,
    telefono_extra,
    lugar_nacimiento,
    nacionalidad,
    fotoc_analitico,
    fotoc_dni,
    planilla_ins,
    id_alumno,
    cursos,
  } = req.body;
  try {
    db.all(
      updateAlumnos,
      [
        tipo_dni,
        nro_dni,
        nro_legajo,
        nombre,
        apellido,
        activo,
        fecha_nac,
        id_alumno,
      ],
      (err, rows) => {
        if (err) {
          //error del servidor
          console.log("1st query");
          console.log(err);
          return res.json({ message: err.message }).status(500);
        }
        db.all(
          updateDetalleAlumnos,
          [
            direccion,
            localidad,
            car_telefono,
            telefono,
            car_tel_extra,
            telefono_extra,
            email,
            lugar_nacimiento,
            nacionalidad,
            fotoc_dni,
            fotoc_analitico,
            planilla_ins,
            id_alumno,
          ],
          (err) => {
            if (err) {
              console.log(err);
              return res.json({ message: err.message }).status(500);
            }
            // console.log(cursos);
            db.all(
              "DELETE FROM rel_curso_alumnos WHERE id_alumno = ?",
              [id_alumno],
              (err, row) => {
                if (err) {
                  console.log(err);
                  return res.json(err.message);
                }
                // console.log(row);
              }
            );
            cursos.map((curso) => {
              db.all(
                "INSERT INTO rel_curso_alumnos (id_alumno, id_curso) VALUES (?,?)",
                [id_alumno, curso],
                (err) => {
                  if (err) {
                    console.log(err);
                    return res.json(err.message);
                  }
                }
              );
            });
            return res.json({ message: "alumno modificado" });
            //console.log("response")
          }
        );
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.json({ message: error.message });
  }
}

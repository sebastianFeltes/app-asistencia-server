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
  const page = parseInt(req.query.page) || 1; // Página actual
  const size = parseInt(req.query.size) || 10; // Tamaño de página (número de alumnos por página)
  const offset = (page - 1) * size; // Cálculo del OFFSET

  try {
    // Consulta para obtener la cantidad total de alumnos (para paginación)
    const totalAlumnosQuery = "SELECT COUNT(*) AS count FROM alumnos";
    const totalAlumnos = await new Promise((resolve, reject) => {
      db.get(totalAlumnosQuery, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row.count);
      });
    });

    // Consulta para obtener los alumnos de la página actual
    const selectAlumnos = `SELECT * FROM alumnos AL INNER JOIN detalle_alumnos DAL ON AL.id_alumno = DAL.id_alumno LIMIT ? OFFSET ?`;
    db.all(selectAlumnos, [size, offset], async (err, rows) => {
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
        // console.log(res);
        return res.status(200).json({
          total: totalAlumnos, // Total de alumnos en la base de datos
          page,
          size,
          totalPages: Math.ceil(totalAlumnos / size), // Número total de páginas
          data: dataAlumnos,
        });
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
          // console.log("1st query");
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
            // console.log(id_alumno);
            //MODIFICAR CURSOS A LOS QUE ASISTE
            /* cursos.map((curso) => {
              //mapea los id de los cursos que vienen del cliente
              db.all(
                //busca todos los cursos del alumno y compara con los que vienen
                "SELECT id_relacion FROM rel_curso_alumnos WHERE id_alumno = ?",
                [id_alumno],
                (err, rows) => {
                  if (err) throw err.message;
                  // console.log("linea 183");
                  console.log(rows[0]);
                  const id_relacion = rows[0]; //si no existe relacion (o sea que no el alumno no esta asignado a ese curso)
                  if (!id_relacion) {
                    let ultima_relacion = undefined;
                    db.all(
                      "SELECT MAX(id_relacion) AS last_id FROM rel_curso_alumnos",
                      (err, row) => {
                        if (err) throw err.message;
                        console.log("linea 190");
                        ultima_relacion = row[0].last_id;
                      }
                    );
                    db.all(
                      "INSERT INTO rel_curso_alumnos VALUES (?+1,?,?)", //inserta la relacion
                      [ultima_relacion, id_alumno, curso],
                      (err) => {
                        if (err) throw err.message;
                      }
                    );
                  }
                  // rows;
                }
              );
            }); */
            return res.json({
              message: "alumno modificado, sin eliminacion de curso",
            });
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

export async function enviarRegistroAsistencia(req, res) {
  try {
    db.all(
      `SELECT ASIS.fecha AS fecha, ASIS.hora AS hora, ASIS.cod_asistencia AS cod_asistencia,
      ALU.apellido AS apellido_alumno, ALU.nombre AS nombre_alumno, ALU.nro_dni AS dni_alumno FROM asistencia ASIS
    INNER JOIN rel_curso_alumnos RCA ON ASIS.id_rel_curso_alumno = RCA.id_relacion
    INNER JOIN alumnos ALU ON RCA.id_alumno = ALU.id_alumno;
    `,
      (err, row) => {
        if (err) throw err.message;
        const asistencias = row;
        return res.json(asistencias);
      }
    );
  } catch (error) {
    console.log(error);
    return res.json({ error: "Internal server error" });
  }
}

export async function eliminarAlumno(req, res) {
  const { id_alumno } = req.params;

  if (!id_alumno) {
    return res.json({ error: "Alumno no encontrado" });
  }

  try {
    // Iniciar una transacción para asegurar la integridad de los datos
    await db.run("BEGIN TRANSACTION");

    // Eliminar registros de asistencia
    await db.run(
      `
      DELETE FROM asistencia
      WHERE id_rel_curso_alumno IN (
        SELECT id_relacion
        FROM rel_curso_alumnos
        WHERE id_alumno = ?
      )
    `,
      [id_alumno]
    );

    // Eliminar registros de rel_curso_alumno
    await db.run("DELETE FROM rel_curso_alumnos WHERE id_alumno = ?", [
      id_alumno,
    ]);

    // Eliminar registros de detalle_alumnos
    await db.run("DELETE FROM detalle_alumnos WHERE id_alumno = ?", [
      id_alumno,
    ]);

    // Eliminar el alumno
    await db.run("DELETE FROM alumnos WHERE id_alumno = ?", [id_alumno]);

    // Confirmar la transacción
    await db.run("COMMIT");

    return res.json({
      success:
        "Alumno y todos sus registros asociados han sido eliminados correctamente",
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await db.run("ROLLBACK");
    console.error("Error en el controlador eliminarAlumno:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function buscarAlumnosController(req, res) {
  const { query } = req.query;
  // console.log(query);

  if (!query) {
    return res.status(400).json({ error: "Consulta requerida" });
  }
  // Consulta para obtener la cantidad total de alumnos (para paginación)
  const totalAlumnosQuery = "SELECT COUNT(*) AS count FROM alumnos";
  const totalAlumnos = await new Promise((resolve, reject) => {
    db.get(totalAlumnosQuery, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row.count);
    });
  });
  try {
    const selectAlumnos = `SELECT * FROM alumnos AL INNER JOIN detalle_alumnos DAL ON AL.id_alumno = DAL.id_alumno WHERE AL.apellido LIKE ? OR AL.nombre LIKE ? OR AL.nro_legajo LIKE ? OR AL.nro_dni LIKE ?`;
    db.all(
      selectAlumnos,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`],
      async (err, rows) => {
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
          // console.log(res);
          return res.status(200).json({
            total: totalAlumnos, // Total de alumnos en la base de datos
            data: dataAlumnos,
          });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ mensaje: "Error al obtener datos de los alumnos" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mensaje: "Error al obtener datos de los alumnos" });
  }
}

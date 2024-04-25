import { db } from "../database/conexion.database.js";
import {
  insertAsistencia,
  selectAlumnoPorId,
  selectAsistenciaByIdRelacion,
} from "../database/queries.database.js";
import util from "util";
const dbGet = util.promisify(db.get.bind(db));
const dbAll = util.promisify(db.all.bind(db));

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
  const año = fecha.getFullYear();

  // Asegurarse de tener dos dígitos para el día y el mes (agregando un 0 al inicio si es necesario)
  const diaFormato = dia < 10 ? `0${dia}` : dia;
  const mesFormato = mes < 10 ? `0${mes}` : mes;

  // Formatear la fecha como dd/mm/aaaa
  const fechaFormateada = `${diaFormato}-${mesFormato}-${año}`;
  return fechaFormateada;
}

function obtenerHoraActual() {
  const fecha = new Date();
  const horas = fecha.getHours();
  const minutos = fecha.getMinutes();
  const segundos = fecha.getSeconds();

  // Asegurarse de tener dos dígitos para las horas, minutos y segundos (agregando un 0 al inicio si es necesario)
  const horasFormato = horas < 10 ? `0${horas}` : horas;
  const minutosFormato = minutos < 10 ? `0${minutos}` : minutos;
  const segundosFormato = segundos < 10 ? `0${segundos}` : segundos;

  // Formatear la hora como hh:mm:ss
  const horaFormateada = `${horasFormato}:${minutosFormato}:${segundosFormato}`;

  return horaFormateada;
}

function calcularCodigoAsistencia(horarioIngreso, horaActual) {
  const partesTiempo = horarioIngreso.split(":");
  const horas = parseInt(partesTiempo[0]);
  const minutos = parseInt(partesTiempo[1]);

  const horaIngresoEnMinutos = horas * 60 + minutos;

  const partesHoraActual = horaActual.split(":");
  const horasActuales = parseInt(partesHoraActual[0]);
  const minutosActuales = parseInt(partesHoraActual[1]);
  const horaActualEnMinutos = horasActuales * 60 + minutosActuales;

  const diferenciaEnMinutos = Math.abs(
    horaActualEnMinutos - horaIngresoEnMinutos
  );
  /*   console.log("diferencia en minutos");
  console.log(diferenciaEnMinutos); */

  if (diferenciaEnMinutos <= 30) {
    return 1; // Presente si la diferencia es menor o igual a 30 minutos y la hora actual es mayor o igual a la hora de ingreso
  } else if (diferenciaEnMinutos >= 30 && diferenciaEnMinutos < 60) {
    return 2; // Tardanza si la diferencia está entre 30 y 59 minutos
  } /* else if (diferenciaEnMinutos >= 60 && diferenciaEnMinutos <= 120) {
    return 3; // Media falta si la diferencia está entre 60 y 120 minutos
  } */ else {
    return 4; // Ausencia sin justificar si la diferencia es mayor a 120 minutos
  }
}

export async function marcarPresente(req, res) {
  try {
    const id_alumno = req.params.id; //primero obtengo el id que viene en la url
    let relaciones = await buscarRelacionDeAlumnoPorId(id_alumno); //buscar las todas las relaciones del alumno con los cursos
    // console.log("relaciones");
    // console.log(relaciones);
    if (relaciones.length > 0) {
      return relaciones.forEach(async (relacion) => {
        //por cada curso que encuentre...
        const id_curso = relacion.id_curso;
        const id_relacion = relacion.id_relacion;
        const id_alumno = relacion.id_alumno;
        const date = new Date();
        const nroDiaActual = date.getDay();
        const horaActual = obtenerHoraActual();
        const fechaActual = obtenerFechaActual();
        console.log(relacion);
        console.log(id_curso, nroDiaActual, horaActual);

        const curso = await dbGet(
          //busco los datos del curso dependiendo del numero del día y el id del curso en las relaciones del alumno
          `
        SELECT CUR.*
        FROM cursos CUR
        INNER JOIN rel_curso_dia RCD ON CUR.id_curso = RCD.id_curso
        WHERE CUR.id_curso = ? 
        AND RCD.id_dia  = ?
        AND ? BETWEEN time(CUR.horario_inicio, '-30 minutes') AND time(CUR.horario_final);
        `,
          [id_curso, nroDiaActual, horaActual]
        );
        // console.log("curso linea 100");
        // console.log(curso);

        const cod_asistencia = curso
          ? calcularCodigoAsistencia(curso.horario_inicio, horaActual)
          : null;

        // console.log("linea 105");
        // console.log(curso, id_relacion, id_curso);

        if (curso) {
          //ESTRUCTURA QUE ESPERA EL CLIENTE
          // data_alumno_curso: {
          //   apellido_alumno: "apellido",
          //   nombre_alumno: "nombre",
          //   dni_alumno: 12222333,
          //   nombre_curso: "curso al que ingresa",
          //   clases_totales: 10,
          // },
          // cantidad_inasistencias: 1,
          // hora_ingreso: "17:00:00",
          // cod_asistencia: { descripcion: "Tipo de asistencia" }

          //VERIFICAR SI LA ASISTENCIA YA SE CARGO
          let asistenciaCargada = await dbGet(
            `SELECT cod_asistencia, hora FROM asistencia WHERE id_rel_curso_alumno = ? AND fecha = ?`,
            [id_relacion, fechaActual]
          );

          //BUSCAR LOS DATOS DEL ALUMNO y CURSO
          let data_alumno_curso = await obtenerDatosAlumno(
            id_alumno,
            curso.id_curso
          );

          //OBTENER LAS INASISTENCIAS TOTALES
          let asistenciasTotales = await obtenerAsistenciasAlumno(id_alumno);

          //SI LA ASISTENCIA NO ESTA CARGADA HOY, EJECUTA  LA FUNCIÓN PARA INSERTARLA EN LA BASE DE DATOS
          if (!asistenciaCargada) {
            // console.log("linea 141");
            // console.log("cargar asistencia");
            // INSERTAR LA ASISTENCIA
            db.run(
              "INSERT INTO asistencia(id_rel_curso_alumno, fecha, cod_asistencia, hora) VALUES(?,?,?,?)",
              [id_relacion, fechaActual, cod_asistencia, horaActual]
            );

            const alumno = {
              data_alumno_curso: data_alumno_curso,
              cantidad_inasistencias: asistenciasTotales.cantidad_inasistencias,
              hora_ingreso: horaActual,
              cod_asistencia: {
                descripcion:
                  cod_asistencia == 1
                    ? "presente"
                    : cod_asistencia == 2
                    ? "tarde"
                    : "ausente",
              },
            };
            return res.json(alumno);
          } else {
            // console.log("asistencia ya cargada");
            //SI ESTA CARGADA MANDA QUE YA CARGÓ LA ASISTENCIA HOY
            // "Ud ya ha registrado la asistencia el día de hoy"
            // console.log(asistenciaCargada);
            const alumno = {
              data_alumno_curso: data_alumno_curso,
              cantidad_inasistencias: asistenciasTotales.cantidad_inasistencias,
              hora_ingreso: asistenciaCargada.hora,
              cod_asistencia: {
                re_scaned: true,
                descripcion:
                  asistenciaCargada.cod_asistencia == 1
                    ? "presente"
                    : asistenciaCargada.cod_asistencia == 2
                    ? "tarde"
                    : "ausente",
              },
            };
            return res.json(alumno);
          }
        }
      });
    } else {
      return res.json({ error: "Alumno no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Error al cargar el 'presente'" }).status(500);
  }
}

async function obtenerAsistenciasAlumno(id_alumno) {
  let data = await dbGet(
    `SELECT COUNT(ASI.cod_asistencia) AS cantidad_inasistencias FROM asistencia ASI
  INNER JOIN rel_curso_alumnos RCA ON RCA.id_relacion = ASI.id_rel_curso_alumno
  WHERE RCA.id_alumno = ? AND cod_asistencia = 4`,
    [id_alumno]
  );
  // console.log(data);
  return data;
}

async function obtenerDatosAlumno(id_alumno, id_curso) {
  let data = await dbGet(
    `SELECT ALU.nombre AS nombre_alumno, ALU.apellido AS apellido_alumno, ALU.nro_dni AS dni_alumno, 
    CUR.nombre AS nombre_curso, CUR.cantidad_clases AS clases_totales 
    FROM alumnos ALU 
    INNER JOIN rel_curso_alumnos RCA ON ALU.id_alumno = RCA.id_alumno 
    INNER JOIN cursos CUR ON CUR.id_curso = RCA.id_curso 
    WHERE RCA.id_alumno = ? AND RCA.id_curso = ?;`,
    [id_alumno, id_curso]
  );
  // console.log(data);
  return data;
}

async function buscarRelacionDeAlumnoPorId(id_alumno) {
  try {
    if (!id_alumno) return res.status(400).send("Falta el ID del alumno");

    const relaciones = await dbAll(
      "SELECT * FROM rel_curso_alumnos WHERE id_alumno = ?",
      [id_alumno]
    );
    // Puedes retornar las relaciones aquí para que estén disponibles para su uso en otra función
    return relaciones;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al buscar el alumno por ID");
  }
}

/* 
    db.all(selectAlumnoPorId, [id, horaActual], (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }
      // console.log(rows);
      //SI LO ENCUENTRA, CALCULA EL CÓDIGO
      if (rows[0]) {
        function calcularCodigoAsistencia() {
          //funcion que retorna el código dependiendo de la hora de marcaje

          const horarioIngreso = rows[0].horario_ingreso;

          // Dividir la cadena en horas, minutos y segundos
          const partesTiempo = horarioIngreso.split(":");
          const horas = parseInt(partesTiempo[0]);
          const minutos = parseInt(partesTiempo[1]);

          const horaIngresoEnMinutos = horas * 60 + minutos;
          const horaActual =
            new Date().getHours() * 60 + new Date().getMinutes();

          const diferenciaEnMinutos = horaActual - horaIngresoEnMinutos;
          // console.log(diferenciaEnMinutos);
          if (diferenciaEnMinutos <= 30) {
            return { codigo_asistencia: 1, descripcion: "PRESENTE" };
          } else if (diferenciaEnMinutos >= 30 && diferenciaEnMinutos < 60) {
            return { codigo_asistencia: 2, descripcion: "TARDE" };
          } else if (diferenciaEnMinutos >= 60 && diferenciaEnMinutos <= 120) {
            return { codigo_asistencia: 3, descripcion: "MEDIA FALTA" };
          } else {
            return { codigo_asistencia: 4, descripcion: "AUSENTE" };
          }
        }
        async function retornarInasistencias(id_relacion) {
          //funcion que retorna la cantidad de inasistencias basandose en el id de la relacion
          return new Promise((resolve, reject) => {
            db.all(
              "SELECT COUNT(id_asistencia) as cantidad FROM asistencia WHERE id_rel_curso_alumno = ? AND cod_asistencia = 4",
              [id_relacion],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  reject({ mensaje: err.message });
                } else {
                  if (rows.length > 0) {
                    resolve(rows[0].cantidad); // Resuelve con la cantidad de inasistencias
                  } else {
                    resolve(0); // Si no hay filas, la cantidad es cero
                  }
                }
              }
            );
          });
        }

        const codAsistencia = rows[0] ? calcularCodigoAsistencia() : false;
        const id_relacion = rows[0].id_relacion;
        const fechaActual = obtenerFechaActual();

        // console.log(codAsistencia, id_relacion, fechaActual);
        db.all(
          selectAsistenciaByIdRelacion,
          [id_relacion, fechaActual],
          (err, row) => {
            if (err) {
              console.log(err);
              return res.json({ mensaje: err.message });
            } else if (row.length > 0) {
              /*               console.log("linea 125")
              console.log(row)
              let detalle = {
                //creo el detalle de la asistencia si existe
                codigo_asistencia: 0,
                descripcion: "",
              };
              detalle.codigo_asistencia = row[0].cod_asistencia;
              db.all(
                "SELECT descripcion FROM cod_asistencia WHERE id_codigo = ?",
                [row[0].cod_asistencia],
                async (err, result) => {
                  if (err) {
                    console.log(err);
                    return res.json({ mensaje: err.message });
                  }
                  //console.log(result[0].descripcion.toUpperCase())
                  //return desc = await result[0].descripcion.toUpperCase();
                  detalle.descripcion = result[0].descripcion.toUpperCase();
                  const inasistencias = retornarInasistencias(id_relacion) // Reemplaza 123 con el ID de relación correcto
                    .then((cantidad) => {
                      //console.log(cantidad)
                      return cantidad;
                      // Aquí puedes realizar acciones con la cantidad de inasistencias obtenida
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                  return res.json({
                    data_alumno_curso: rows[0],
                    cod_asistencia: detalle,
                    hora_ingreso: row[0].hora,
                    detalle: "Ud ya ha registrado la asistencia el día de hoy",
                    cantidad_inasistencias: await inasistencias,
                  });
                }
              );
              //console.log(desc)
            } else {
              db.all(
                insertAsistencia,
                [
                  id_relacion,
                  fechaActualFormateada,
                  calcularCodigoAsistencia().codigo_asistencia,
                  horaActual,
                ],
                async (err) => {
                  if (err) {
                    console.log(err);
                    res.json({ message: err.message });
                  } else {
                    const inasistencias = retornarInasistencias(id_relacion) // Reemplaza 123 con el ID de relación correcto
                      .then((cantidad) => {
                        //console.log(cantidad)
                        return cantidad;
                        // Aquí puedes realizar acciones con la cantidad de inasistencias obtenida
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                    return res.json({
                      data_alumno_curso: rows[0],
                      cod_asistencia: codAsistencia,
                      hora_ingreso: horaActual,
                      cantidad_inasistencias: await inasistencias,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        res.json({ error: "Alumno no encontrado" }).status(404);
      }
    });
*/

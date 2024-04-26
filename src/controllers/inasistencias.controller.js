import cron from "node-cron";
import { db } from "../database/conexion.database.js";
import {
  insertAsistencia,
  selectAsistenciaByIdRelacion,
  selectCursoByDia,
  selectRelCursoAlumnos,
} from "../database/queries.database.js";
//funciones de get y all contra la base de datos
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

// Función para verificar si una fecha de consulta está entre las fechas de inicio y fin
function verificarFechaEnRango(fechaInicioStr, fechaFinStr, fechaConsultaStr) {
  // Función para convertir una cadena de fecha en un objeto Date en formato aaaa-mm-dd
  function parseDate(str) {
    const parts = str.split("-");
    // El mes en JavaScript es 0-indexado, por lo que no necesitamos restar 1 al mes
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  // Convierte las cadenas de fecha en objetos Date
  const fechaInicio = parseDate(fechaInicioStr);
  const fechaFin = parseDate(fechaFinStr);
  const fechaConsulta = parseDate(fechaConsultaStr);

  // Verifica si la fecha de consulta está entre la fecha de inicio y fin
  return fechaConsulta >= fechaInicio && fechaConsulta <= fechaFin;
}

/* function marcarAusentes(dias) {
  let diasCurso;
} */
// Esta función se debe ejecutar a las 12:30, 16:30 y 20:00 horas todos los días
export async function timer() {
  // db.all("", (err, rows) => {});
  const horarios = ["31 12 * * *", "31 16 * * *", "01 20 * * *"];
  // const horarios = ["02 16 * * *"];
  horarios.forEach((horario) => {
    cron.schedule(horario, async () => {
      //Primero obtengo el día actual
      // console.log("Timer activado.");
      //numero del dia
      const todayNum = new Date().getDay();
      //fecha actual
      const fechaActual = obtenerFechaActual();
      const horaActual = obtenerHoraActual();
      var partes = fechaActual.split("-");
      //formateo del dia
      const fechaActualConGuiones =
        partes[2] + "-" + partes[1] + "-" + partes[0];
      // console.log("timer func line 77");
      // console.log(todayNum);
      // console.log(fechaActualConGuiones);
      const fechaActualConGuionesDDMMAAAA =
        partes[0] + "-" + partes[1] + "-" + partes[2];
      //traigo los cursos para este dia y este horario
      const cursosDelDia = await dbAll(
        `SELECT CUR.id_curso FROM cursos CUR
      INNER JOIN rel_curso_dia RCD ON  CUR.id_curso = RCD.id_curso
      WHERE RCD.id_dia = ? AND ? BETWEEN CUR.horario_inicio AND CUR.horario_final
      AND ? BETWEEN CUR.fecha_inicio AND CUR.fecha_final;
      `,
        [todayNum, horaActual, fechaActualConGuiones]
      );
      // console.log(cursosDelDia);
      //recorro los cursos del dia y en esa hora
      cursosDelDia.forEach(async (curso) => {
        const id_curso = curso.id_curso;
        //traigo las realciones dependiendo del curso
        const relacionesAlumnos = await dbAll(
          `SELECT id_relacion FROM rel_curso_alumnos
        WHERE id_curso = ?`,
          [id_curso]
        );
        // console.log(id_curso);
        //recorro relacion por relacion para verificar en asistencias los que estan presentes
        relacionesAlumnos.forEach(async (relacion) => {
          const id_relacion = relacion.id_relacion;
          const presente = await dbGet(
            `SELECT id_rel_curso_alumno FROM asistencia
          WHERE id_rel_curso_alumno = ?
          AND fecha = ?`,
            [id_relacion, fechaActualConGuionesDDMMAAAA]
          );
          if (!presente) {
            db.run(
              `
            INSERT INTO asistencia (id_rel_curso_alumno,fecha, hora, cod_asistencia) VALUES(?,?,?,?)
            `,
              [id_relacion, fechaActualConGuionesDDMMAAAA, horaActual, 4]
            );
          }
          // console.log("presente");
          // console.log(presente);
          // console.log(fechaActualConGuionesDDMMAAAA);
          // console.log(id_relacion);
        });
      });
      return;

      //LLAMAR A MARCAR AUSENCIAS
    });
  });
}

function marcarAusencias() {
  db.all(selectCursoByDia, [today, horaActual, horaActual], (err, rows) => {
    if (err) {
      return console.log(err);
    }
    const cursos = rows;
    console.log("cursos line 88");
    console.log(rows);
    if (cursos.length > 0) {
      cursos.map((e) => {
        const id_curso = e.id_curso;
        const fechaInicio = e.fecha_inicio;
        const fechaFinal = e.fecha_final;

        var partes = fechaActual.split("-");
        const fechaActualModificada =
          partes[2] + "-" + partes[1] + "-" + partes[0];
        // console.log("map cursos line 100");
        // console.log(e);
        // console.log(fechaActualModificada);
        //VERIFICAR FECHA EN RANGO DE DIA DE INICIO Y FINAL DE CURSOS
        const verificacarFecha = verificarFechaEnRango(
          fechaInicio,
          fechaFinal,
          fechaActualModificada
        );

        console.log(verificacarFecha);

        if (verificacarFecha) {
          console.log("dentro de fechas");
          db.all(selectRelCursoAlumnos, [id_curso], (err, rows) => {
            if (err) {
              return console.log(err);
            }
            const relaciones = rows;
            console.log(relaciones);
            if (relaciones.length > 0) {
              relaciones.map((e) => {
                const id_relacion = e.id_relacion;
                db.all(
                  selectAsistenciaByIdRelacion,
                  [id_relacion, fechaActualConBarras],
                  (err, rows) => {
                    if (err) {
                      return console.log(err);
                    }
                    if (rows.length <= 0) {
                      db.all(
                        insertAsistencia,
                        [id_relacion, fechaActual, 4, horaActual],
                        (err, rows) => {
                          if (err) {
                            return console.log(err);
                          }
                        }
                      );
                    }
                  }
                );
              });
            }
          });
        }
      });
    }
  });
}

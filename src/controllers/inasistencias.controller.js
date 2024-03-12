import cron from "node-cron";
import { db } from "../database/conexion.database.js";
import {
  insertAsistencia,
  selectAsistenciaByIdRelacion,
  selectCursoByDia,
  selectRelCursoAlumnos,
} from "../database/queries.database.js";

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
// Esta función se ejecutará a las 19:00 horas todos los días
export function timer() {
  const horarios = ["30 12 * * *", "30 16 * * *", "00 19 * * *", "17 01 * * *"];
  horarios.forEach((horario) => {
    cron.schedule(horario, () => {
      // Lógica para ejecutar la función a las 19:00 horas de cada día
      //Primero obtengo el día actual
      const today = new Date().getDay();
      const fechaActual = obtenerFechaActual();
      const horaActual = obtenerHoraActual();
      var partes = fechaActual.split("-");
      const fechaActualConBarras =
        partes[0] + "/" + partes[1] + "/" + partes[2];
      console.log("timer func line 77");
      console.log(fechaActualConBarras);

      //Luego, dependiendo del día ejecuto la funcion que pone "ausentes" en los cursos de esos días
      //SELECCIONAR LOS CURSOS QUE SE DICTAN EL DIA ACTUAL (lun, mar, mie, etc)
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
            console.log("map cursos line 100");
            console.log(e);
            console.log(fechaActualModificada);
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

      // Llama a la función para marcar ausentes aquí
      //marcarAusentes();
    });
  });
}

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
  // Función para convertir una cadena de fecha en un objeto Date en formato dd-mm-aaaa
  function parseDate(str) {
    const parts = str.split("-");
    // El mes en JavaScript es 0-indexado, por lo que se resta 1 al mes
    return new Date(parts[2], parts[1] - 1, parts[0]);
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
  const horarios = ["30 12 * * *", "30 16 * * *", "00 19 * * *"];
  horarios.forEach((horario) => {
    cron.schedule(horario, () => {
      // Lógica para ejecutar la función a las 19:00 horas de cada día
      //Primero obtengo el día actual
      const today = new Date().getDay();
      const fechaActual = obtenerFechaActual();
      const horaActual = obtenerHoraActual();

      /* 
    console.log(today);
    console.log(horaActual); */
      //Luego, dependiendo del día ejecuto la funcion que pone "ausentes" en los cursos de esos días
      //SELECCIONAR LOS CURSOS QUE SE DICTAN EL DIA ACTUAL (lun, mar, mie, etc)
      db.all(selectCursoByDia, [today, horaActual, horaActual], (err, rows) => {
        if (err) {
          return console.log(err);
        }
        // console.log("cron con cursos del jueves");
        /*       console.log(fechaActual);
      console.log(today);
      */
        // console.log(rows);
        const cursos = rows;

        if (cursos.length > 0) {
          cursos.map((e) => {
            const id_curso = e.id_curso;
            const fechaInicio = e.fecha_inicio;
            const fechaFinal = e.fecha_final;
/*             console.log(e);
            console.log(fechaActual); */

            var partes = fechaActual.split("-");
            const fechaActualModificada =
              partes[2] + "-" + partes[1] + "-" + partes[0];
            //VERIFICAR FECHA EN RANGO DE DIA DE INICIO Y FINAL DE CURSOS
            const verificacarFecha = verificarFechaEnRango(
              fechaInicio,
              fechaFinal,
              fechaActualModificada
            );

            if (verificacarFecha) {
              db.all(selectRelCursoAlumnos, [id_curso], (err, rows) => {
                if (err) {
                  return console.log(err);
                }
                const relaciones = rows;
                if (relaciones.length > 0) {
                  relaciones.map((e) => {
                    const id_relacion = e.id_relacion;
                    db.all(
                      selectAsistenciaByIdRelacion,
                      [id_relacion, fechaActual],
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
                              // console.log("insert inasistencia");
                              // console.log(id_relacion)
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
        //console.log(rows);
      });

      // Llama a la función para marcar ausentes aquí
      //marcarAusentes();
    });
  });
}

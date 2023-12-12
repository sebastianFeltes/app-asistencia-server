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
  const fechaFormateada = `${diaFormato}/${mesFormato}/${año}`;

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

/* function marcarAusentes(dias) {
  let diasCurso;
} */
// Esta función se ejecutará a las 19:00 horas todos los días
export function timer() {
  cron.schedule("17 19 * * *", () => {
    // Lógica para ejecutar la función a las 19:00 horas de cada día
    //Primero obtengo el día actual
    const today = new Date().getDay();
    const fechaActual = obtenerFechaActual();
    const horaActual = obtenerHoraActual();
    //Luego, dependiendo del día ejecuto la funcion que pone "ausentes" en los cursos de esos días
    db.all(selectCursoByDia, [today], (err, rows) => {
      if (err) {
        return console.log(err);
      }
      const id_cursos = rows;
      if (id_cursos.length > 0) {
        id_cursos.map((e) => {
          const id_curso = e.id_curso;
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
                          console.log("ausente");
                        }
                      );
                    }else{
                        console.log("asistencia ya cargada")
                    }
                  }
                );
              });
            }
          });
        });
      }
      //console.log(rows);
    });

    // Llama a la función para marcar ausentes aquí
    //marcarAusentes();
  });
}

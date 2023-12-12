import { db } from "../database/conexion.database.js";
import {
  insertAsistencia,
  selectAlumnoPorId,
  selectAsistenciaByIdRelacion,
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

export async function buscarAlumnoPorId(req, res) {
  const id = req.params.id;
  //console.log(id);
  try {
    if (!id) return res.status(400);
    // Obtener la fecha y hora actual
    const fechaActual = new Date();
    // Obtener la fecha actual (formato: AAAA-MM-DD)
    const dia = fechaActual.getDate().toString().padStart(2, "0");
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const año = fechaActual.getFullYear();
    // Formatear la fecha en "dd/mm/aaaa"
    const fechaActualFormateada = `${dia}/${mes}/${año}`;
    // Obtener la hora actual (formato: HH:MM:SS)
    const horaActual = fechaActual.toTimeString().split(" ")[0];
    //const horaActual = "16:05:20";
    db.all(selectAlumnoPorId, [id, horaActual], (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }
      //console.log(rows);
      if (rows[0]) {
        function calcularCodigoAsistencia() {
          const horarioIngreso = rows[0].horario_ingreso;

          // Dividir la cadena en horas, minutos y segundos
          const partesTiempo = horarioIngreso.split(":");
          const horas = parseInt(partesTiempo[0]);
          const minutos = parseInt(partesTiempo[1]);

          const horaIngresoEnMinutos = horas * 60 + minutos;
          const horaActual =
            new Date().getHours() * 60 + new Date().getMinutes();

          const diferenciaEnMinutos = horaActual - horaIngresoEnMinutos;

          if (diferenciaEnMinutos <= 30) {
            return { codigo_asistencia: 1, descripcion: "PRESENTE" };
          } else if (diferenciaEnMinutos >= 30 && diferenciaEnMinutos < 60) {
            return { codigo_asistencia: 2, descripcion: "TARDE" };
          } else if (diferenciaEnMinutos <= 60 && diferenciaEnMinutos <= 120) {
            return { codigo_asistencia: 3, descripcion: "MEDIA FALTA" };
          } else {
            return { codigo_asistencia: 4, descripcion: "AUSENTE" };
          }
        }

        /* function calcularCodigoAsistencia() {
          const horarioIngreso = rows[0].horario_ingreso;

          // Dividir la cadena en horas, minutos y segundos
          const partesTiempo = horarioIngreso.split(":");
          const horas = parseInt(partesTiempo[0]);
          const minutos = parseInt(partesTiempo[1]);
          const segundos = parseInt(partesTiempo[2]);

          //Sumar 30 min para el TARDE
          function calcularCodigoAsistencia() {
            const horarioIngreso = rows[0].horario_ingreso;

            // Dividir la cadena en horas, minutos y segundos
            const partesTiempo = horarioIngreso.split(":");
            const horas = parseInt(partesTiempo[0]);
            const minutos = parseInt(partesTiempo[1]);
            const segundos = parseInt(partesTiempo[2]);

            // Sumar 30 minutos al horario de ingreso
            minutos += 30;

            // Verificar si hay que ajustar las horas si los minutos superan 60
            if (minutos >= 60) {
              horas += Math.floor(minutos / 60);
              minutos %= 60;
            }



            // Sumar 1 hora para MEDIA FALTA
            const nuevaHora = (horas + 1) % 24; // Asegurarse de que no exceda las 24 horas

            // Crear una nueva cadena de tiempo
            const horarioMediaFalta = `${nuevaHora
              .toString()
              .padStart(2, "0")}:${minutos
              .toString()
              .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
            //compara la hora de ingreso del alumno con la hora del recreo para que el código sea 1 o 2
            if (horaActual <= horarioTarde) {
              return { codigo_asistencia: 1, descripcion: "PRESENTE" };
            } else if (
              horaActual >= horarioTarde &&
              horaActual <= horarioMediaFalta
            ) {
              return { codigo_asistencia: 2, descripcion: "TARDE" };
            } else if (horaActual >= horarioMediaFalta) {
              return { codigo_asistencia: 3, descripcion: "MEDIA FALTA" };
            } else {
              return { codigo_asistencia: 4, descripcion: "AUSENTE" };
            }
          }
          // Sumar 1 hora para MEDIA FALTA
          const nuevaHora = (horas + 1) % 24; // Asegurarse de que no exceda las 24 horas

          // Crear una nueva cadena de tiempo
          const horarioMediaFalta = `${nuevaHora
            .toString()
            .padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos
            .toString()
            .padStart(2, "0")}`;
          //compara la hora de ingreso del alumno con la hora del recreo para que el código sea 1 o 2
          if (horaActual <= horarioTarde) {
            return { codigo_asistencia: 1, descripcion: "PRESENTE" };
          } else if (
            horaActual >= horarioTarde &&
            horaActual <= horarioMediaFalta
          ) {
            return { codigo_asistencia: 2, descripcion: "TARDE" };
          } else if (horaActual >= horarioMediaFalta) {
            return { codigo_asistencia: 3, descripcion: "MEDIA FALTA" };
          } else {
            return { codigo_asistencia: 4, descripcion: "AUSENTE" };
          }
        } */
        const codAsistencia = rows[0] ? calcularCodigoAsistencia() : false;
        const id_relacion = rows[0].id_relacion;
        const fechaActual = obtenerFechaActual();
        db.all(
          selectAsistenciaByIdRelacion,
          [id_relacion, fechaActual],
          (err, row) => {
            if (err) {
              console.log(err);
              return res.json({ mensaje: err.message });
            } else if (row.length > 0) {
              //console.log(row);
              async function getDetalleAsistencia() {
                let detalle = {
                  codigo_asistencia: 0,
                  descripcion: "",
                };
                detalle.codigo_asistencia = row[0].codigo_asistencia;
                db.all(
                  "SELECT descripcion FROM cod_asistencia WHERE id_codigo = ?",
                  [row[0].cod_asistencia],
                  (err, desc) => {
                    if (err) {
                      console.log(err);
                      return res.json({ mensaje: err.message });
                    }
                    returndetalle.descripcion = desc[0].descripcion.toUpperCase();
                  }
                );
                console.log(detalle);
                return detalle;
              }

              const asistencia = getDetalleAsistencia();
              return res.json({
                data_alumno_curso: rows[0],
                cod_asistencia: asistencia,
                hora_ingreso: row[0].hora,
                detalle: "Ud ya ha registrado la asistencia el día de hoy",
              });
            } else {
              db.all(
                insertAsistencia,
                [
                  id_relacion,
                  fechaActualFormateada,
                  calcularCodigoAsistencia().codigo_asistencia,
                  horaActual,
                ],
                (err) => {
                  if (err) res.json({ message: err.message });
                }
              );
              return res.json({
                data_alumno_curso: rows[0],
                cod_asistencia: codAsistencia,
                hora_ingreso: horaActual,
              });
            }
          }
        );
      } else {
        res.json({ error: "Alumno no encontrado" }).status(404);
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}

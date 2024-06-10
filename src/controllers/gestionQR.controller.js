import { error } from "console";
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
  // Obtener la fecha actual
  const fecha = new Date();

  // Obtener el día, el mes y el año
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
  const año = fecha.getFullYear();

  // Asegurarse de tener dos dígitos para el día y el mes (agregando un 0 al inicio si es necesario)
  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;

  // Formatear la fecha como dd/mm/aaaa
  const fechaFormateada = `${diaFormateado}-${mesFormateado}-${año}`;

  // Devolver la fecha formateada
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

async function buscarRelacionPorAlumnoCurso(id_alumno, cursos) {
  try {
    // Crear un array de promesas para ejecutar consultas a la base de datos
    const relacionesPromesas = cursos.map(
      (curso) =>
        new Promise((resolve, reject) => {
          db.all(
            "SELECT id_relacion FROM rel_curso_alumnos WHERE id_alumno = ? AND id_curso = ?",
            [id_alumno, curso.id_curso],
            (err, rows) => {
              if (err) reject(err.message);

              // Resolver la promesa con la relación si se encontró una, de lo contrario, resolver con null
              if (rows.length > 0) {
                resolve({
                  relacion: rows[0].id_relacion,
                  curso: curso.id_curso,
                });
              } else {
                resolve(null);
              }
            }
          );
        })
    );

    // Esperar a que todas las promesas se resuelvan y obtener los resultados
    const relaciones = await Promise.all(relacionesPromesas);

    // Filtrar relaciones que no sean nulas
    const relacionesValidas = relaciones.filter(
      (relacion) => relacion !== null
    );

    return relacionesValidas;
  } catch (error) {
    // Capturar y manejar errores
    console.error("Error en buscarRelacionPorAlumnoCurso:", error.message);
    throw new Error("Error al buscar la relación entre el alumno y los cursos");
  }
}

//OTRO ENFOQUE:
//CUANDO LLEGA EL ID DEL ALUMNO, DEPENDIENDO DE LA HORA, OBTENER EL CURSO, LUEGO OBTENER
//LA RELACION CON EL ID DEL CURSO Y EL ALUMNO

async function obtenerCursoPorHora() {
  const horario = obtenerHoraActual();
  const id_dia = new Date().getDay();
  const cursos = await dbAll(
    `SELECT CUR.id_curso, CUR.horario_final, CUR.horario_inicio FROM cursos CUR
    INNER JOIN rel_curso_dia RCD ON CUR.id_curso = RCD.id_curso 
    WHERE ? BETWEEN time(CUR.horario_inicio, '-30 minutes') AND time(CUR.horario_final)
    AND RCD.id_dia = ?`,
    [horario, id_dia]
  );
  // console.log(cursos);
  return cursos;
}

export async function marcarPresente(req, res) {
  try {
    // Extraer el ID del alumno de la solicitud
    const id_alumno = req.params.id;

    // Obtener los cursos actuales
    const cursos = await obtenerCursoPorHora();
    if (!cursos || cursos.length === 0)
      return res.json({
        error: "No se encontraron cursos en los horarios actuales",
      });

    // Buscar las relaciones del alumno con los cursos actuales
    const relaciones = await buscarRelacionPorAlumnoCurso(id_alumno, cursos);
    if (relaciones.length === 0)
      return res.json({
        error: "El alumno no está inscrito en ningún curso actualmente",
      });

    // Obtener la hora y fecha actual
    const horaActual = obtenerHoraActual();
    const fechaActual = obtenerFechaActual();

    // Obtener la relación y el curso correspondiente
    const id_relacion = relaciones[0].relacion;
    const curso = cursos.find(
      (curso) => curso.id_curso === relaciones[0].curso
    );

    // Calcular el código de asistencia
    const cod_asistencia = calcularCodigoAsistencia(
      curso.horario_inicio,
      horaActual
    );

    // Verificar si la asistencia ya está registrada para hoy
    const asistenciaCargada = await dbGet(
      `SELECT cod_asistencia, hora FROM asistencia WHERE id_rel_curso_alumno = ? AND fecha = ?`,
      [id_relacion, fechaActual]
    );

    if (!asistenciaCargada) {
      // Si la asistencia no está registrada, insertarla en la base de datos
      await db.run(
        "INSERT INTO asistencia(id_rel_curso_alumno, fecha, cod_asistencia, hora) VALUES(?,?,?,?)",
        [id_relacion, fechaActual, cod_asistencia, horaActual]
      );

      // Construir el objeto de respuesta para el alumno
      const alumno = {
        data_alumno_curso: await obtenerDatosAlumno(id_alumno, curso.id_curso),
        cantidad_inasistencias: (await obtenerAsistenciasAlumno(id_alumno))
          .cantidad_inasistencias,
        hora_ingreso: horaActual,
        cod_asistencia: {
          descripcion:
            cod_asistencia === 1
              ? "presente"
              : cod_asistencia === 2
              ? "tarde"
              : "ausente",
        },
      };

      return res.json(alumno);
    } else {
      // Si la asistencia ya está registrada, devolver la información existente
      const alumno = {
        data_alumno_curso: await obtenerDatosAlumno(id_alumno, curso.id_curso),
        cantidad_inasistencias: (await obtenerAsistenciasAlumno(id_alumno))
          .cantidad_inasistencias,
        hora_ingreso: asistenciaCargada.hora,
        cod_asistencia: {
          re_scaned: true,
          descripcion:
            asistenciaCargada.cod_asistencia === 1
              ? "presente"
              : asistenciaCargada.cod_asistencia === 2
              ? "tarde"
              : "ausente",
        },
      };

      return res.json(alumno);
    }
  } catch (error) {
    // Capturar y manejar errores
    console.error("Error en marcarPresente:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

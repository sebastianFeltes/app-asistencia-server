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

async function buscarRelacionPorAlumnoCurso(id_alumno, id_curso) {
  try {
    if (!id_alumno) return res.status(400).send("Falta el ID del alumno");

    const id_relacion = await dbGet(
      "SELECT id_relacion FROM rel_curso_alumnos WHERE id_alumno = ? AND id_curso = ?",
      [id_alumno, id_curso]
    );
    // console.log(id_relacion)
    // Puedes retornar las relaciones aquí para que estén disponibles para su uso en otra función
    if (id_relacion) return id_relacion.id_relacion;
  } catch (error) {
    console.log(error.message);
    throw new Error("Error al buscar el alumno por ID");
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
    WHERE ? BETWEEN time(CUR.horario_inicio, '-20 minutes') AND time(CUR.horario_final)
    AND RCD.id_dia = ?`,
    [horario, id_dia]
  );

  return cursos;
}

export async function marcarPresente(req, res) {
  const id_alumno = req.params.id; //primero obtengo el id que viene en la url

  const cursos = await obtenerCursoPorHora();
  // console.log(cursos);
  if (!cursos || !cursos.length)
    return res.json({ error: "Alumno no encontrado para los cursos actuales" });

  cursos.forEach(async (curso) => {
    const id_relacion = await buscarRelacionPorAlumnoCurso(
      id_alumno,
      curso.id_curso
    );
    //  console.log(id_relacion.id_relacion);

    const horaActual = obtenerHoraActual();
    const fechaActual = obtenerFechaActual();

    const cod_asistencia = curso
      ? calcularCodigoAsistencia(curso.horario_inicio, horaActual)
      : null;

    if (id_relacion) {
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

      //VERIFICAR SI LA ASISTENCIA YA SE CARGO}

      const relacion = await id_relacion;
      let asistenciaCargada = await dbGet(
        `SELECT cod_asistencia, hora FROM asistencia WHERE id_rel_curso_alumno = ? AND fecha = ?`,
        [relacion, fechaActual]
      );

      //BUSCAR LOS DATOS DEL ALUMNO y CURSO
      let data_alumno_curso = await obtenerDatosAlumno(
        id_alumno,
        curso.id_curso
      );

      //OBTENER LAS INASISTENCIAS TOTALES
      let asistenciasTotales = await obtenerAsistenciasAlumno(id_alumno);

      console.log("linea 184");
      console.log(await asistenciaCargada);
      //SI LA ASISTENCIA NO ESTA CARGADA HOY, EJECUTA  LA FUNCIÓN PARA INSERTARLA EN LA BASE DE DATOS
      if (!asistenciaCargada) {
        // console.log("linea 141");
        // console.log("cargar asistencia");
        // INSERTAR LA ASISTENCIA
        return db.run(
          "INSERT INTO asistencia(id_rel_curso_alumno, fecha, cod_asistencia, hora) VALUES(?,?,?,?)",
          [id_relacion, fechaActual, cod_asistencia, horaActual],
          (err) => {
            if (err) throw err.message;
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
          }
        );
        // return;
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
}

import { db } from "../database/conexion.database.js";
import { insertAsistencia, selectAlumnoPorId } from "../database/queries.database.js";

export async function buscarAlumnoPorId(req, res) {
  const id = req.params.id;
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
    //const horaActual = fechaActual.toTimeString().split(" ")[0];
    const horaActual = "16:05:20";
    db.all(selectAlumnoPorId, [id, horaActual], (err, rows) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }

      function calcularCodigoAsistencia() {
        const horarioIngreso = rows[0].horario_ingreso;

        // Dividir la cadena en horas, minutos y segundos
        const partesTiempo = horarioIngreso.split(":");
        const horas = parseInt(partesTiempo[0]);
        const minutos = parseInt(partesTiempo[1]);
        const segundos = parseInt(partesTiempo[2]);

        // Sumar 2 horas
        const nuevaHora = (horas + 2) % 24; // Asegurarse de que no exceda las 24 horas

        // Crear una nueva cadena de tiempo
        const horarioRecreo = `${nuevaHora
          .toString()
          .padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos
          .toString()
          .padStart(2, "0")}`;
        //compara la hora de ingreso del alumno con la hora del recreo para que el código sea 1 o 2
        if (horaActual <= horarioRecreo) {
          return { codigo_asistencia: 1, descripcion: "PRESENTE" };
        } else  {
          return { codigo_asistencia: 2, descripcion: "MEDIA FALTA" };
        }
      }
      const codAsistencia = rows[0] ? calcularCodigoAsistencia() : false;
	  db.all(insertAsistencia,[rows[0].id_relacion, fechaActualFormateada, calcularCodigoAsistencia().codigo_asistencia],(err)=>{
		if(err) res.json({message: err.message})
	  })
      return res.json({
        data_alumno_curso: rows[0],
        cod_asistencia: codAsistencia,
        hora_ingreso: horaActual,
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}


import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('../app.db');

db.all("SELECT DATE() AS fecha", (error, result) => {
  if (error) {
    console.log(error.message)
  }
  return console.log(result);
})


//TODO: Función para convertir el formato de fecha de "dd/mm/aaaa" a "dd-mm-aaaa"
/* function convertirFormatoFecha(fecha) {
  const partes = fecha.split('/');
  const fechaFormateada = partes.join('-');
  return fechaFormateada;
}

// Ejecuta una consulta para obtener los registros que necesitan ser actualizados
db.all("SELECT id_asistencia, fecha FROM asistencia", (error, registros) => {
  if (error) {
      console.log("Error al obtener registros:", error.message);
      return;
  }

  // Itera sobre los registros y actualiza el formato de fecha
  registros.forEach(registro => {
      const fechaActual = registro.fecha;
      const fechaFormateada = convertirFormatoFecha(fechaActual);

      // Ejecuta una consulta UPDATE para modificar el formato de fecha en la base de datos
      db.run("UPDATE asistencia SET fecha = ? WHERE id_asistencia = ?", [fechaFormateada, registro.id_asistencia], (error) => {
          if (error) {
              console.log("Error al actualizar el registro con ID " + registro.id_asistencia + ":", error.message);
          } else {
              console.log("Registro con ID " + registro.id_asistencia + " actualizado correctamente.");
          }
      });
  });
}); */
//FIN formateo fechas


export { db };

import { selectAsistencia, updatetAsistAlumno } from "../database/queries.database.js";

import { db } from "../database/conexion.database.js";
export function modificarAsistencia(req, res) {
	const id_asistencia = req.params.id_asistencia;
	console.log(id_asistencia);
	try {
		db.all(updatetAsistAlumno, [id_asistencia], (err, rows) => {
			if (err) res.json({ message: err.message });
			res.json({ message: "asistencia modificada" });
		});
	} catch (error) {
		console.log(error.message);
		return res.json({ message: error.message }).status(500);
	}
}

export function getAsistencia(req, res) {
	const id_curso = req.params.id;
	try {
		db.all(selectAsistencia, [id_curso], (err, rows) => {
			if (err) res.json({ message: err.message });

			///
			// Tu array de datos
			const data = rows;

			// Objeto para almacenar los resultados agrupados
			const resultados = {};

			// Iterar sobre el array de datos
			data.forEach((registro) => {
				const fecha = registro.fecha;
				const alumno = `${registro.nombre} ${registro.apellido}`;
				const descripcion = registro.descripcion;

				// Si la fecha aún no está en el objeto resultados, agrégala
				if (!resultados[fecha]) {
					resultados[fecha] = {};
				}

				// Si el alumno aún no está en la fecha actual, agrégalo
				if (!resultados[fecha][alumno]) {
					resultados[fecha][alumno] = [];
				}

				// Agregar la descripción de la asistencia al alumno y fecha correspondientes
				resultados[fecha][alumno].push(descripcion);
			});

			console.log(resultados);

			///

			res.json(resultados);
		});
	} catch (error) {
		if (error) {
			console.log(err.message);
			return res.json({ message: error.message });
		}
	}
}

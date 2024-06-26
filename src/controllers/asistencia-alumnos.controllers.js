import { selectAsistencia, updatetAsistAlumno } from "../database/queries.database.js";

import { db } from "../database/conexion.database.js";

export function modificarAsistencia(req, res) {
	const { id_asistencia, cod_asistencia } = req.body;
	try {
		db.all(updatetAsistAlumno, [cod_asistencia, id_asistencia], (err, rows) => {
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
	//console.log(id_curso);
	try {
		db.all(selectAsistencia, [id_curso], (err, rows) => {
			if (err) res.json({ message: err.message });
			// console.log(rows)
			return res.json(rows);

		});
	} catch (error) {
		if (error) {
			console.log(err.message);
			return res.json({ message: error.message });
		}
	}
}

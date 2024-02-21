import { db } from "../database/conexion.database.js";
import { insertCurso, insertRelCursoDia } from "../database/queries.database.js";

export function tryAltaCurso(req, res) {
	//console.log("controller");
	//console.log(req.body);
	//res.json({ mensaje: "recibido" });
	try {
		const { nombre, id_docente, horario_inicio, horario_final, activo, fecha_inicio, fecha_final, dias, horas_catedra,cantidad_clases,cantidad_inasistencias } = req.body;
		db.run(
			insertCurso,
			[nombre, id_docente, horario_inicio, horario_final, activo, fecha_inicio, fecha_final, horas_catedra,cantidad_clases,cantidad_inasistencias],
			(err, rows) => {
				if (err) {
					console.log(err.message);
					return res.json({ mensaje: err.message });
				} else {
					db.all("SELECT MAX(id_curso) AS id FROM cursos", (err, rows) => {
						if (err) {
							console.log(err);
							return res.json({ mensaje: err.message });
						} else {
							//console.log(rows);
							dias.map((e) => {
								db.run(insertRelCursoDia, [rows[0].id, e], (err, rows) => {
									if (err) {
										console.log(err);
										return res.json({
											mensaje: "Error al cargar datos del curso",
										});
									}
								});
							});
							return res.json({ mensaje: "Curso cargado a la base de datos" });
						}
					});
				}
			}
		);
	} catch (error) {
		if (error) {
			console.log(error);
			res.json({ mensaje: error.message });
		}
	}
}

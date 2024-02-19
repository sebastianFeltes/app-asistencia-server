import { db } from "../database/conexion.database.js";
import { selectAlumnos, updateAlumnos, updateDetalleAlumnos } from "../database/queries.database.js";

export function datosAlumnos(req, res) {
	const { docente_id, docente_rol } = req.session;
	try {
		db.all(selectAlumnos, (err, rows) => {
			if (err) {
				console.log(err.message);
				return res.json({ mensaje: err.message }).status(500);
			}
			return res.json(rows).status(200);
		});
	} catch (error) {
		return res.json({ mensaje: err.message }).status(500);
	}
}
export function modificarDatosAlumno(req, res) {
	//console.log("controller");
	//console.log(req.body);
	const {
		activo,
		nombre,
		apellido,
		tipo_dni,
		nro_dni,
		fecha_nac,
		car_telefono,
		telefono,
		direccion,
		email,
		nro_legajo,
		localidad,
		car_tel_extra,
		telefono_extra,
		lugar_nacimiento,
		nacionalidad,
		fotoc_analitico,
		fotoc_dni,
		planilla_ins,
		id_alumno,
	} = req.body;
	try {
		db.all(
			updateAlumnos,
			[tipo_dni, nro_dni, nro_legajo, nombre, apellido, activo, fecha_nac, id_alumno],
			(err, rows) => {
				if (err) {
					//error del servidor
					console.log("1st query");
					console.log(err);
					return res.json({ message: err.message }).status(500);
				}
				db.all(
					updateDetalleAlumnos,
					[
						direccion,
						localidad,
						car_telefono,
						telefono,
						car_tel_extra,
						telefono_extra,
						email,
						lugar_nacimiento,
						nacionalidad,
						fotoc_dni,
						fotoc_analitico,
						planilla_ins,
						id_alumno,
					],
					(err) => {
						if (err) {
							console.log(err);
							return res.json({ message: err.message }).status(500);
						}
						//console.log("response")
						return res.json({ message: "alumno modificado" });
					}
				);
			}
		);
	} catch (error) {
		console.log(error.message);
		return res.json({ message: error.message });
	}
}

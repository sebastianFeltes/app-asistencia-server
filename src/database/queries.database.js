export const selectDocentePorDni = `
SELECT * FROM docentes WHERE nro_dni = ?`;

export const selectAlumnoPorId = `SELECT AL.id_alumno as id_lumno, AL.nombre as nombre_alumno , AL.apellido as apellido_alumno, AL.nro_dni as dni_alumno, CUR.id_curso as id_curso, CUR.nombre as nombre_curso, CUR.horario_inicio as horario_ingreso, CUR.horario_final as horario_egreso, RCA.id_relacion as id_relacion FROM alumnos AL
INNER JOIN rel_curso_alumnos RCA ON AL.id_alumno = RCA.id_alumno
INNER JOIN cursos CUR ON CUR.id_curso = RCA.id_curso
WHERE AL.id_alumno = ? AND ? BETWEEN CUR.horario_inicio AND CUR.horario_final;`;

export const insertAsistencia = `INSERT INTO asistencia() VALUES()`;

export const selectCurso = `SELECT nombre FROM cursos`;

export const buscarAlumno = `SELECT AL.tipo_dni,AL.nro_legajo, AL.nombre,AL.apellido, DAL.id_alumno,DAL.direccion, DAL.localidad,DAL.car_telefono, DAL.telefono, DAL.car_tel_extra, DAL.telefono_extra, DAL.email, DAL.fotoc_dni, DAL.fotoc_analitico, DAL.planilla_ins FROM alumnos AL INNER JOIN detalle_alumnos DAL ON DAL.id_alumno = AL.id_alumno WHERE AL.nro_dni = ?`;

export const insertAlumno = `INSERT INTO alumnos (tipo_dni,nro_dni,nro_legajo,nombre,apellido) VALUES (?,?,?,?,?)`;

export const insertDetalleAlumno = `INSERT INTO detalle_alumnos (id_alumno,direccion, localidad,car_telefono, telefono, car_tel_extra, telefono_extra, email, fotoc_dni, fotoc_analitico, planilla_ins) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
export const selectDocenteDetalleDocente = `SELECT * FROM docentes DO
INNER JOIN detalle_docentes DAL ON DO.id_docente = DAL.id_docente
INNER JOIN roles ROL ON ROL.id_rol = DO.id_rol;
`;

export const insertDocentes = `INSERT INTO docentes (nombre, tipo_dni, nro_dni,  id_rol, password, apellido, activo) 
VALUES (?,?,?,?,?,?,?)`

export const insertDetalleDocentes =  `INSERT INTO detalle_docentes (id_docente, direccion, localidad, car_telefono, telefono, car_tel_extra, telefono_extra, email)
VALUES (?,?,?,?,?,?,?,?)`;


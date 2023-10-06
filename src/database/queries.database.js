export const selectDocentePorDni = `
SELECT * FROM docentes WHERE nro_dni = ?`;

export const selectAlumnoPorId = `SELECT AL.id_alumno as id_lumno, AL.nombre as nombre_alumno , AL.apellido as apellido_alumno, AL.nro_dni as dni_alumno, CUR.id_curso as id_curso, CUR.nombre as nombre_curso, CUR.horario_inicio as horario_ingreso, CUR.horario_final as horario_egreso, RCA.id_relacion as id_relacion FROM alumnos AL
INNER JOIN rel_curso_alumnos RCA ON AL.id_alumno = RCA.id_alumno
INNER JOIN cursos CUR ON CUR.id_curso = RCA.id_curso
WHERE AL.id_alumno = ? AND ? BETWEEN CUR.horario_inicio AND CUR.horario_final;`;

export const insertAsistencia = `INSERT INTO asistencia() VALUES()`;

export const traerCurso = `SELECT id_curso ,nombre FROM cursos WHERE activo="true"`;

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

export const selectAlumnos = `SELECT * FROM alumnos AL
INNER JOIN detalle_alumnos DAL ON AL.id_alumno = DAL.id_alumno;`;

export const updateAlumnos = `UPDATE alumnos SET 
tipo_dni=?, 
nro_dni=?, 
nro_legajo=?, 
nombre=?, 
apellido=?, 
activo=?
WHERE id_alumno=?;`

export const updateDetalleAlumnos = `UPDATE detalle_alumnos SET 
direccion=?, 
localidad=?, 
car_telefono=?, 
telefono=?, 
car_tel_extra=?, 
telefono_extra=?, 
email=?, 
fotoc_dni=?, 
fotoc_analitico=?, 
planilla_ins=?
WHERE id_alumno=?;`

export const selectDocentes = `SELECT * FROM docentes DO
INNER JOIN detalle_docentes DDO ON DO.id_docente = DDO.id_docente
INNER JOIN roles ROL ON DO.id_rol = ROL.id_rol`

export const updateDocente = `UPDATE docentes SET nombre =?, tipo_dni =?, nro_dni=?, nro_legajo =?, id_rol =?,password =?, apellido =?, activo =?, fecha_nac =? WHERE id_docente = ?`;

export const updateDetalleDocente = `UPDATE detalle_docentes SET  direccion =?, localidad =?, car_telefono =?, telefono =?, car_tel_extra=?, tel_extra =?, email =? WHERE id_docente =?`;

export const selectCursos =`SELECT * FROM cursos CU; `;

export const updateCursos = `UPDATE cursos SET nombre=?, horario=?, id_docente=?, activo=?,id_dia=?;`;

export const updatetAsistAlumno = 
"UPDATE asistencia SET cod_asistencia = 4 WHERE id_asistencia = ?"

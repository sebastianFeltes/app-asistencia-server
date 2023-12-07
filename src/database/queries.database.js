export const selectDocentePorDni = `
SELECT * FROM docentes WHERE nro_dni = ?`;

export const selectAlumnoPorId = `SELECT AL.id_alumno as id_alumno, AL.nombre as nombre_alumno , AL.apellido as apellido_alumno, AL.nro_dni as dni_alumno, CUR.id_curso as id_curso, CUR.nombre as nombre_curso, CUR.horario_inicio as horario_ingreso, CUR.horario_final as horario_egreso, RCA.id_relacion as id_relacion FROM alumnos AL
INNER JOIN rel_curso_alumnos RCA ON AL.id_alumno = RCA.id_alumno
INNER JOIN cursos CUR ON CUR.id_curso = RCA.id_curso
WHERE AL.id_alumno = ? AND ? BETWEEN "00:00:00" AND CUR.horario_final;`;

export const insertAsistencia = `INSERT INTO asistencia(id_rel_curso_alumno, fecha, cod_asistencia) VALUES(?,?,?)`;

export const selectAsistencia = `SELECT ASIS.id_asistencia, ASIS.fecha, ALU.nombre, ALU.apellido, ALU.id_alumno, COD.descripcion, ALU.id_alumno  FROM asistencia ASIS
INNER JOIN rel_curso_alumnos RCA ON ASIS.id_rel_curso_alumno = RCA.id_relacion
INNER JOIN cursos CUR ON  CUR.id_curso = RCA.id_curso
INNER JOIN alumnos ALU ON ALU.id_alumno = RCA.id_alumno
INNER JOIN cod_asistencia COD on COD.id_codigo = ASIS.cod_asistencia
WHERE CUR.id_curso = ?;`;

export const selectCurso = `SELECT * FROM cursos`;
export const mostrarCursos = `SELECT AL.id_curso as id_curso, AL.nombre as nombre   FROM cursos`;

export const buscarAlumno = `SELECT AL.tipo_dni,AL.nro_legajo, AL.nombre,AL.apellido,AL.fecha_nac, DAL.id_alumno,DAL.direccion, DAL.localidad,DAL.car_telefono, DAL.telefono, DAL.car_tel_extra, DAL.telefono_extra, DAL.email, DAL.fotoc_dni, DAL.fotoc_analitico, DAL.planilla_ins FROM alumnos AL INNER JOIN detalle_alumnos DAL ON DAL.id_alumno = AL.id_alumno WHERE AL.nro_dni = ?`;

export const insertAlumno = `INSERT INTO alumnos (tipo_dni,nro_dni,nro_legajo,nombre,apellido,activo, fecha_nac) VALUES (?,?,?,?,?,?,?)`;
export const insertCurso = `INSERT INTO cursos (nombre ,id_docente, horario_inicio, horario_final,activo, fecha_inicio,fecha_final) VALUES(?,?,?,?,?,?,?)`;
export const insertRelCursoDia = `INSERT INTO rel_curso_dia (id_curso,id_dia) VALUES (?,?)`;
export const insertDetalleAlumno = `INSERT INTO detalle_alumnos (id_alumno,direccion, localidad,car_telefono, telefono, car_tel_extra, telefono_extra, email, fotoc_dni, fotoc_analitico, planilla_ins ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

export const updateAltaAlumnos = `UPDATE alumnos SET 
tipo_dni=?, 
nro_dni=?, 
nro_legajo=?, 
nombre=?, 
apellido=?, 
fecha_nac=?
WHERE id_alumno=?;`;

export const selectDocenteDetalleDocente = `SELECT * FROM docentes DO
INNER JOIN detalle_docentes DAL ON DO.id_docente = DAL.id_docente
INNER JOIN roles ROL ON ROL.id_rol = DO.id_rol;
`;

export const insertDocentes = `INSERT INTO docentes (nombre, tipo_dni, nro_dni ,id_rol, password, apellido,activo,fecha_nac,nro_legajo) 
VALUES (?,?,?,?,?,?,?,?,?)`;

export const insertDetalleDocentes = `INSERT INTO detalle_docentes (id_docente, direccion, localidad, car_telefono, telefono, car_tel_extra, telefono_extra, email)
VALUES (?,?,?,?,?,?,?,?)`;

export const selectAlumnos = `SELECT * FROM alumnos AL
INNER JOIN detalle_alumnos DAL ON AL.id_alumno = DAL.id_alumno;`;

export const updateAlumnos = `UPDATE alumnos SET 
tipo_dni=?, 
nro_dni=?, 
nro_legajo=?, 
nombre=?, 
apellido=?, 
activo=?,
fecha_nac=?
WHERE id_alumno=?;`;

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
WHERE id_alumno=?;`;

export const selectDocentes = `SELECT * FROM docentes DO
INNER JOIN detalle_docentes DDO ON DO.id_docente = DDO.id_docente
INNER JOIN roles ROL ON DO.id_rol = ROL.id_rol`;

export const updateDocente = `UPDATE docentes SET nombre =?, tipo_dni =?, nro_dni=?, id_rol =?, apellido =?, activo =?, fecha_nac =? WHERE id_docente = ?`;

export const updateDetalleDocente = `UPDATE detalle_docentes SET  direccion =?, localidad =?, car_telefono =?, telefono =?, car_tel_extra=?, telefono_extra =?, email =? WHERE id_docente =?`;

export const selectCursos = `SELECT CUR.*, DOC.nombre AS nombre_docente, DOC.apellido AS apellido_docente FROM cursos CUR INNER JOIN docentes DOC ON DOC.id_docente = CUR.id_docente  ; `;

export const selectDiasCursos = `SELECT * FROM rel_curso_dia RCD INNER JOIN dias DIA ON RCD.id_dia = DIA.id_dia`;

export const selectDias = `SELECT * FROM dias DI`;

export const updateCursos = `UPDATE cursos SET nombre=?, id_docente=?, horario_inicio=?, horario_final=?, activo=?, fecha_inicio=?, fecha_final=? WHERE id_curso=?`;
export const updatetAsistAlumno = "UPDATE asistencia SET cod_asistencia = ? WHERE id_asistencia = ?";

export const selectDataCursoById = `SELECT CUR.*, DOC.nombre AS nombre_docente, DOC.apellido AS apellido_docente FROM cursos CUR 
INNER JOIN docentes DOC ON DOC.id_docente = CUR.id_docente 
WHERE CUR.id_curso = ?`;

export const selectDiasByCursoId = `SELECT DIA.nombre AS nombre_dia FROM dias DIA
INNER JOIN rel_curso_dia RCD ON DIA.id_dia = RCD.id_dia
WHERE RCD.id_curso = ?;`;

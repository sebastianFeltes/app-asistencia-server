export const selectCurso =`SELECT nombre FROM cursos`;

export const buscarAlumno =`SELECT AL.tipo_dni,AL.nro_legajo, AL.nombre,AL.apellido, DAL.id_alumno,DAL.direccion, DAL.localidad,DAL.car_telefono, DAL.telefono, DAL.car_tel_extra, DAL.telefono_extra, DAL.email, DAL.fotoc_dni, DAL.fotoc_analitico, DAL.planilla_ins FROM alumnos AL INNER JOIN detalle_alumnos DAL ON DAL.id_alumno = AL.id_alumno WHERE AL.nro_dni = ?`; 

export const insertAlumno = `INSERT INTO alumnos (tipo_dni,nro_dni,nro_legajo,nombre,apellido) VALUES (?,?,?,?,?)`;

export const insertDetalleAlumno = `INSERT INTO detalle_alumnos (id_alumno,direccion, localidad,car_telefono, telefono, car_tel_extra, telefono_extra, email, fotoc_dni, fotoc_analitico, planilla_ins) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
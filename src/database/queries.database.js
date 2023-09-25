export const selectDocente = `SELECT * FROM docentes DO
INNER JOIN detalle_docentes DAL ON DO.id_docente = DAL.id_docente
INNER JOIN roles ROL ON ROL.id_rol = DO.id_rol;
`;

export const insertDocentes = `INSERT INTO docentes (nombre, tipo_dni, nro_dni,  id_rol, password, apellido, activo) 
VALUES (?,?,?,?,?,?,?)`

export const insertDetalleDocentes =  `INSERT INTO detalle_docentes (id_docente, direccion, localidad, car_telefono, telefono, car_tel_extra, telefono_extra, email)
VALUES (?,?,?,?,?,?,?,?)`;


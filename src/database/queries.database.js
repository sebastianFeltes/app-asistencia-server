export const selectDocentes = `SELECT * FROM docentes DO
INNER JOIN detalle_docentes DDO ON DO.id_docente = DDO.id_docente
INNER JOIN roles ROL ON DO.id_rol = ROL.id_rol`

export const updateDocente = `UPDATE docentes SET nombre =?, tipo_dni =?, nro_dni=?, nro_legajo =?, id_rol =?,password =?, apellido =?, activo =?, fecha_nac =? WHERE id_docente = ?`;


export const updateDetalleDocente = `UPDATE detalle_docentes SET  direccion =?, localidad =?, car_telefono =?, telefono =?, car_tel_extra=?, tel_extra =?, email =? WHERE id_docente =?`;




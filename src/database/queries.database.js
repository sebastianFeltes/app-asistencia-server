export const selectAlumnos = `SELECT * FROM alumnos AL
INNER JOIN detalle_alumnos DAL ON AL.id_alumno = DAL.id_alumno;`
;

export const updateAlumnos = `UPDATE alumnos SET 
tipo_dni=?, 
nro_dni=?, 
nro_legajo=?, 
nombre=?, 
apellido=?, 
activo=?;`

export const updateDetalleAlumnos = `UPDATE detalle_alumnos SET 
direccion=?, 
localidad=?, 
car_telefono=?, 
elefono=?, 
car_tel_extra=?, 
telefono_extra=?, 
email=?, 
fotoc_dni=?, 
fotoc_analitico=?, 
planilla_ins=?;`

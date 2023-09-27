import { db } from "../database/conexion.database.js";
import { selectAlumnos, updateAlumnos, updateDetalleAlumnos } from "../database/queries.database.js";


export function dataAlumnos(req, res) {
  const {docente_id, docente_rol} = req.session;
    try{
      if(docente_rol){
        
      }
        db.all(selectAlumnos, (err, rows)=>{
          if(err){
            console.log(err.message);
            return res.json({mensaje: err.message}).status(500)
          }
          return res.json(rows).status(200)
        });

    }catch (error){
      return res.json({mensaje: err.message}).status(500)
    }

}
export function modificarDataAlumno(req, res){
const {
  id_alumno,
    nro_legajo,
    tipo_dni,
    nro_dni,
    nombre,
    apellido,
    direccion,
    localidad,
    car_telefono,
    telefono,
    email,
    car_tel_extra,
    telefono_extra,
    fotoc_analitico,
    fotoc_dni,
    planilla_ins,
    activo
}=req.body
  try {
    db.all(updateAlumnos,[id_alumno, tipo_dni, 
      nro_dni, 
      nro_legajo, 
      nombre, 
      apellido, 
      activo], (err, rows)=>
    {
      if (err){
        //error del servidor
        console.log(err);
        return res.json({ message:err.message}).status(500)
      }
      if (rows.length==0){
        //manejo del error 
        return res.json({message:"datos incompletos"}).status(400)
      }
      //no encontro error modifica alumno
      return res.json({message:"alumno modificado"}).status(200)

    })
    
    db.all(updateDetalleAlumnos, [direccion,
      localidad,
      car_telefono,
      telefono,
      email,
      car_tel_extra,
      telefono_extra,
      fotoc_analitico,
      fotoc_dni,
      planilla_ins], (err, rows)=>
    {
      if (err){
        console.log(err);
        return res.json({ message:err.message}).status(500)
      }
      if (rows.length==0){
        //manejo del error 
        return res.json({message:"datos incompletos"}).status(400)
      }
      return res.json({message:"alumno modificado"}).status(200)
 //-------------------------------------------------------------------
    /*  BCRYPT de JS:
     si se encuentra el registro, "saco" la contraseña
      const dbpassword = rows[0].password; 
      const match = bcrypt.compare(password, dbPassword);

      if (match){
       //comparo las contraseñas y si son iguales respondo "logged"
       return res.json({mesagge: "loggeando"}).status(200);
      }else{
        //si no son iguales, respondo con "invalid pass"
        return res.json({mesagge: "contraseña invalida!"}).status(400);
      }*/
   //-------------------------------------------------------------------
    })
    
  } catch (error) {
    
  }

   }

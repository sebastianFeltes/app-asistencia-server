import  {db}  from "../database/conexion.database.js";
import { selectCursos, updateCursos } from "../database/queries.database.js";




export function getCursos(req, res) {
  try {
    db.all(selectCursos,(err,rows)=>{
      if(err){
        console.log(err)
        return res.json({message:err.message})
      }
      console.log(rows)
      return res.json(rows)
    })
  } catch (error) {
    console.log(error.message)
    return res.json({message:error.message})
  }
}

export function modificarCursos(req, res) {
  const {} =req.body
  try {
    db.all(updateCursos,[],(err,rows)=>{
      if(err){
        console.log(err);
        return res.json({message:err.message}).status(500)
      }
      if(rows.length==0){
        return res.json({message:"datos invalidos" }).status(400)
      }
      return res.json({message:"Curso modificado"}).status(200)
    })
  } catch (error) {
    
  }
}

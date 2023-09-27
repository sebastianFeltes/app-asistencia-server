import { updatetAsistAlumno } from "../database/queris.database";

export function asistenciaAlumnos (req,res){

const {id_asistencia} = req.body; 
try {
    db.all(updatetAsistAlumno,[id_asistencia],(err)=>{
        if(err){
            console.log(err.message)
            return res.json({message: err.message}).status(500)
        }
        return 
    })
} catch (error) {
    console.log(error.message)
    return res.json({message: error.message}).status(500)
}}
    


/* 
}

const data = {
    curso: "programacion",
    docente: "sebastian",
    dias: "lun, mie, vie",
    horario: "17.00 a 21.00",
    cant_alumnos: 17,
    fechas: ["1/9", "3/9", "5/9", "7/9", "9/9", "11/9", "12/9"],
    alumnos: [
        {
            nombre: "nico",
            apellido: "meza",
            asistencia: ["P", "A", "J", "P", "A", "J"]
        },
        {
            nombre: "ivan",
            apellido: "luchessi",
            asistencia: ["P", "A", "P", "P", "A", "J"]
        },
        {
            nombre: "Juan",
            apellido: "Bossi Kees",
            asistencia: ["P", "P", "P", "P", "A", "J"]
        },
    ]
}

export function getAsist(req, res) {
    return res.json(data).status(200);
} 
*/  
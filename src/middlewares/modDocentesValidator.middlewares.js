import {ZodError} from "zod";

import { NextFunction } from "express";


export const modDocentesValidator = (schema)=  (req, res, next)=>{
    try {
        schema.parse({
            body: req.body
        });
        next();
    } catch (error) {
        if(error instanceof ZodError){
            return res.status(400).json(
                error.issues.map((issues)=>({
                    path: issues.path,
                    message: issues.message
                }))
            )
        }
        return res.status(400).json({message:"internal server error"})
    }
};
import express,{ Request,Response } from "express";

import {MuscleService} from "./muscleService";

const producto = new MuscleService()
export const GetMuscle = async (_req:Request,res:Response)=>{
    const user = await producto.getMuscles();
    res.json(user);
};
export const getOneMuscle = async(_req:Request,res:Response)=>{
    res.send("Obteniendo un muscle");
};
export const CreateNewMuscle = async (req:Request,res:Response)=>{


        const dato = req.body;
        console.log("Asdad")
        console.log(req.body.title)
        // const dato = req.body;
        console.log(dato);
        const user = await producto.createNewMuscle(dato);
        // res.send(dato);
        
        res.send(user);
        console.log(`Se registro correctamente .`);

};

import express, { Request, Response } from "express";
import { createNewUser, getUsers } from "./userService";


export const GetUsers = async (req:Request,res:Response)=>{
    
    const dato = req.body;
    const user = await getUsers();
    // const arrayEmail = [];
   
    // user.forEach((a)=>{
      
        
    //     console.log(a.email);
    //     // a = a+1;
    // });

   
    res.send(user);

};
export const getUser = (req:Request,res:Response) => {
    res.send('Obtener un usuario');
};

export const CreateNewUser = async (req:Request,res:Response) => {
        
        const dato = req.body;
        

            const user = await createNewUser(dato); 
            if(user){
                res.json(user);
            }{

                res.send("El usuario No se pudo registrar");
                console.log("El usuario No se pudo registrar",user);
                // console.log("Se Registro correctamenete");

            }
        

};
export const updateUser = (req:Request,res:Response) => {
    res.send("Update  user");
};
export const deleteUser = (req:Request,res:Response) => {
    res.send("Eliminado User");
};
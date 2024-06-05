import express, { Request, Response } from "express";
import { createNewUser, getUsers, deleteUSer } from "./userService";


export const GetUsers = async (_req:Request,res:Response)=>{
    
    // const dato = req.body;
    // const user = await getUsers();
    // const arrayEmail = [];
   
    // user.forEach((a)=>{
      
        
    //     console.log(a.email);
    //     // a = a+1;
    // });

   
    // res.send(user);

};
export const getUser = (req:Request,res:Response) => {
    res.send('Obtener un usuario');
};

export const CreateNewUser = async (req:Request,res:Response) => {
        
        const dato = req.body;
        

            const user = await createNewUser(dato); 
            if(user){
                res.json(`El usuario ase pudo registrar`);
            }{

                res.send("El usuario No se pudo registrar");
                // console.log("El usuario No se pudo registrar",user);
                // console.log("Se Registro correctamenete");

            }
        

};
export const updateUser = (req:Request,res:Response) => {
    res.send("Update  user");
};
export const deleteUser = async (req:Request,res:Response) => {
    
    
    const deleteuse = await deleteUSer(1);
    res.send("Eliminado User");
};
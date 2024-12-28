import express, { Request, Response } from "express";
import {
  createNewUser,
  getUsers,
  deleteUser,
  getUser,
} from "./userService";

export const GetUsers = async (req: Request, res: Response) => {
  console.log("obteniendo usuario");
  const { data, status, message } = await getUsers();

  return res.status(status).json({
    message,
    data,
  });
};
export const GetUser = async (req: Request, res: Response) => {
  
  // Recojemos el parametro que mandamos por la url por http ese es el parametro que le mandamos  
  const { cliente } = req.params;
  //codigo que se lo pasamos al sevicio para buscar al user
  const { data, status, message } = await getUser(parseInt(cliente));
  //Retornamos los datos un mensaje y un status 
  return res.status(status).json({
  });
  
};
export const CreateNewUser = async (req: Request, res: Response) => {
  const dato = req.body;
  
  
  // errror resolver despues
  console.log(dato);
  const { status, message } = await createNewUser(dato);
  //No me recuedo el error creo que es validator paramtros del usuarios 
  return res.status(status).json({
    message,
  });

  
};
export const updateUser = (req: Request, res: Response) => {
 const { cliente } = req.params;
  //terminar el update 
  res.send("Update  user");
};
export const DeleteUser = async (req: Request, res: Response) => {
  const { cliente } = req.params;

  const {message,status} = await deleteUser(parseInt(cliente));
  res.status(status).json({
    message
  })
  // res.send(user);
};

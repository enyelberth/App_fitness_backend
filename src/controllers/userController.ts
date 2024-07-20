import express, { Request, Response } from "express";
import { createNewUser, getUsers,deleteUser} from "../services/userService";

export const GetUsers = async (req: Request, res: Response) => {
  console.log("obteniendo usuario");
  const user = await getUsers();
  console.log(user);
  res.send(user);
};
export const getUser = (req: Request, res: Response) => {
  res.send("Obtener un usuario");
};

export const CreateNewUser = async (req: Request, res: Response) => {
  const dato = req.body;
  // console.log(dato);
  console.log(dato.id)
  // const user = await createNewUser(dato);

  // res.send(user);
};
export const updateUser = (req: Request, res: Response) => {
  res.send("Update  user");
};
export const DeleteUser = async (req: Request, res: Response) => {
   const dato = req.body;

   const user = await deleteUser(dato);

   res.send(user);
};

import express, { Request, Response } from "express";
import { createNewUser, getUsers,deleteUser} from "./userService";

export const GetUsers = async (req: Request, res: Response) => {
  const user = await getUsers();

  console.log("obteniendo usuario");
  res.send(user);
};
export const getUser = (req: Request, res: Response) => {
  res.send("Obtener un usuario");
};

export const CreateNewUser = async (req: Request, res: Response) => {
  const dato = req.body;
  console.log("asda");
  const user = await createNewUser(dato);

  res.send(user);
};
export const updateUser = (req: Request, res: Response) => {
  res.send("Update  user");
};
export const DeleteUser = async (req: Request, res: Response) => {
   const dato = req.body;

   const user = await deleteUser(dato);

   res.send(user);
};

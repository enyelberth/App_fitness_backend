import express, { Request, Response } from "express";
import {
  createNewUser,
  getUsers,
  deleteUser,
  getUser,
} from "../services/userService";

export const GetUsers = async (req: Request, res: Response) => {
  console.log("obteniendo usuario");
  const { data, status, message } = await getUsers();

  return res.status(status).json({
    message,
    data,
  });
};
export const GetUser = async (req: Request, res: Response) => {

  const { cliente } = req.params;
  const { data, status, message } = await getUser(parseInt(cliente));

  return res.status(status).json({
    message,
    data,
  });
};

export const CreateNewUser = async (req: Request, res: Response) => {
  const dato = req.body;
// errror resolver despues
  const { status, message } = await createNewUser(dato);

  return res.status(status).json({
    message,
    
  });
};
export const updateUser = (req: Request, res: Response) => {
  res.send("Update  user");
};
export const DeleteUser = async (req: Request, res: Response) => {
  const dato = req.body;

  const user = await deleteUser(dato);

  res.send(user);
};

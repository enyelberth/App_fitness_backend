import express, { Request, Response } from "express";
import { createNewUserAdmin, getUsersAdmin, deleteUSer } from "./userAdminServices";

export const GetUsers = async (req: Request, res: Response) => {
  const user = await getUsersAdmin();

  console.log("obteniendo usuario");
  res.send(user);
};
export const getUser = (req: Request, res: Response) => {
  res.send("Obtener un usuario");
};

export const CreateNewUser = async (req: Request, res: Response) => {
  const dato = req.body;

  const user = await createNewUserAdmin(dato);

  let mensaje =
    user == true
      ? "El usuario se Registro correctamente"
      : "El usuario no se pudo registrar";

  res.send(mensaje);
};
export const updateUser = (req: Request, res: Response) => {
  res.send("Update  user");
};
export const deleteUser = async (req: Request, res: Response) => {
  const dato = req.body;

  const deleteuser = await deleteUSer(dato);

  let mensaje =
    deleteuser == true
      ? "El usuario se Elimino correctamente"
      : "El usuario no se pudo Eliminar";

  res.send(mensaje);
};

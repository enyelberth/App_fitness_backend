import express, { Request, Response } from "express";
import { createNewProfile } from "./profileServices";

export const CreateNewUSer = async (req: Request, res: Response) => {
  const dato = req.body;

  const profile = await createNewProfile(dato);
  let mensaje =
    profile == true
      ? "El usuario se Registro correctamente"
      : "El usuario no se pudo registrar";

  res.send(mensaje);
};

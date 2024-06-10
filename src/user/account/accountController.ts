import express, { Request, Response } from "express";
import { createNewAccount,getAccounts } from "./accountService";
export const GetAccounts = async (req: Request, res: Response) => {
  const profile = await getAccounts();
  console.log("obteniendo Perfiles");

  res.send(profile);
};

export const CreateNewAccount = async (req: Request, res: Response) => {
  const dato = req.body;

  const profile = await createNewAccount(dato);

  res.send(profile);
};

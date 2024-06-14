import express, { Request, Response } from "express";
import {
  createNewAccount,
  getAccounts,
  getAccount,
  updateAccount,
} from "./accountService";
export const GetAccounts = async (req: Request, res: Response) => {
  const profile = await getAccounts();
  console.log("obteniendo Perfiles");

  res.send(profile);
};
export const GetAccount = async (req: Request, res: Response) => {
  const dato = req.body;
  const {id} = req.params;
  const account = await getAccount(id);
  // res.send(account);
  console.log(account);
  res.send(account);
};

export const CreateNewAccount = async (req: Request, res: Response) => {
  const dato = req.body;

  const account = await createNewAccount(dato);
  console.log("La cuenta fue registrada con exito");
  res.send(account);
};

export const UpdateAccount = async (req: Request, res: Response) => {
  const dato = req.body;

  const account = await updateAccount(dato);
  console.log("La cuenta fue MODIFICADA CON EXITO");
  res.send(account);
};

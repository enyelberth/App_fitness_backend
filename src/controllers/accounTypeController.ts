import express, { Request, Response } from "express";
import {createNewAccountType,getAccountsType} from "../services/accounts/accounTypeService";

export const GetAccountsType = async (req: Request, res: Response) => {
  const account = await getAccountsType();
  console.log("Obteniendo ACcoun type");

  res.send(account);
};

export const CreateNewAccountType = async (req: Request, res: Response) => {
  const dato = req.body;

  const accounttype = await createNewAccountType(dato);

  res.send(accounttype);
};

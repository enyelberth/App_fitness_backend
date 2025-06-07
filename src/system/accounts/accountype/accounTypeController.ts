import express, { Request, Response } from "express";
import {
  createNewAccountType,
  getAccountsTypes,
} from "./accounTypeService";
import { GetAccount } from "../accountController";
//Salen 
export const GetAccountsTypes = async (req: Request, res: Response) => {
  const { data, status, message } = await getAccountsTypes();
  console.log("Obteniendo ACcoun type");

  res.status(status).json({
    message,
    data,
  });
};

export const GetAccountType = async (req: Request, res: Response) => {
  const { cliente } = req.params;
  const { status, data, message } = await createNewAccountType(cliente);
  res.status(status).json({
    message,
    data,
  });
};

export const CreateNewAccountType = async (req: Request, res: Response) => {
  const dato = req.body;
  const {status,message,data} = await createNewAccountType(dato);
  res.status(status).json({
    message,
    data
  });

};

export const DeleteAccountType = async (req: Request, res: Response) => {
  const dato = req.body;
  const { cliente } = req.params;
  const accounttype = await createNewAccountType(dato);
  res.send(accounttype);
};

export const UpdateAccountType = async (req: Request, res: Response) => {
  const dato = req.body;
  const { cliente } = req.params;
  const accounttype = await createNewAccountType(dato);

  res.send(accounttype);
};

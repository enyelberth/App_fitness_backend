import express, { Request, Response } from "express";
import {createNewAccountType,getAccountsTypes} from "../services/accounts/accounTypeService";

export const GetAccountsTypes = async (req: Request, res: Response) => {
  const {data, status,message} = await getAccountsTypes();
  console.log("Obteniendo ACcoun type");

  res.status(status).json({
    message,
    data
  });

};

export const CreateNewAccountType = async (req: Request, res: Response) => {
  const dato = req.body;

  const accounttype = await createNewAccountType(dato);

  res.send(accounttype);
};

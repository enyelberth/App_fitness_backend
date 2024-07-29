import express, { Request, Response } from "express";
import { createNewProfile, getProfile } from "../services/users/profileServices";

export const GetProfile = async (req: Request, res: Response) => {
  
  const profile = await getProfile();
  console.log("obteniendo Perfiles");
  
  res.send(profile);
};

export const CreateNewProfile = async (req: Request, res: Response) => {
  const dato = req.body;
  
  const profile = await createNewProfile(dato);

  res.send(profile);
};

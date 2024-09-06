import { Request, Response } from "express";
import { createNewProfile, getProfiles } from "../services/users/profileServices";

export const GetProfiles = async (req: Request, res: Response) => {
  
  const {data,status,message} = await getProfiles();
  console.log("obteniendo Perfiles");
  
  return res.status(status).json({
    message,
    data
  });
  
};
export const GetProfile = async(req:Request,res:Response)=>{
  // const {cliente} = req.params;


}

export const CreateNewProfile = async (req: Request, res: Response) => {
  const dato = req.body;
  console.log(dato);
  const { message, status} = await createNewProfile(dato);


  return res.status(status).json({
    message,
  });
};

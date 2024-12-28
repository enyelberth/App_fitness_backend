import { Request, Response } from "express";
import {
  createNewProfile,
  getProfiles,
} from "../profile/profileServices";

export const GetProfiles = async (req: Request, res: Response) => {
  const { data, status, message } = await getProfiles();
  console.log("obteniendo Perfiles");

  return res.status(status).json({
    message,
    data,
  });
};
export const GetProfile = async (req: Request, res: Response) => {
  // const {cliente} = req.params;
};

export const CreateNewProfile = async (req: Request, res: Response) => {
  try {
    console.log("dato");
    const dato = req.body;
    const { message, status } = await createNewProfile(dato);

    return res.status(status).json({
      message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error contacte con el administrador",
      status: 500,
    });
  }
};

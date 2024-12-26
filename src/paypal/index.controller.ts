import { Request, Response } from "express";
import { captureOrder, createOrder, obtenerToken } from "./index.service";


export const CreateOrder = async (req: Request, res: Response) => {

  const order = await createOrder();

  res.send(order);
};

export const CaptureOrder = async (req: Request, res: Response) => {
  const params = new URLSearchParams();


  const token1 = params.get("token");
  const { token } = req.query;

  const order = await captureOrder(token);

  res.send(order);
};
export const cancelPayment = (req: Request, res: Response) => {
  res.redirect("/");
};

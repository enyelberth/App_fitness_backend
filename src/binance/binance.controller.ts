import { Request, Response } from "express";
import { getCurrency } from "./binance.service";


export const GetCurrencyBinance = async (req: Request, res: Response) => {
  const currency = await getCurrency();

  res.send(currency);
};

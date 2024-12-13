import exp from "constants";
import { Request, Response } from "express";
export const getSaldo = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Success",
    data: "saldo",
  });
};

export const getSaldoBySymbol = async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Success",
    data: "saldo",
  });
};

export const getSaldoBySymbolAndCurrency = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json({
    message: "Success",
    data: "saldo",
  });
};

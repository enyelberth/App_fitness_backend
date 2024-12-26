import exp from "constants";
import { Request, Response } from "express";
export const getCurrency = async () => {
  try{

    const data = await fetch('https://api.binance.com/api/v3/exchangeInfo');
      console.log(data);
    return {
      status: 200,
      message: "Success",
      data: data,
    };
  }catch(error){
return{
  status:500,
  data: `Error contacte con el administrador ${error}`
}
  }
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

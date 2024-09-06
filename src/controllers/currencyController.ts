import express, { Request, Response } from "express";
import { getcurrencys } from "../services/accounts/currencyService";

export const GetCurrency = (req:Request,res:Response)=>{ 
    

}
export const GetCurrencys = async (req:Request,res:Response)=>{
    const datos = req.body;


    const {status,data,message} = await getcurrencys();

    return res.status(status).json({
        message,
        status
    });
}
export const CreateCurrency = (req:Request,res:Response)=>{

}
export const DeleteCurrency = (req:Request,res:Response)=>{

}
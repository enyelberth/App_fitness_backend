import express, { Request, Response } from "express";
import { createcurrrency, getcurrencys } from "../currency/currencyService";

export const GetCurrency = (req:Request,res:Response)=>{ 
    

}
export const GetCurrencys = async (req:Request,res:Response)=>{
    const datos = req.body;
    console.log("adsasda");

    const {status,data,message} = await getcurrencys();

    return res.status(status).json({
        message,
        status
    });
}
export const CreateCurrency = async (req:Request,res:Response)=>{
    console.log(req.body);
    const {status,data,message} = await createcurrrency(req.body);
    
    return res.status(status).json({
        message,
        data
    });

}
export const DeleteCurrency = (req:Request,res:Response)=>{

}
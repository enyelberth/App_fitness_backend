import express, { Request, Response } from "express";
import { createTransaction, getTransactions } from "./transactionService";

export const GetTransaction = (req:Request,res:Response)=>{ 
    

}
export const GetTransactions = async (req:Request,res:Response)=>{
    const datos = req.body;
    console.log("adsasda");

    const {status,data,message} = await getTransactions(req.body.accountId);

    return res.status(status).json({
        message,
        data,
        status
    });
}
export const CreateTransaction = async (req:Request,res:Response)=>{
    console.log(req.body);
    const {status,data,message} = await createTransaction(req.body);
    
    return res.status(status).json({
        message,
        data
    });

}

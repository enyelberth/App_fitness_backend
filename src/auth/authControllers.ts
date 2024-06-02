import express, { Request, Response } from "express";


export const Login = (req:Request,res:Response)=>{
    const {username,password} = req.body;
};

export const Logout = (req: Request, res: Response) => {

};
import { Request,Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
export const ensureToken = (req:Request,res:Response,next:NextFunction)=>{
    const bearerHeader = req.headers["authorization"];
    // console.log(bearerHeader);


    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];

        console.log(bearerToken);
     
        console.log(bearerToken);
        const payload = jwt.verify(bearerToken,secret);
        console.log(payload);
        // req.token = bearerToken;
        if(Date.now> payload.exp){
            return res.status(401).send({erro:"Token expired"});
        }

        next();
    }else{
        res.status(500).json({
            message: "Error"
        });
    }
    
}
import { Request,Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
export const ensureToken=(req:Request,res:Response,next:NextFunction)=>{

    try{


        const bearerHeader = req.headers["authorization"];
        console.log(bearerHeader);
        
        
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(" ")[1];
            const bearerToken = bearer[1];
            console.log(bearerToken);
            const payload = jwt.verify(bearerToken,secret);
            // req.token = bearerToken;
            if(Date.now> payload.exp){
                return res.status(401).send({erro:"Token expired"});
            }
            
            next();
        }else{
            res.status(403)
        }
    }catch(error){
        console.log(`Error contacte con el adiminsitrador ${error}`);
    }
    
}
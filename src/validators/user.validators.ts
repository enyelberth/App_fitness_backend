import { NextFunction,Request,Response } from "express";
import { body } from "express-validator";

class UserValidator {
    public validateUser = [
       
        body("id").notEmpty().withMessage("Id is required"),
        body("id").isNumeric().withMessage("id is type INT"),
        body("name").notEmpty().withMessage("Name is required"),
        body("name").isString().withMessage("Name is type String"),
        body("email").notEmpty().withMessage("Email is required"),
        body("email").isEmail().withMessage("The Email is type email required"),
        body("username").notEmpty().withMessage("Username is required"),
        body("username").isString().withMessage("Username is type String"),
        body("password").notEmpty().withMessage("Password is required"),
        body("password").isString().withMessage("Password is type String"),
    ];
    verifyId =(req:Request,res:Response,next:NextFunction)=>{
        next();
    }

}

export {UserValidator};
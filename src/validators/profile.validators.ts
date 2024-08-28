import { NextFunction, Request, Response } from "express";
import {
  body,
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";

class ProfileValidator {
  public validateProfile = [
    
    
    body("userId").notEmpty().withMessage("Id is required"),
    body("userId").isNumeric().withMessage("id is type INT"),

    body("firstName").notEmpty().withMessage("Email is required"),
    body("firstName").isEmail().withMessage("The Email is type email required"),
   
    body("lastName").notEmpty().withMessage("Email is required"),
    body("lastName").isEmail().withMessage("The Email is type email required"),
    
    
    body("dob").notEmpty().withMessage("Email is required"),
    body("dob").isEmail().withMessage("The Email is type email required"),
   
    
        
    body("address").notEmpty().withMessage("Email is required"),
    body("address").isEmail().withMessage("The Email is type email required"),
   
    body("phone").notEmpty().withMessage("Email is required"),
    body("phone").isEmail().withMessage("The Email is type email required"),
   
  ];


  verifyId = (req: Request, res: Response, next: NextFunction) => {
    
    const result = validationResult(req);
    if (result.isEmpty()) next();
    else res.status(401).json(result);
  
};
}

export { ProfileValidator };

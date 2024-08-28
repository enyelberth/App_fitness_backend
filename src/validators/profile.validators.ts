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
    body("userId").notEmpty().withMessage("userId is required"),
    body("userId").isNumeric().withMessage("userId is type number"),
    body("firstName").notEmpty().withMessage("firstName is required"),
    body("firstName").isString().withMessage("firstName is type String"),
    body("lastName").notEmpty().withMessage("lastName is required"),
    body("lastName").isString().withMessage("lastName is type String"),
    body("dob").notEmpty().withMessage("dob is required"),
    body("dob").isDate().withMessage("dob is type dateTime"),
    body("address").notEmpty().withMessage("address is required"),
    body("address").isString().withMessage("address is type String"),
    body("phone").notEmpty().withMessage("phone is required"),
    body("phone").isNumeric().withMessage("phone is type number"),
  ];


  verifyId = (req: Request, res: Response, next: NextFunction) => {
    
    const result = validationResult(req);
    if (result.isEmpty()) next();
    else res.status(401).json(result);
  
};
}

export { ProfileValidator };

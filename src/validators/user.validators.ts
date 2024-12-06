import { NextFunction, Request, Response } from "express";
import {
  body,
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";

const signUpCheck = () => {
    return [
        body('password').trim().notEmpty().isLength({ min: 6 }),
        body('cfpassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        }),
    ];
};
class UserValidator {
  public validateUser = [
    body("id").notEmpty().withMessage("Id is required"),
    body("id").isNumeric().withMessage("id is type INT"),

    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("The Email is type email required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("username").isString().withMessage("Username is type String"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password").isString().withMessage("Password is type String"),
  ];


  verifyId = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) next();
    else res.status(401).json(result);
  };
}

export { UserValidator,signUpCheck };

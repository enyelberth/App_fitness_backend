import express, { NextFunction, Request, Response } from "express";
import { login } from "./authServices";

const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

export const Login = async (req: Request,res: Response,next: NextFunction) => {
  const datos = req.body;

  const { status, message, token } = await login(datos.username, datos.password);

  res.status(status).json({
    message,
    token,
  });

  next()
};

export const Logout = (req: Request, res: Response) => {};

// export default Login;

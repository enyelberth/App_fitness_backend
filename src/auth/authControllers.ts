import express, { NextFunction, Request, Response } from "express";
// import { ensureToken } from "../middlewares";
// import jwt from 'jsonwebtoken';
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

export const Login = (req: Request, res: Response, next: NextFunction) => {
  // const {username,password} = req.body;
//   const user = {
//     id: 30204334,
//     username: "enyelberth",
//   };
  const { id: sub, name } = { id: "er12", name: "erap" };
//   const a = "ebnye";
  const token = jwt.sign({
    sub,
    name,
    exp:Date.now() +60*10000
   }, secret);


  res.json({ token });
};

export const Logout = (req: Request, res: Response) => {};

// export default Login;

import express, { Request, Response } from "express";

import {Login} from '../auth/authControllers';
import { ensureToken } from '../middlewares/index';

const jwt = require("jsonwebtoken");



// const product = require("../../controllers/productController");

const router = express.Router();


router.get("/",Login);

router.get("/a",ensureToken,(req,res)=>{
    res.send("ESta ruta esta protegida");
});

// router.get("/a",ensureToken,(req:Request,res:Response)=>{
//     jwt.verify(req.token,"er10",(err,data)=>{
//         if(err){
//             res.sendStatus(403);
//         }else{
//             res.send("SE accesdfiao");
//         }
//     });
// });
router.post("/auth", (req,res)=>{
    console.log("asdas");
    const {username, password} = req.body;

    const user ={username: username};
    const accessToken = generateAccessToken(user);
    res.header('authorization',accessToken).json({
        message: 'Usuario Autenticado',
        token: accessToken
    });
});

function generateAccessToken(user:any){

    return jwt.sign(user, process.env.SECRET,{expiresIn:'5m'});
}

// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });

// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });

export default router;

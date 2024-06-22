import express, { Request, Response } from "express";
import { env } from "process";
require('dotenv').config();
const jwt = require('jsonwebtoken');
// const product = require("../../controllers/productController");
const router = express.Router();

// router.get("/", product.getProducts);

router.get("/:auth", (_req: Request, res: Response) => {
  res.send("Hola esyo ess");
});

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

module.exports = router;

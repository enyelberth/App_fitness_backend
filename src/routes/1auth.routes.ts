import Router, { Request, Response } from "express";


const jwt = require('jsonwebtoken');
const router = Router();


router.get('/',(req:Request,res:Response)=>{
    res.json({
        text: "hola"
    });
}
);


router.post('/login',(req:Request,res:Response)=>{
    
    const user= {
        id:30204334,
        name: "enyelberth",
    };
    const token = jwt.sign({user},'er10'); 
    
    res.json({
        token
    });
});


export default router;
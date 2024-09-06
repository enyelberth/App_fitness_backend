const jwt = require("jsonwebtoken");


const secret = process.env.SECRET;


export const login = async  (dato:any)=>{
    
    const username = "enyelberth"; 
    const token = jwt.sign({username},secret);

    return {
        status: 200,
        message: `El usuario a Iniciado sesion correctamene`,
        token: token,
    }
}

export const Logout= (dato:any)=>{

}
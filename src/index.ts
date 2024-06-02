import express from "express";
const cors = require("cors");
const  user = require("./v1/routes/user.routes");
const rutas  = require("./v1/routes/index");
const productos = require("./v1/routes/product.routes");

const auth = require('./v1/routes/auth');
const app = express();
const corOptiopns = {
    origin: '*',
    optionsSuccessStatus:200
}
app.use(cors(corOptiopns));
app.use(express.json());
const PORT = 4000;

// app.use("/api/v1",rutas);
app.use("/api/v2/productos", productos);
app.use("/api/v2/user", user);
// app.use("/api/v2/auth", aut);
// app.use("/api/v1", (req,res)=>{
//     res.send('HOla a tood');

// }); 
app.listen(PORT,()=>{
    console.log('Listando server');
});
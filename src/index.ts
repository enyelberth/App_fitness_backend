import express from "express";

// import user from "./v1/routes/user.router.ts";
const cors = require("cors");
const  user = require("./routes/user.routes");
const rutas  = require("./routes/index");
const productos = require("./routes/product.routes");
const profile = require("./routes/profiles.routes");
const auth = require('./routes/auth');

const accountType = require('./routes/accountType.routes');
const account = require('./routes/account.route');
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
app.use("/api/v2/profile", profile);
app.use("/api/v2/user", user);
app.use("/api/v2/accountype", accountType);
app.use("/api/v2/account", account);
// app.use("/api/v2/auth", aut);
// app.use("/api/v1", (req,res)=>{
//     res.send('HOla a tood');

// }); 
app.listen(PORT,()=>{
    console.log('Listando server');
});
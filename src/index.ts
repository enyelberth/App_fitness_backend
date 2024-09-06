// import express from "express";
// import {account,accountType,producto, profile, user} from "./routes/index";


// const cors = require("cors");
// const app = express();
// const corOptiopns = {
//     origin: '*',
//     optionsSuccessStatus:200
// };

// app.use(cors(corOptiopns));
// const PORT = 4000;
// app.use(express.json());

// app.use("/api/v2/productos", producto);
// app.use("/api/v2/profile", profile);
// app.use("/api/v2/user", user);
// app.use("/api/v2/accountype", accountType);
// app.use("/api/v2/account", account);

// app.listen(PORT,()=>{
//     console.log('Listando server');
// });

import {Server} from "../src/server/server";

const server = new Server();

server.listen();

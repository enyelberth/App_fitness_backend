import express from "express";
import { account, accountType, auth, binance, paypal, producto, profile, user } from "../routes/index";
import path from "path";
// import { version } from "os";
const cors = require("cors");
// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


const swaggerSpec={
  definition:{
    openapi:"3.0.0",
    info:{
      title: "Sistema Contable",
      version: "1.0.0",
    },
    servers:[
      {
        url:"http://localhost:4000/api"
      }
    ]
  },
  apis:[`${path.join(__dirname, 'routes')}/*.route.ts`]
}
 
export class Server {
  private app: any;
  private port: string | number;
  private pre: string;
  private paths: any;
  private corsOptions: any;
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.corsOptions = {
      origin: "*",
      optionsSuccessStatus: 200,
    };
    this.pre = "/api";
    this.paths = {
      user: this.pre + "/user",
      product: this.pre + "/product",
      account: this.pre + "/account",
      accountType: this.pre + "/accountType",
      profile: this.pre + "/profile",
      auth: this.pre + "/auth",
      paypal: this.pre + "/paypal",
      binance: this.pre + "/binance",
      docs: "/docs",
    };
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }
  routes() {
    this.app.use(this.paths.docs, swaggerUi.serve,swaggerUi.setup(swaggerJsDoc(swaggerSpec)));
    this.app.use(this.paths.auth, auth);
    this.app.use(this.paths.user, user);
    this.app.use(this.paths.product, producto);
    this.app.use(this.paths.account, account);
    this.app.use(this.paths.accountType, accountType);
    this.app.use(this.paths.profile, profile);
    this.app.use(this.paths.paypal, paypal);
    this.app.use(this.paths.binance, binance);
  }
  listen() {
    this.app.listen(this.port, () => {
      console.clear()
      console.log(`Servidor corriendo en localhost : ${this.port}`);
    });
  }
}

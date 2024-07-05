import express from "express";
// import cors from "cors";
import { account, accountType, profile, user } from "../routes/index";
import { getUser } from "../controllers/userController";

const cors = require("cors");

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
      account: this.pre + "/account",
      accountType: this.pre + "/accountType",
      profile:this.pre + "/profile",
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
    this.app.use(this.paths.user, user);
    this.app.use(this.paths.account, account);
    this.app.use(this.paths.accountType,accountType);
    this.app.use(this.paths.profile,profile);
}
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en localhost : ${this.port}`);
    });
  }
}

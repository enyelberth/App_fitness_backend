import express from "express";
import session from "express-session";
import passport from "passport"; // <-- Importa passport aquí
import { account, accountType, routine,auth, authGoogle, binance, categoryProduct, currency, muscle, paypal, producto, profile, subcategoryProuct, transaction, user } from "../routes/index";
import path from "path";
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "App fitness",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000/api"
      }
    ]
  },
  apis: [path.join(__dirname, "../routes/*.ts")],
};

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
      productCategory: this.pre + "/productCategory",
      subCategoryProduct: this.pre + "/subCategoryProduct",
      account: this.pre + "/account",
      ejercicio: this.pre + "/ejercicio",
      accountType: this.pre + "/accountType",
      profile: this.pre + "/profile",
      auth: this.pre + "/auth",
      authGoogle: this.pre + "/authGoogle", // <-- Asegúrate de que la ruta esté correctamente definida
      paypal: this.pre + "/paypal",
      binance: this.pre + "/binance",
      currency: this.pre + "/currency",
      transaction: this.pre + "/transaction",
      muscle: this.pre + "/muscle",      
      routine: this.pre + "/routine",
      docs: "/docs",
    };
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors(this.corsOptions));
    this.app.use(express.json());
    this.app.use(express.static("public"));
    this.app.use(session({
      secret: 'un_secreto_seguro',
      resave: false,
      saveUninitialized: false
    }));

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  routes() {
    this.app.use(this.paths.docs, swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));
    this.app.use(this.paths.auth, auth);
    this.app.use(this.paths.authGoogle, authGoogle); // <-- Asegúrate de que la ruta esté correctamente importada
    this.app.use(this.paths.user, user);
    this.app.use(this.paths.product, producto);
    this.app.use(this.paths.productCategory, categoryProduct);
    this.app.use(this.paths.subCategoryProduct, subcategoryProuct);
    this.app.use(this.paths.account, account);
    this.app.use(this.paths.accountType, accountType);
    this.app.use(this.paths.profile, profile);
    this.app.use(this.paths.paypal, paypal);
    this.app.use(this.paths.ejercicio, account);
    this.app.use(this.paths.binance, binance);
    this.app.use(this.paths.currency, currency);
    this.app.use(this.paths.transaction, transaction);
    this.app.use(this.paths.muscle, muscle);
    this.app.use(this.paths.routine, routine);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.clear();
      console.log(`Servidor corriendo en localhost : ${this.port}`);
      console.log(`Swagger docs en http://localhost:${this.port}/docs`);
    });
  }
}

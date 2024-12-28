"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../routes/index");
const path_1 = __importDefault(require("path"));
// import { version } from "os";
const cors = require("cors");
// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sistema Contable",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:4000/api"
            }
        ]
    },
    apis: [`${path_1.default.join(__dirname, 'routes')}/*.route.ts`]
};
class Server {
    constructor() {
        this.app = (0, express_1.default)();
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
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.static("public"));
    }
    routes() {
        this.app.use(this.paths.docs, swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerSpec)));
        this.app.use(this.paths.auth, index_1.auth);
        this.app.use(this.paths.user, index_1.user);
        this.app.use(this.paths.product, index_1.producto);
        this.app.use(this.paths.productCategory, index_1.categoryProduct);
        this.app.use(this.paths.subCategoryProduct, index_1.subcategoryProuct);
        this.app.use(this.paths.account, index_1.account);
        this.app.use(this.paths.accountType, index_1.accountType);
        this.app.use(this.paths.profile, index_1.profile);
        this.app.use(this.paths.paypal, index_1.paypal);
        this.app.use(this.paths.binance, index_1.binance);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.clear();
            console.log(`Servidor corriendo en localhost : ${this.port}`);
        });
    }
}
exports.Server = Server;

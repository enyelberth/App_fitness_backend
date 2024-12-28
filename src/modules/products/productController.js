"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.CreateNewProduct = exports.getOneProduct = exports.GetProducts = void 0;
// import { CreateNewProducto, getProduct } from "../services/productService";
const productService_1 = require("./productService");
const producto = new productService_1.ProductService();
const GetProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield producto.getProducts();
    res.json(user);
});
exports.GetProducts = GetProducts;
const getOneProduct = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Obteniendo un product");
});
exports.getOneProduct = getOneProduct;
const CreateNewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    console.log("Asdad");
    console.log(req.body.title);
    // const dato = req.body;
    console.log(dato);
    const user = yield producto.createNewProduct(dato);
    // res.send(dato);
    res.send(user);
    console.log("Se registro correctamente a ${user.}");
});
exports.CreateNewProduct = CreateNewProduct;
const updateProduct = () => {
    return 'el usuario Asido actializado';
};
exports.updateProduct = updateProduct;
const deleteProduct = () => {
    return 'el usuario as sido eliminado';
};
exports.deleteProduct = deleteProduct;

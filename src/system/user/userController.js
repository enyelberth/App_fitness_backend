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
exports.DeleteUser = exports.updateUser = exports.CreateNewUser = exports.GetUser = exports.GetUsers = void 0;
const userService_1 = require("./userService");
const GetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("obteniendo usuario");
    const { data, status, message } = yield (0, userService_1.getUsers)();
    return res.status(status).json({
        message,
        data,
    });
});
exports.GetUsers = GetUsers;
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Recojemos el parametro que mandamos por la url por http ese es el parametro que le mandamos  
    const { cliente } = req.params;
    //codigo que se lo pasamos al sevicio para buscar al user
    const { data, status, message } = yield (0, userService_1.getUser)(parseInt(cliente));
    //Retornamos los datos un mensaje y un status 
    return res.status(status).json({});
});
exports.GetUser = GetUser;
const CreateNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    // errror resolver despues
    console.log(dato);
    const { status, message } = yield (0, userService_1.createNewUser)(dato);
    //No me recuedo el error creo que es validator paramtros del usuarios 
    return res.status(status).json({
        message,
    });
});
exports.CreateNewUser = CreateNewUser;
const updateUser = (req, res) => {
    const { cliente } = req.params;
    //terminar el update 
    res.send("Update  user");
};
exports.updateUser = updateUser;
const DeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente } = req.params;
    const { message, status } = yield (0, userService_1.deleteUser)(parseInt(cliente));
    res.status(status).json({
        message
    });
    // res.send(user);
});
exports.DeleteUser = DeleteUser;

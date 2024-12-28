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
exports.deleteUser = exports.updateUser = exports.CreateNewUser = exports.getUser = exports.GetUsers = void 0;
const userAdminServices_1 = require("../services/userAdminServices");
const GetUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userAdminServices_1.getUsersAdmin)();
    console.log("obteniendo usuario");
    res.send(user);
});
exports.GetUsers = GetUsers;
const getUser = (req, res) => {
    res.send("Obtener un usuario");
};
exports.getUser = getUser;
const CreateNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const user = yield (0, userAdminServices_1.createNewUserAdmin)(dato);
    let mensaje = user == true
        ? "El usuario se Registro correctamente"
        : "El usuario no se pudo registrar";
    res.send(mensaje);
});
exports.CreateNewUser = CreateNewUser;
const updateUser = (req, res) => {
    res.send("Update  user");
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const deleteuser = yield (0, userAdminServices_1.deleteUSer)(dato);
    let mensaje = deleteuser == true
        ? "El usuario se Elimino correctamente"
        : "El usuario no se pudo Eliminar";
    res.send(mensaje);
});
exports.deleteUser = deleteUser;

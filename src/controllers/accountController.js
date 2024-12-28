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
exports.UpdateAccount = exports.CreateNewAccount = exports.GetAccount = exports.GetAccounts = void 0;
const accountService_1 = require("../services/accounts/accountService");
const GetAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield (0, accountService_1.getAccounts)();
    console.log("obteniendo Perfiles");
    res.send(profile);
});
exports.GetAccounts = GetAccounts;
const GetAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const { id } = req.params;
    const account = yield (0, accountService_1.getAccount)(id);
    // console.log(account);
    res.send(account);
});
exports.GetAccount = GetAccount;
const CreateNewAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const account = yield (0, accountService_1.createNewAccount)(dato);
    console.log("La cuenta fue registrada con exito");
    res.send(account);
});
exports.CreateNewAccount = CreateNewAccount;
const UpdateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const account = yield (0, accountService_1.updateAccount)(dato);
    console.log("La cuenta fue MODIFICADA CON EXITO");
    res.send(account);
});
exports.UpdateAccount = UpdateAccount;

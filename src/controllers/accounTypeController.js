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
exports.UpdateAccountType = exports.DeleteAccountType = exports.CreateNewAccountType = exports.GetAccountType = exports.GetAccountsTypes = void 0;
const accounTypeService_1 = require("../services/accounts/accounTypeService");
const GetAccountsTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status, message } = yield (0, accounTypeService_1.getAccountsTypes)();
    console.log("Obteniendo ACcoun type");
    res.status(status).json({
        message,
        data,
    });
});
exports.GetAccountsTypes = GetAccountsTypes;
const GetAccountType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cliente } = req.params;
    const { status, data, message } = yield (0, accounTypeService_1.createNewAccountType)(cliente);
    res.status(status).json({
        message,
        data,
    });
});
exports.GetAccountType = GetAccountType;
const CreateNewAccountType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const { status, message, data } = yield (0, accounTypeService_1.createNewAccountType)(dato);
    res.status(status).json({
        message,
        data
    });
});
exports.CreateNewAccountType = CreateNewAccountType;
const DeleteAccountType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const { cliente } = req.params;
    const accounttype = yield (0, accounTypeService_1.createNewAccountType)(dato);
    res.send(accounttype);
});
exports.DeleteAccountType = DeleteAccountType;
const UpdateAccountType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dato = req.body;
    const { cliente } = req.params;
    const accounttype = yield (0, accounTypeService_1.createNewAccountType)(dato);
    res.send(accounttype);
});
exports.UpdateAccountType = UpdateAccountType;

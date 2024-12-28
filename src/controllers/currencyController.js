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
exports.DeleteCurrency = exports.CreateCurrency = exports.GetCurrencys = exports.GetCurrency = void 0;
const currencyService_1 = require("../services/accounts/currencyService");
const GetCurrency = (req, res) => {
};
exports.GetCurrency = GetCurrency;
const GetCurrencys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const datos = req.body;
    const { status, data, message } = yield (0, currencyService_1.getcurrencys)();
    return res.status(status).json({
        message,
        status
    });
});
exports.GetCurrencys = GetCurrencys;
const CreateCurrency = (req, res) => {
};
exports.CreateCurrency = CreateCurrency;
const DeleteCurrency = (req, res) => {
};
exports.DeleteCurrency = DeleteCurrency;

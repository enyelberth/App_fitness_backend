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
exports.cancelPayment = exports.CaptureOrder = exports.CreateOrder = void 0;
const index_service_1 = require("./index.service");
const CreateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield (0, index_service_1.createOrder)();
    res.send(order);
});
exports.CreateOrder = CreateOrder;
const CaptureOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = new URLSearchParams();
    const token1 = params.get("token");
    const { token } = req.query;
    const order = yield (0, index_service_1.captureOrder)(token);
    res.send(order);
});
exports.CaptureOrder = CaptureOrder;
const cancelPayment = (req, res) => {
    res.redirect("/");
};
exports.cancelPayment = cancelPayment;

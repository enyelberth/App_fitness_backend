"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt = require('jsonwebtoken');
const router = (0, express_1.default)();
router.get('/', (req, res) => {
    res.json({
        text: "hola"
    });
});
router.post('/login', (req, res) => {
    const user = {
        id: 30204334,
        name: "enyelberth",
    };
    const token = jwt.sign({ user }, 'er10');
    res.json({
        token
    });
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureToken = void 0;
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    // console.log(bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        console.log(bearerToken);
        console.log(bearerToken);
        const payload = jwt.verify(bearerToken, secret);
        console.log(payload);
        // req.token = bearerToken;
        if (Date.now > payload.exp) {
            return res.status(401).send({ erro: "Token expired" });
        }
        next();
    }
    else {
        res.status(500).json({
            message: "Error"
        });
    }
};
exports.ensureToken = ensureToken;

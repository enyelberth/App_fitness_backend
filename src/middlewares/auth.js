"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureToken = void 0;
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const ensureToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        console.log(bearerHeader);
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(" ")[1];
            const bearerToken = bearer[1];
            console.log(bearerToken);
            const payload = jwt.verify(bearerToken, secret);
            // req.token = bearerToken;
            if (Date.now > payload.exp) {
                return res.status(401).send({ erro: "Token expired" });
            }
            next();
        }
        else {
            res.status(403);
        }
    }
    catch (error) {
        console.log(`Error contacte con el adiminsitrador ${error}`);
    }
};
exports.ensureToken = ensureToken;

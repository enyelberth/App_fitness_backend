"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../auth/authControllers");
const index_1 = require("../middlewares/index");
const jwt = require("jsonwebtoken");
// const product = require("../../controllers/productController");
const router = express_1.default.Router();
router.get("/", authControllers_1.Login);
router.get("/a", index_1.ensureToken, (req, res) => {
    res.send("ESta ruta esta protegida");
});
// router.get("/a",ensureToken,(req:Request,res:Response)=>{
//     jwt.verify(req.token,"er10",(err,data)=>{
//         if(err){
//             res.sendStatus(403);
//         }else{
//             res.send("SE accesdfiao");
//         }
//     });
// });
router.post("/auth", (req, res) => {
    console.log("asdas");
    const { username, password } = req.body;
    const user = { username: username };
    const accessToken = generateAccessToken(user);
    res.header('authorization', accessToken).json({
        message: 'Usuario Autenticado',
        token: accessToken
    });
});
function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET, { expiresIn: '5m' });
}
// router.patch("/:cliente", (_req: Request, res: Response) => {
//   res.send("Update an existing workout");
// });
// router.delete("/:cliente", (_req: Request, res: Response) => {
//   res.send("Delete an existing workout");
// });
exports.default = router;

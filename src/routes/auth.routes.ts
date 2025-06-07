import express, { Request, Response } from "express";
import { ensureToken } from '../middlewares/index';
import { Login } from "../auth/authControllers";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", Login);

router.get("/a", ensureToken, (req: Request & { token?: string }, res: Response) => {
  // Verificamos el token JWT
  if (!req.token) {
    return res.sendStatus(401);
  }
  jwt.verify(req.token, process.env.SECRET || "er10", (err, data) => {
    if (err) {
      return res.sendStatus(403);
    } else {
      res.send("Esta ruta está protegida y el token es válido");
    }
  });
});

router.post("/auth", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Aquí deberías validar username y password contra tu base de datos

  const user = { username };
  const accessToken = generateAccessToken(user);

  res.header('authorization', accessToken).json({
    message: 'Usuario autenticado',
    token: accessToken
  });
});

function generateAccessToken(user: any) {
  return jwt.sign(user, process.env.SECRET || "er10", { expiresIn: '5m' });
}

export default router;

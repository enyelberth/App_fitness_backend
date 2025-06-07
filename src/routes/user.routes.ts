import { Router } from "express";
import {
  GetUsers,
  CreateNewUser,
  DeleteUser,
  GetUser,
} from "../system/users/userController";
import { userValidator } from "../validators/user.validators";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gestionar usuarios
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 */
router.get("/", GetUsers);

/**
 * @swagger
 * /user/{cliente}:
 *   get:
 *     summary: Obtiene un usuario por ID o cliente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: cliente
 *         schema:
 *           type: string
 *         required: true
 *         description: ID o identificador del cliente
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:cliente", GetUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/", userValidator.validateUser.bind(userValidator), CreateNewUser);

export default router;

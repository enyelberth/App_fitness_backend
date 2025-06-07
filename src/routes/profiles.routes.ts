import { Router, Request, Response } from "express";
import {
  CreateNewProfile,
  GetProfiles,
} from "../system/users/profile/profileController";
import { profileValidator } from "../validators/profile.validators";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: API para gestionar perfiles
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtiene todos los perfiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Lista de perfiles
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
 *                     example: "Perfil Ejemplo"
 *                   descripcion:
 *                     type: string
 *                     example: "Descripción del perfil"
 */
router.get("/", GetProfiles);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Crea un nuevo perfil
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Perfil Ejemplo"
 *               descripcion:
 *                 type: string
 *                 example: "Descripción del perfil"
 *     responses:
 *       201:
 *         description: Perfil creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post("/", profileValidator.validateProfile.bind(profileValidator), CreateNewProfile);

export default router;

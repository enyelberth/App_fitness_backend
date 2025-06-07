import { Router, Request, Response } from "express";
//import { MuscleService } from "../modules/exercise/muscle/muscleService";
import { GetMuscle } from "../modules/exercise/muscle/muscleController";

const router = Router();
//const muscle = new MuscleService();

/**
 * @swagger
 * tags:
 *   name: Muscle
 *   description: API para gestionar músculos
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene todos los músculos
 *     tags: [Muscle]
 *     responses:
 *       200:
 *         description: Lista de músculos obtenida correctamente
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
 *                   name:
 *                     type: string
 *                     example: "Bíceps"
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", GetMuscle);

export default router;

import { Router, Request, Response } from "express";
import { GetCurrencyBinance } from "../system/binance/binance.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Binance
 *   description: API para obtener información de monedas desde Binance
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Obtiene la información de la moneda desde Binance
 *     tags: [Binance]
 *     responses:
 *       200:
 *         description: Información de la moneda obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                   example: "BTCUSDT"
 *                 price:
 *                   type: string
 *                   example: "30000.00"
 *       500:
 *         description: Error al obtener la información
 */
router.get("/", GetCurrencyBinance);

export default router;

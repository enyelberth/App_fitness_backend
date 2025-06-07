import { Router, Request, Response } from "express";
import { CreateOrder, CaptureOrder } from "../system/paypal/index.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PayPal
 *   description: API para operaciones con PayPal
 */

/**
 * @swagger
 * /createorder:
 *   get:
 *     summary: Crea una nueva orden de pago
 *     tags: [PayPal]
 *     responses:
 *       200:
 *         description: Orden creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                   example: "5O190127TN364715T"
 *                 status:
 *                   type: string
 *                   example: "CREATED"
 *       400:
 *         description: Error en la creación de la orden
 */
router.get("/createorder", CreateOrder);

/**
 * @swagger
 * /captureorder:
 *   get:
 *     summary: Captura una orden de pago existente
 *     tags: [PayPal]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden a capturar
 *     responses:
 *       200:
 *         description: Orden capturada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 captureId:
 *                   type: string
 *                   example: "3C6791234L1234567"
 *                 status:
 *                   type: string
 *                   example: "COMPLETED"
 *       400:
 *         description: Error en la captura de la orden
 *       404:
 *         description: Orden no encontrada
 */
router.get("/captureorder", CaptureOrder);

export default router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerToken = exports.createOrder = exports.captureOrder = void 0;
const buffer_1 = require("buffer");
const url_1 = require("url");
const paypal_API = process.env.PAYPAL_API;
const clientId = process.env.PAYPAL_API_CLIENT;
const clientSecret = process.env.PAYPAL_API_SECRET;
const captureOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenResponse = yield (0, exports.obtenerToken)();
        if (tokenResponse.status !== 200) {
            throw new Error('No se pudo obtener el token de acceso');
        }
        const response = yield fetch(`${paypal_API}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenResponse.data}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        // console.log("asdadasdas")
        const data = yield response.json();
        return {
            status: 200,
            data: data
        };
    }
    catch (error) {
        console.error('Error en captureOrder:', error);
        return {
            message: `Error al capturar la orden: ${error}`,
            status: 500,
        };
    }
});
exports.captureOrder = captureOrder;
const createOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "50.00",
                    },
                },
            ],
            application_context: {
                brand_name: "STorre online",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `http://localhost:4000/api/paypal/captureorder`,
                cancel_url: "http://localhost:4000/api/user"
            }
        };
        const tokenResponse = yield (0, exports.obtenerToken)();
        if (tokenResponse.status !== 200) {
            throw new Error('No se pudo obtener el token de acceso');
        }
        const response = yield fetch(`${paypal_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenResponse.data}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
        if (!response.ok) {
            throw new Error(`Error al crear la orden: ${response.statusText}`);
        }
        const data = yield response.json();
        return {
            message: `Orden creada exitosamente`,
            status: 200,
            data: data,
        };
    }
    catch (error) {
        console.error('Error en createOrder:', error);
        return {
            message: `Contacte con el administrador, se encontró el error: ${error}`,
            status: 500,
        };
    }
});
exports.createOrder = createOrder;
const obtenerToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = new url_1.URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const response = yield fetch(`${paypal_API}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${buffer_1.Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        if (!response.ok) {
            throw new Error(`Error al obtener el token: ${response.statusText}`);
        }
        const data = yield response.json();
        return {
            status: 200,
            data: data.access_token
        };
    }
    catch (error) {
        console.error('Error en obtenerToken:', error);
        return {
            status: 500,
            error: error
        };
    }
});
exports.obtenerToken = obtenerToken;

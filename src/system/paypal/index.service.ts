import { Buffer } from 'buffer'; 
import { URLSearchParams } from 'url';

const paypal_API = process.env.PAYPAL_API;
const clientId = process.env.PAYPAL_API_CLIENT;
const clientSecret = process.env.PAYPAL_API_SECRET;

export const captureOrder = async (orderId:any) => {
    try {

        const tokenResponse = await obtenerToken();
        if (tokenResponse.status !== 200) {
            throw new Error('No se pudo obtener el token de acceso');
        }
        const response = await fetch(`${paypal_API}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenResponse.data}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({}) 
        });
        // console.log("asdadasdas")
    

        const data = await response.json(); 

        return {
            status: 200,
            data: data 
        };
    } catch (error) {
        console.error('Error en captureOrder:', error);
        return {
            message: `Error al capturar la orden: ${error}`,
            status: 500,
        };
    }
};

export const createOrder = async () => {
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

        const tokenResponse = await obtenerToken();
        if (tokenResponse.status !== 200) {
            throw new Error('No se pudo obtener el token de acceso');
        }

        const response = await fetch(`${paypal_API}/v2/checkout/orders`, {
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

        const data = await response.json();

        return {
            message: `Orden creada exitosamente`,
            status: 200,
            data: data,
        };
    } catch (error) {
        console.error('Error en createOrder:', error);
        return {
            message: `Contacte con el administrador, se encontró el error: ${error}`,
            status: 500,
        };
    }
};

export const obtenerToken = async () => {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        const response = await fetch(`${paypal_API}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el token: ${response.statusText}`);
        }

        const data = await response.json();


        return {
            status: 200,
            data: data.access_token
        };
    } catch (error) {
        console.error('Error en obtenerToken:', error);
        return {
            status: 500,
            error: error 
        };
    }
};

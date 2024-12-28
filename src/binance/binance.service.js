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
exports.getCurrency = void 0;
// import Binance from 'binance-api-node';
const binance_key = process.env.BINANCE_API_CLIENT;
const binance_secret = process.env.BINANCE_API_SECRET;
const binance_api = process.env.BINANCE_API; // Esta variable se utiliza para construir la URL
const getCurrency = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(binance_api); // Muestra la URL base de la API
        // Realiza la solicitud a la API de Binance
        const response = yield fetch(`${binance_api}/v3/ticker/price?symbol=DOGEFDUSD`, {
            method: 'GET', // Especifica el método HTTP
            headers: {
                'Content-Type': 'application/json', // Establece el tipo de contenido
            },
        });
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        const data = yield response.json(); // Obtiene los datos en formato JSON
        return {
            status: 200,
            message: "Success",
            data: data, // Devuelve los datos obtenidos
        };
    }
    catch (error) {
        console.error(error); // Registra el error en la consola
        return {
            status: 500,
            message: `Error, contacte con el administrador: ${error}`,
        };
    }
});
exports.getCurrency = getCurrency;
// export const getSaldoBySymbol = async (req: Request, res: Response) => {
//   try {
//     // Aquí puedes agregar lógica para obtener el saldo por símbolo
//     return res.status(200).json({
//       message: "Success",
//       data: "saldo", // Reemplaza esto con el saldo real
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: `Error al obtener saldo: ${error.message}`,
//     });
//   }
// };
// export const getSaldoBySymbolAndCurrency = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     // Aquí puedes agregar lógica para obtener el saldo por símbolo y moneda
//     return res.status(200).json({
//       message: "Success",
//       data: "saldo", // Reemplaza esto con el saldo real
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json

import { Request, Response } from "express";
import Binance from 'binance-api-node';

const binance_key = process.env.BINANCE_API_CLIENT;
const binance_secret = process.env.BINANCE_API_SECRET;
const binance_api = process.env.BINANCE_API; // Esta variable se utiliza para construir la URL

export const getCurrency = async () => {
  try {
    console.log(binance_api); // Muestra la URL base de la API

    // Realiza la solicitud a la API de Binance
    const response = await fetch(`${binance_api}/v3/ticker/price?symbol=DOGEFDUSD`, {
      method: 'GET', // Especifica el método HTTP
      headers: {
        'Content-Type': 'application/json', // Establece el tipo de contenido
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.statusText}`);
    }

    const data = await response.json(); // Obtiene los datos en formato JSON

    return {
      status: 200,
      message: "Success",
      data: data, // Devuelve los datos obtenidos
    };
  } catch (error) {
    console.error(error); // Registra el error en la consola
    return {
      status: 500,
      message: `Error, contacte con el administrador: ${error}`,
    };
  }
};

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

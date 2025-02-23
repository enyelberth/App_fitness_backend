import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getcurrencys = async () => {
  try {
    const currencys = await prisma.currency.findMany();

    if (currencys.length == 0) {
      return {
        message: `No se encontraron currencys registradas `,
        status: 200,
        data: currencys,
      };
    } else {
      return {
        message: `Currencys encontradas exitozamente`,
        status: 200,
        data: currencys,
      };
    }
  } catch (error) {
    return {
      message: `Error contacte con el administrador`,
      status: 500,
    };
  }
};
export const getcurrency = async () => {};

export const createcurrrency = async (data:any) => {
  try {
    console.log("asdas")
    const currency = await prisma.currency.create({
      data: {
        name: data.name,
        symbol: data.symbol,
      },
    });

    return {
      message: `Currency creada exitosamente`,
      status: 200,
      data: currency,
    };
  } catch (error) {
    return {
      message: `Error contacte con el administrador`,
      status: 500,
    };
  }
};
export const updateCurrency = async () => {};
export const deleteCurrency = async () => {};

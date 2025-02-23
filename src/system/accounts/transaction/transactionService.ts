import { PrismaClient, Prisma } from "@prisma/client";
import { transaction } from "../../../routes";

const prisma = new PrismaClient();

export const getTransactions = async (id:any) => {
  try {
    const currencys = await prisma.transaction.findMany({
      where: {
        accountId: id,
      },
    });

    if (currencys.length == 0) {
      return {
        message: `No se encontraron transaction registradas `,
        status: 200,
        data: currencys,
      };
    } else {
      return {
        message: `Transaction encontradas exitozamente`,
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

export const createTransaction = async (data:any) => {
  try {
    console.log("hola")
    const currency = await prisma.transaction.create({
      data: {
        accountId: data.accountId,
        amount: data.amount,
        type: data.type,
      },
    });
    
    console.log("listo");
    if(data.typetransaction == "increment"){

      const account = await prisma.account.update({
        where: { id: data.accountId },
        data: {
          balance:{
            increment: data.amount
          }
        },
      });
    }else{
      const account = await prisma.account.update({
        where: { id: data.accountId },
        data: {
          balance:{
            decrement: data.amount
          }
        },
        });
    }
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

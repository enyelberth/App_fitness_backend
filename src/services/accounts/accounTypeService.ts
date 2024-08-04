import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAccountsTypes = async () => {
  try {
    const account = await prisma.accountType.findMany();

    if (account.length == 0) {
      return {
        status: 200,
        message: `No se encontraron tipos de cuentas registradas`,
        data: account,
      };
    }
    return {
      status: 200,
      message: `Tipos de Cuentas encontradas exitoxamente`,
      data: account,
    };
  } catch (error) {
    return {
      status: 500,
      message: `Error contacte con el administrador error: ${error}`,
    };
  }
};

export const getAccountsType = async (dato: any) => {
  try {
    const accountType = await prisma.accountType.findMany({
      where: {
        id: dato,
      },
    });
    if (accountType == undefined) {
      return {
        message: `No se encontro ese tipo de cuenta registrada`,
        status: 500,
      };
    } else {
      return {
        message: `El tipo de cuenta fue encontrado exitozamente`,
        status: 200,
        data: accountType,
      };
    }
  } catch (error) {
    return {
      message: ``,
      status: 500,
    };
  }
};

export const createNewAccountType = async (dato: any) => {
  try {

    const user = await prisma.accountType.create({
      data: {
        name: dato.name,
      },
    });

    return {
      message: `El type Account fue registrado correctamente`,
      status: 200,
      data: user,
    };
  } catch (error) {
    return {
      message: `Error contacte con el administrador`,
      status: 500,
    };
  }
};

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
    } else {
      return {
        status: 200,
        message: `Tipos de Cuentas encontradas exitoxamente`,
        data: account,
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: `Error contacte con el administrador error: ${error}`,
    };
  }
};

export const getAccountsType = async (dato:number) => {
  const account = await prisma.accountType.findMany();
  return account;
};

export const createNewAccountType = async (dato: any) => {
  const accountype = await getAccountsType();
  const datos = dato;

  const id = dato.id;
  console.log(datos);
  const idAccount = new Array();

  accountype.forEach((element) => {
    if (element.id) {
      idAccount.push(element.id);
    }
  });

  const date = accountype.includes(id);

  if (!date) {
    const user = await prisma.accountType.create({
      data: {
        id: id,
        name: datos.name,
      },
    });
    return "El tipo de cuenta se registro correctamente";
  }
  {
    return "El usuario no se pudo registrar";
  }
};

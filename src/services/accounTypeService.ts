import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAccountsType = async () => {
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
        name: datos.name
      },
    });
    return "El tipo de cuenta se registro correctamente";
  }
  {
    return "El usuario no se pudo registrar";
  }
};

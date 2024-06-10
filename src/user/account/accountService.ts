import { PrismaClient, Prisma } from "@prisma/client";
import { getUsers } from "../userService";
import { getAccountsType } from "./accounType/accounTypeService";

const prisma = new PrismaClient();

export const getAccounts = async () => {
  const account = await prisma.account.findMany();
  return account;
};

export const createNewAccount = async (dato: any) => {
  const users = await getUsers();
  const typeAccount = await getAccountsType();
  const datos = dato;

  const id2 = dato.userId;
  const id3 = dato.typeId;
  //   console.log(datos);
  const idUser = new Array();
  const idTypeaccount = new Array();

  users.forEach((element) => {
    if (element.id) {
      idUser.push(element.id);
    }
  });

  typeAccount.forEach((element) => {
    if (element.id) {
      idTypeaccount.push(element.id);
    }
  });

  const date = idUser.includes(id2);
  const date2 = idTypeaccount.includes(id3);
//   console.log(typeAccount);
//   console.log(typeof idTypeaccount);
//   console.log(typeof id3);
  console.log(date2);

  if (date2) {
    return "El usuario si se encontro";
  }

  //   const user = await prisma.account.create({
  //     data: {
  //       id: datos.id,
  //       userId: datos.userId,
  //       typeId: datos.typeId,
  //     },
  //   });

  //   return user;
};

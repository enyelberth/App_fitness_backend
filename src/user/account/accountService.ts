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

  const AccountId = await getAccounts();

  const AccountIdArray = new Array();
  const idUser = new Array();
  const idTypeaccount = new Array();

  const datos = dato;

  const id2 = dato.userId;
  const id3 = dato.typeId;
  const id4 = dato.id;

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
  AccountId.forEach((element) => {
    if (element.id) {
      AccountIdArray.push(element.id);
    }
  });

  const date = idUser.includes(id2);
  const date2 = idTypeaccount.includes(id3);
  const date3 = AccountIdArray.includes(id4);

  if (!date3 && date && date2) {
    const user = await prisma.account.create({
      data: {
        id: datos.id,
        userId: datos.userId,
        typeId: datos.typeId,
      },
    });

    return user;
  } else if (!date) {
    return "El usuario no esta registrado";
  } else if (!date2) {
    return "la type de cuenta no esta registrado";
  } else if (date3) {
    return "El numero de cuenta ya esta utilazado";
  }
};

export const updateAccount = async (dato: any) => {
  const datos = dato;

  const account = await prisma.account.update({
    where: { id: "3" },
    data: { balance: -50 },
  });

  return "se update correctamente";
};

export const getAccount = async (dato: string) => {
  const accounts = await getAccounts();
  const AccountIdArray = new Array();



  accounts.forEach((element) => {
    if (element.id) {
      AccountIdArray.push(element.id);
    }
  });

  const date3 = AccountIdArray.includes(dato);

  // console.log(date3);

  if (date3) {
    const account = await prisma.account.findMany({
      where: {
        id: dato,
      },
    });

    return account;
  } else {
    return "El usuario no se pudo encontrar";
  }
};

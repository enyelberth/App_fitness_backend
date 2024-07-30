import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const getTransaction = () => {};

const getTransactions = (id: any) => {};
const createTransaction = async (dato: any) => {
  const datos = dato.body;

  const transaction = await prisma.transaction.create({
    data: {
      id: "1",
      account: "asdas",
      amount: 19,
      type: 1,
    },
  });
};

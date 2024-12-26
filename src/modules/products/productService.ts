import { PrismaClient, Prisma } from "@prisma/client";
import { json } from "stream/consumers";

const prisma = new PrismaClient();

export const getProducts = async () => {
  try {
    const user = await prisma.product.findMany();

    return {
      status: 200,
      data: user,
    };
  } catch (error) {
    return {
      status: 500,
      data: `Error ${error} contacte con el administrador`,
    };
  }
};
export const getOneProduct = () => {
  return "get one product ";
};

export const CreateNewProducto = async (dato: any) => {
  // const da = JSON.parse(dato);

  const title = dato.title;
  // const user = await prisma.product.create({
  //   data: {
  //     title: dato.title,
  //     price: dato.price,
  //     cantidad: dato.cantidad,
  //   },
  // });
  // return user;
};
export const updateProduct = () => {
  return "Updarte product ";
};
export const deleteProduct = () => {
  return "Delete Product";
};

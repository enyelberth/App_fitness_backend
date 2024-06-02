import { PrismaClient, Prisma } from "@prisma/client";
import { json } from "stream/consumers";

const prisma = new PrismaClient();

export const getProduct = async () => {
  const user = await prisma.user.findMany();
  return user;
};
export const getOneProduct = () => {
  return "get one product ";
};
export const CreateNewProducto = async (dato:any)=> {
  // const da = JSON.parse(dato);
  

  const title = dato.title;
  const user = await prisma.product.create({
    data: {
      title: dato.title,
      price: dato.price,
      cantidad: dato.cantidad,
    },
  });
  return user;

};
export const updateProduct = () => {
  return "Updarte product ";
};
export const deleteProduct = () => {
  return "Delete Product";
};

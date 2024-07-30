import { PrismaClient, Prisma } from "@prisma/client";
import { createNewUser, getUsers } from "../users/userService";
const prisma = new PrismaClient();

export const getProfile = async () => {
  const profile = await prisma.profile.findMany();
  return profile;
};

export const createNewProfile = async (dato: any) => {
  const profile = await getProfile();
  const datos = dato;

  // const id = dato.id.toString();
  // console.log(datos);  
  // const idUser = new Array();

  // profile.forEach(element => {
  //     if (element.userId) {
  //       idUser.push(element.userId);
  //     }
  // });

  // const date = idUser.includes(id);
  
  
  const user = await prisma.profile.create({
    data: {
      firstName: datos.firstName,
      lastName: datos.username,
      dob: "2024-06-08T01:14:33.000Z",
      address: datos.password,
      phone: datos.phone,
      userId: dato.id,
    },
  });

  return user;
};

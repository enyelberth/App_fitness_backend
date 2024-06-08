import { PrismaClient, Prisma } from "@prisma/client";
import { createNewUser,getUsers } from "../userService";
const prisma = new PrismaClient();

export const createNewProfile = async (dato: any) => {

       const datos = dato.body;
       

   
      const user = await prisma.profile.create({
        data: {
          firstName: datos.firstName,
          lastName: datos.username,
          dob: "2024-06-08T01:14:33.000Z",
          address: datos.password,
          phone: datos.phone,
          userId: "30204334",
        },
      });

      return true;
  
   
};

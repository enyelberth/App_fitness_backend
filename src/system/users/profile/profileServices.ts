import { PrismaClient, Prisma } from "@prisma/client";
import { createNewUser, getUsers } from "../../users/userService";
import { searchId, searchIduser, search  } from "../../../helpers/index";
const prisma = new PrismaClient();

export const getProfile = async (dato: number) => {
  try {
    const profile = await prisma.profile.findMany({
      where: {
        id: dato,
      },
    });
    if (profile.length == 0) {
      return {
        message: `El perfil no se encontro registrado`,
        status: 200,
        data: profile,
      };
    }

    return {
      message: `Perfil encontrado exitosamente`,
      status: 200,
      data: profile,
    };
  } catch (error) {
    console.log(error);
    return {
      message: `Contacte con el administrador se encontror el error: ${error}`,
      status: 500,
    };
  }
};
export const getProfiles = async () => {
  try {
    const profile = await prisma.profile.findMany();

    if (profile.length == 0) {
      return {
        message: `No hay usuarios encontrados`,
        status: 200,
        data: profile,
      };
    }
    return {
      message: `Usuarios encontrado exitosamente`,
      status: 200,
      data: profile,
    };
  } catch (error) {
    console.log(error);
    return {
      message: `Contacte al administrador: error`,
      status: 500,
    };
  }
};

export const createNewProfile = async (dato: any) => {
  try {
    //Array de datos
    console.log("Datos de la creacion de perfil");
    const profiles = await getProfiles();
    const user = await getUsers();
    
    //Buscar los elementos
    const validateId = await search(profiles, {id:dato.id});
    const validatPhone = await search(profiles, {phone:dato.phone});
    const validateUsers = await searchId(user, dato.userId);
    console.log(validateId)
    //Validate SI el usuario existe 
    if (validateUsers) {
      if (validateId) {
        return {
          status: 200,
          message: `El id ya esta registrado en otro perfil`,
        };
      }

      const profile = await prisma.profile.create({
        data: {
          firstName: dato.firstName,
          lastName: dato.username,
          dob: new Date("2023-12-03"),
          address: dato.password,
          phone: dato.phone,
          userId: dato.id,
        },
      });

      return {
        message: `El profile se registro correctamente`,
        status: 200,
      };
    }else{
      // Si no existe retorna esto
      return {
        message: `No se pudo encontrar ningun usuario con ese id`,
        status: 200,
      };
    }
  } catch (error) {

    //Encaso que alla un error imprime esto
    console.log(`Error contacte con el administrador ${error}`);
    return {
      message: `Error contacte con el administrador ${error}`,
      status: 500,
    };
  }
};

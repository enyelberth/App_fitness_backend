import { PrismaClient, Prisma } from "@prisma/client";
import { searchEmail, searchId, searchUsername } from "../../helpers/index";

const prisma = new PrismaClient();

export const getUsers = async () => {
  // El try cash lo qye hace es que no capta cualquier error que tengamos para que no se rompa 
  try {
// Funciones que ara nuestro programa en caso de que todo salga bien 
    
    const user = await prisma.user.findMany();
    //Validamos que lo que nos traiga la base de datos tenga algo aunquesea un primer usuario 
    if (user.length == 0) {
      return {
        message: `No hay usuarios encontrados`,
        status: 200,
        data: user,
      };
    }
    return {
      message: `Usuarios encontrado exitosamente`,
      status: 200,
      data: user,
    };
  } catch (error) {
    //Funcion que ara nuestro programa en caso de que se rompa le pasamos el paramtro errir y lo podemos retornar ak controller y mostrar por un console.log  
    console.log(error);
    return {
      message: `Contacte al administrador: error`,
      status: 500,
    };
  }
};

export const getUser = async (dato: number) => {


  //Usamos el try cash para captar cualquier error que tengamos y lo que podemos observar es que instancemos prisma y los usamos y accedemos a los datos que tenemos en la base de datos 
  try {
    const user = await prisma.user.findMany({
      where: {
        id: dato,
      },
    });
    if (user.length == 0) {
      return {
        message: ``,
        status: 200,
        data: user,
      };
    }

    return {
      message: `Usuario encontrado exitosamente`,
      status: 200,
      data: user,
    };
  } catch (error) {
    console.log(error);
    //Usamos el template script para imprimir los errores o comillas inglesS 
    return {
      message: `Contacte con el administrador se encontror el error: ${error}`,
      status: 500,
    };
  }
};
export const createNewUser = async (dato: any) => {
  try {
    console.log(dato);
    const id = dato.id;
    const username = dato.username;
    const data = await getUsers();

    const validateEmail = searchEmail(data, dato.email);
    const validateID = searchId(data, dato.id);
    const validateUsername = searchUsername(data, dato.username);

    if (!validateEmail && !validateID && !validateUsername) {
      const user = await prisma.user.create({
        data: {
          id: dato.id,
          email: dato.email,
          username: dato.username,
          password: dato.password,
        },
      });
      return {
        message: `El usuario fue registrado con exito`,
        status: 200,
        data: user,
      };
    } else {
      return {
        message: `Esos datos ya se encuentran registrado`,
        status: 200,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: `Error contacte con el administrador`,
      status: 500,
    };
  }
};

export const deleteUser = async (dato: number) => {
  try {
    const data = await getUsers();

    const a = searchId(data["data"], dato);
    console.log(a);
    if(a){

      const deleteuser = await prisma.user.deleteMany({
        where: {
          id: dato,
        },
      });
      return {
        message: `El usuario fue eliminado con exito`,
        status: 200,
      };
    }else{
      return {
        message: `El usuario no se encuentra registrado`,
        status: 200,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: `Contacte con el administrador se encontror el error: ${error}`,
      status: 500,
    };
  }
};

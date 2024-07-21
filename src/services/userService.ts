import { PrismaClient, Prisma } from "@prisma/client";
import { searchEmail, searchId, searchUsername } from "../helpers";


const prisma = new PrismaClient();

export const getUsers = async () => {
  try {
    const user = await prisma.user.findMany();
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
    console.log(error);
    return {
      message: `Contacte al administrador: error`,
      status: 500,
    };
  }
};

export const getUser = async (dato: number) => {
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
    return {
      message: `Contacte con el administrador se encontror el error: ${error}`,
      status: 500,
    };
  }
};
export const createNewUser = async (dato: any) => {
  try {
      // console.log(dato);
    const id = dato.id;
    const username = dato.username;
    const data = await getUsers();

    const validateEmail = searchEmail(data, dato.email);
    const validateID = searchId(data,dato.id); 
    const validateUsername = searchUsername(data,dato.username);
    
   
    if(!validateEmail&&!validateID&&!validateUsername){
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
    }else if(validateEmail){
      console.log("El correo ya esta registrado");
      return {
        message: `El correo ya se encuentra registrado`,
        status: 200,

      };
    }else if(validateID){
      console.log("El ID ya esta registrado");
      return {
        message: `El ID ya se encuentra registrado`,
        status: 200,

      };
    }else if(validateUsername){
      console.log("El Username ya esta registrado");
      return {
        message: `El Username ya se encuentra registrado`,
        status: 200,

      };
    }


    // } else if(d) {

    // }else if(d){
    //   return {
    //     message: `El email ya esta registrado`,
    //     status: 200,
    //     data: user,
    //   };
    
  } catch (error) {
    console.log(error);
    return {
      message: `Error contacte con el administrador`,
      status: 500,
    };
  }
};

export const deleteUser = async (dato: any) => {
  try {
    const id = dato.id;
    const users = await getUsers();

    let numeroIdenticacion = new Array();

    // Verificar ID
    // users.forEach((element) => {
    //   if (element.id) {
    //     numeroIdenticacion.push(element.id);
    //   }
    // });
    console.log(id);

    const data = numeroIdenticacion.includes(id);
    console.log(data);

    const dat1 = false;
    // console.log(dat1);

    if (data) {
      const deleteuser = await prisma.user.deleteMany({
        where: {
          id: id,
        },
      });

      console.log("El usuario fue eliminado con exito");

      return "El usuario fue Elimminado con exito";
    } else if (data) {
      console.log("El Usuario no esta registrado");
      return false;
    }
  } catch (error) {
    console.error("Error al crear usuario ");
  }
};

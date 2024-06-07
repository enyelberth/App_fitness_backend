import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsersAdmin = async () => {
  const user = await prisma.user.findMany();
  return user;
};

export const createNewUserAdmin = async (dato: any) => {
  try {
    const email = dato.email;
    const users = await getUsersAdmin();

    let correos = new Array();

    users.forEach((element) => {
      if (element.email) {
        correos.push(element.email);
      }
    });


    console.log(correos);

    const dat = correos.includes(email);
    console.log(dat);

    if (!dat) {
      const user = await prisma.user.create({
        data: {
          id: dato.id,
          email: dato.email,
          username: dato.email,
          password: dato.email,
        },
      });
      console.log("REGISTRO");

      return true;
    } else {
      // console.log("El correo ya esta registrado");
      return false;
    }
    //   users.forEach((i) => {
  } catch (error) {
    console.error("Error al crear usuario ");

    // throw error;
  }
};

const getUserAdmin = async (id: number) => {};
export const deleteUSer = async (dato: any) => {
  try {
    const email = dato.email;
    let correos = new Array();
    const usuarios = await getUsersAdmin();
    usuarios.forEach((element) => {
      if (element.email) {
        correos.push(element.email);
      }
    });
    console.log(correos);

    const dat = correos.includes(email);
    if (dat) {
      const deleteuser = await prisma.user.deleteMany({
        where: {
          email: email,
        },
      });

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error al eliminar el usuario");
  }
};

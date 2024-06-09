import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async () => {
  const user = await prisma.user.findMany();
  return user;
};

export const createNewUser = async (dato: any) => {
  try {
    const email = dato.email;
    const id = dato.id;
    const username = dato.username;

    const users = await getUsers();
    // Verificar el correo si esta registrado
    let correos = new Array();
    let numeroIdenticacion = new Array();
    let usuarios = new Array();

    users.forEach((element) => {
      if (element.email) {
        correos.push(element.email);
      }
    });
    console.log(correos);

    const dat = correos.includes(email);
    //

    // Verificar ID
    users.forEach((element) => {
      if (element.id) {
        numeroIdenticacion.push(element.id);
      }
    });
    console.log(id);

    const dat1 = numeroIdenticacion.includes(id);

    console.log(dat);

    // Verificar Username
    users.forEach((element) => {
      if (element.id) {
        usuarios.push(element.username);
      }
    });
    console.log(id);

    const dat2 = usuarios.includes(username);

    console.log(dat);

    if (dat) {
      return "El correo ya esta regiostrado";
    } else if (dat1) {
      return "El id  ya esta regiostrado";
    } else if (dat2) {
      return "eL Username ya esta Registrado";
    }

    if (!dat && !dat1 && !dat2) {
      const user = await prisma.user.create({
        data: {
          id: dato.id,
          email: email,
          username: dato.username,
          password: dato.password,
        },
      });
      console.log("El usuario fue registrado con exito");

      return "El usuario fue registrado con exito";
    } else {
      console.log("El correo ya esta registrado");
      return false;
    }
    //   users.forEach((i) => {
  } catch (error) {
    console.error("Error al crear usuario ");

    // throw error;
  }
};

export const deleteUser = async (dato:any) => {
  try {
    const id = dato.id;
    const users = await getUsers();

    let numeroIdenticacion = new Array();

    // Verificar ID
    users.forEach((element) => {
      if (element.id) {
        numeroIdenticacion.push(element.id);
      }
    });
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
    } else if(data) {
      console.log("El Usuario no esta registrado");
      return false;
    }
  } catch (error) {
    console.error("Error al crear usuario ");
  }
};

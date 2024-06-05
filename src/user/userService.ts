import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async () => {
  const user = await prisma.user.findMany();
  return user;
};

export const createNewUser = async (dato: any) => {
  try {

    const email = dato.email;  
    const users = await getUsers();

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
          email: email,
          name: dato.name,
          usename: dato.username,
          password: dato.password,
        },
      });
      console.log("REGISTRO");

      return true;
    }else{
        // console.log("El correo ya esta registrado");
        return false;
    }
    //   users.forEach((i) => {
  } catch (error) {
    console.error("Error al crear usuario ");
    
    // throw error;
  }
};


const getUser = async (id: number)=>{
    
}
export const deleteUSer = async (id:number)=>{
  const deleteuser = await prisma.user.deleteMany({
    where:{
      id:id
    },
  })
}
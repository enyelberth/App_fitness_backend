import { PrismaClient, Prisma } from "@prisma/client";
import { getUsers } from "../../system/user/userService";
import { getAccountsType } from "../accounts/accounTypeService";

const prisma = new PrismaClient();



export const getAccount = async (dato: string) => {
  try {
    // const accounts = await getAccount();
    const AccountIdArray = new Array();
    

    const profile = [1,12]
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

export const getAccounts = async () => {
   
   try{
     
     const account = await prisma.account.findMany();
     
     if(account.length ==0){
       return{
         status:200,
         account,
         message: `No se encontraron cuentas registradas`,
       };
     }
     return{
       status:200,
       account,
       message: `Las cuentas se encontraron exittazamente`
     }
   }catch(error){
     return{
       message:`Erro contacte con el administrador ${error}`,
       status:500
     }
   }
 };

 export const createNewAccount = async (dato: any) => {
    const users = await getUsers();
    // const typeAccount = await getAccountsType();

   const AccountId = await getAccounts();
   const AccountIdArray = new Array();
   const idUser = new Array();
   const idTypeaccount = new Array();
   const datos = dato;
   const id2 = dato.userId;
   const id3 = dato.typeId;
   const id4 = dato.id;
   // users.forEach((element) => {
   //   if (element.id) {
   //     idUser.push(element.id);
   //   }
   // });
   // typeAccount.forEach((element) => {
   //   if (element.id) {
   //     idTypeaccount.push(element.id);
   //   }
   // });
   // AccountId.forEach((element) => {
   //   if (element.id) {
   //     AccountIdArray.push(element.id);
   //   }
   // });
   const date = idUser.includes(id2);
   const date2 = idTypeaccount.includes(id3);
   const date3 = AccountIdArray.includes(id4);
   if (!date3 && date && date2) {
     const user = await prisma.account.create({
       data: {
         id: datos.id,
         userId: datos.userId,
         typeId: datos.typeId,
       },
     });
     return user;
   } else if (!date) {
     return "El usuario no esta registrado";
   } else if (!date2) {
     return "la type de cuenta no esta registrado";
   } else if (date3) {
     return "El numero de cuenta ya esta utilazado";
   }
 };
 export const updateAccount = async (dato: any) => {
   const datos = dato;
   const account = await prisma.account.update({
     where: { id: "3" },
     data: { balance: -50 },
   });
   return "se update correctamente";
 };

 export const getData = async(searchOptions:string,limit:string,page:string)=>{







}
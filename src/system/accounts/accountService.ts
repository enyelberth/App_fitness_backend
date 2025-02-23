import { PrismaClient, Prisma } from "@prisma/client";
import { getUsers } from "../users/userService";
import { getAccountsType } from "../accounts/accountype/accounTypeService";

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
  try {
    const datos = dato;
    console.log(datos);
    const account = await prisma.account.create({
      data: {
        id: datos.id,
        userId: parseInt(datos.userId),
        currencyId: datos.currencyId,
        typeId: parseInt(datos.accountTypeId),
      },
    });
    return {
      status:200,
      data:account,
      message:"La cuenta fue creada exitosamente"
    };
  } catch (error) {
    return {
      status:500,
      message:`Error contacte con el administrador ${error}`,
      data: ""
    }
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
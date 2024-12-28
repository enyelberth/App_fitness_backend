"use strict";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// export default async function user_procedure() {
//   try {
//     await prisma.$executeRaw`drop procedure if exists "system".sp_create_user`;
//     await prisma.$executeRaw`
//   create or replace procedure "system".sp_create_user(_role_code character varying, _employee_code character varying, _status_code character varying, _username character varying, _password character varying, _user_code character varying, out _code character varying)
//   language plpgsql as $$
//   begin
//     perform set_config('glb.user_current',_user_code,false);
//     INSERT INTO "system"."User" (role_code, employee_code, status_code, username, "password") VALUES (_role_code, _employee_code, _status_code, _username, _password) returning code into _code;
//    EXCEPTION
// WHEN OTHERS THEN
// rollback;
//     RAISE exception 'Error al crear el usuario: %', SQLERRM;
//   end
//   $$;`;
//     await prisma.$executeRaw`DROP PROCEDURE if exists "system".sp_update_user(varchar, varchar, varchar, varchar, bool, varchar);`;
//     await prisma.$executeRaw`
//   create or replace procedure "system".sp_update_user(_code varchar, _role_code varchar, _status_code varchar, _enabled bool, _user_code character varying )
//   language plpgsql
//   as $$
// declare
//   begin
//     perform set_config('glb.user_current',_user_code,false);
//     update "system"."User" set (role_code, status_code, enabled) = (_role_code,_status_code,_enabled) where code = _code;
//    EXCEPTION
// WHEN OTHERS THEN
// rollback;
//     RAISE exception 'Error al actualizar el usuario: %', SQLERRM;
//   end
//   $$;`;
//     await prisma.$executeRaw`DROP PROCEDURE if exists "system".sp_update_user_password;`;
//     await prisma.$executeRaw`
//   create or replace procedure "system".sp_update_user_password(_code varchar(6), _password varchar, _user_code character varying)
//   language plpgsql
//   as $$
// declare
//   begin
//     perform set_config('glb.user_current',_user_code,false);
//     update "system"."User" set password = _password where code = _code;
//    EXCEPTION
// WHEN OTHERS THEN
// rollback;
//     RAISE exception 'Error al actualizar la contraseña del usuario: %', SQLERRM;
//   end
//   $$;`;
//   } catch (error) {
//     console.log("Error creating store procedure user:", error);
//   } finally {
//     await prisma.$disconnect();
//     console.log("user store procedure created");
//   }
// }

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function user_triggers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$executeRaw `
  CREATE OR REPLACE
  FUNCTION "system".check_insert_user() RETURNS TRIGGER LANGUAGE PLPGSQL AS
$$
DECLARE
_description character varying;
_user varchar;
BEGIN
BEGIN
        _user := NULLIF(current_setting('glb.user_current', true), '');
    EXCEPTION
        WHEN undefined_object THEN
            _user := NULL; 
  END;
_description := upper(
    concat(
        'Se agrego un nuevo Usuario:',
        new.code,
        ' Nombre de usuario: ',
        new.username,
        ' rol: ',
        new.role_code,
        ' empleado: ',
        new.employee_code,
        ' estatus: ',
        new.status_code
    )
);
INSERT INTO
    "system"."Bitacora"(origin, service, user_code, description)
VALUES
    ('SYSTEM', 'USUARIO', _user, UPPER(_description));
perform set_config('glb.user_current', '', false);
RETURN NEW;
END;
$$`;
            yield prisma.$executeRaw `
CREATE OR REPLACE
  trigger check_insert_user BEFORE
INSERT
    ON "system"."User" FOR EACH ROW EXECUTE FUNCTION "system".check_insert_user();
`;
            yield prisma.$executeRaw `
  CREATE OR REPLACE
  FUNCTION "system".check_update_user() RETURNS TRIGGER LANGUAGE PLPGSQL AS
$$
DECLARE
_description character varying;
_user varchar;
BEGIN
BEGIN
        _user := NULLIF(current_setting('glb.user_current', true), '');
    EXCEPTION
        WHEN undefined_object THEN
            _user := NULL; 
  END;
_description := concat(
    'Se Actualizo el usuario ',
    new.code,
    '  con los siguientes valores ',
    CASE
        WHEN new.username <> old.username THEN concat(' Nombre del Usuario: ', new.username)
    END,
    CASE
        WHEN new.role_code <> old.role_code THEN concat(' Rol: ', new.role_code)
    END,
    CASE
        WHEN new.password <> old.password THEN concat(' contraseña: ', new.password)
    END,
    CASE
        WHEN old.employee_code <> new.employee_code THEN concat(' Empleado: ', new.employee_code)
    END,
    CASE
        WHEN old.status_code <> new.status_code THEN concat(' Estatus: ', new.status_code)
    END
);
INSERT INTO
    "system"."Bitacora"(origin, service, user_code, description)
VALUES
    ('SYSTEM', 'USUARIO', _user, UPPER(_description));
RETURN NEW;
END;
$$`;
            yield prisma.$executeRaw `
CREATE OR REPLACE
  trigger check_update_user BEFORE
UPDATE
    ON "system"."User" FOR EACH ROW EXECUTE FUNCTION "system".check_update_user();
`;
        }
        catch (error) {
            console.log("Error creating trigger user:", error);
        }
        finally {
            yield prisma.$disconnect();
            console.log("user triggers created");
        }
    });
}
exports.default = user_triggers;

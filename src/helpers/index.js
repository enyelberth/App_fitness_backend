"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.searchIduser = exports.searchUsername = exports.searchId = exports.searchEmail = void 0;
const searchEmail = (dato, email) => {
    const emails = dato["data"];
    // console.log(dato["data"]);
    let correos = new Array();
    emails.forEach((element) => {
        if (element.email) {
            // console.log(element,email);
            correos.push(element.email);
        }
    });
    const a = correos.includes(email);
    // console.log(a);
    return a;
};
exports.searchEmail = searchEmail;
const searchId = (dato, id) => {
    const emails = dato["data"];
    // console.log(dato["data"]);
    let ids = new Array();
    emails.forEach((element) => {
        if (element.id) {
            // console.log(element,email);
            ids.push(element.id);
        }
    });
    const a = ids.includes(id);
    // console.log(a);
    return a;
};
exports.searchId = searchId;
const searchUsername = (dato, username) => {
    const emails = dato["data"];
    // console.log(dato["data"]);
    let ids = new Array();
    emails.forEach((element) => {
        if (element.username) {
            // console.log(element,email);
            ids.push(element.username);
        }
    });
    const a = ids.includes(username);
    // console.log(a);
    return a;
};
exports.searchUsername = searchUsername;
const searchIduser = (dato, id) => {
    const users = dato["data"];
    // console.log(users);
    // console.log(dato["data"]);
    let ids = new Array();
    users.forEach((element) => {
        if (element.userId) {
            // console.log(element,email);
            ids.push(element.userId);
        }
    });
    const a = ids.includes(id);
    // console.log(a);
    return a;
};
exports.searchIduser = searchIduser;
const search = (dato, option) => {
    const optionsvalue = Object.keys(option);
    return !!dato["data"].find((v) => v[optionsvalue[0]] === option[optionsvalue[0]]);
};
exports.search = search;

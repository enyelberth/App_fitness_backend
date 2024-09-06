export const searchEmail = (dato: any, email: string) => {
  const emails = dato["data"];
  // console.log(dato["data"]);

  let correos = new Array();
  emails.forEach((element: any) => {
    if (element.email) {
      // console.log(element,email);
      correos.push(element.email);
    }
  });
  const a = correos.includes(email);
  // console.log(a);
  return a;
};
export const searchId = (dato: any, id: number) => {
  const emails = dato["data"];
  // console.log(dato["data"]);

  let ids = new Array();
  emails.forEach((element: any) => {
    if (element.id) {
      // console.log(element,email);
      ids.push(element.id);
    }
  });
  const a = ids.includes(id);
  // console.log(a);
  return a;
};
export const searchUsername = (dato: any, username: number) => {
  const emails = dato["data"];
  // console.log(dato["data"]);

  let ids = new Array();
  emails.forEach((element: any) => {
    if (element.username) {
      // console.log(element,email);
      ids.push(element.username);
    }
  });
  const a = ids.includes(username);
  // console.log(a);
  return a;
};

export const searchIduser = (dato: any, id: number) => {
  const users = dato["data"];
  // console.log(users);
  // console.log(dato["data"]);

  let ids = new Array();
  users.forEach((element: any) => {
    if (element.userId) {
      // console.log(element,email);
      ids.push(element.userId);
    }
  });
  const a = ids.includes(id);
  // console.log(a);
  return a;
};





export const search = (dato: any, option: Record<any,any>) => {
  
  const optionsvalue = Object.keys(option);

  return !!dato["data"].find((v:any)=>v[optionsvalue[0]] === option[optionsvalue[0]]);
};

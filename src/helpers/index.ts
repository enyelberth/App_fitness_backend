export const serchEmail = (emails: any, email: string) => {
  let correos = new Array();
  emails.forEach((element) => {
    if (element.email) {
      correos.push(element.email);
    }
  });
  const dato = correos.includes(email);
  return dato;
};

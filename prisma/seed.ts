import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userDate = [
  { id: 30204334, username: 'enyelberth10', email: 'enyelberthrc22.z@gmail.com', password: '30204334' },
  { id: 210294, username: 'enyelberth11', email: 'enyelberthrc11.z@gmail.com', password: '30204334' },
  { id: 18057999, username: 'enyelberth12', email: 'enyelberthrc12.z@gmail.com', password: '30204334' },
  { id: 14334066, username: 'enyelberth13', email: 'enyelberthrc13.z@gmail.com', password: '30204334' },
];

async function main() {
  // Opcional: limpiar antes de sembrar
  await prisma.user.deleteMany();

  // Crear los registros
  for (const user of userDate) {
    await prisma.user.create({
         data: {
            id: user.id, 
            username: user.username,
            email: user.email,
            password: user.password,

    } }); 
  }

  console.log('Datos sembrados correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
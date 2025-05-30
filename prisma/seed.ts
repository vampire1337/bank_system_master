import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Очистка существующих пользователей
  await prisma.user.deleteMany();
  
  // Создание тестовых пользователей
  const users = [
    {
      email: 'user@example.com',
      name: 'Иван Петров',
      password: 'password123',
      role: UserRole.CLIENT
    },
    {
      email: 'admin@example.com',
      name: 'Администратор Системы',
      password: 'admin123',
      role: UserRole.ADMIN
    },
    {
      email: 'elena@example.com',
      name: 'Елена Смирнова',
      password: 'elena123',
      role: UserRole.CLIENT
    }
  ];
  
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role
      }
    });
    
    console.log(`Создан пользователь: ${user.email}`);
  }
  
  console.log('Сидирование базы данных завершено');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
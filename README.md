This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Банковская система (Bank System Master)

### Настройка проекта

#### Требования
- Node.js 18+ 
- NPM или Yarn

#### Установка
```bash
# Установка зависимостей
npm install
```

#### Настройка окружения
1. Скопируйте файл `.env.example` в `.env.local` или создайте файл `.env`
2. Заполните необходимые переменные окружения:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="supersecret_nextauth_key_for_jwt_encryption"
   USE_TEST_USERS=false
   ```

#### База данных SQLite
База данных SQLite уже настроена и находится в файле `prisma/dev.db`. Если вы хотите создать базу данных заново:

```bash
# Создание базы данных
npx prisma migrate reset --force

# Заполнение базы тестовыми данными
npx prisma db seed
```

Для просмотра и редактирования данных используйте Prisma Studio:
```bash
npx prisma studio
```

#### Запуск проекта
```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build
npm run start
```

### Тестовые пользователи
- **Клиент**: user@example.com / password123
- **Администратор**: admin@example.com / admin123
- **Клиент**: elena@example.com / elena123

### Структура проекта
- `/app` - Основной код приложения (App Router)
- `/prisma` - Схема и миграции базы данных
- `/public` - Статические файлы
- `/tests-e2e` - E2E тесты

### Технологический стек
- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **База данных**: SQLite
- **Аутентификация**: NextAuth.js
- **Тестирование**: Jest, Playwright

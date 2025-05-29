import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Ошибка валидации данных" },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Проверка на существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT", // По умолчанию - клиент
      },
    });

    // Возвращаем успешный ответ без пароля
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { error: "Ошибка при создании пользователя" },
      { status: 500 }
    );
  }
} 
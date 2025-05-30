import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const calculatorSchema = z.object({
  amount: z.number().min(10000, "Минимальная сумма - 10 000 ₽").max(5000000, "Максимальная сумма - 5 000 000 ₽"),
  term: z.number().min(3, "Минимальный срок - 3 месяца").max(84, "Максимальный срок - 84 месяца"),
  interestRate: z.number().min(1, "Минимальная ставка - 1%").max(30, "Максимальная ставка - 30%"),
  monthlyPayment: z.number().min(1),
  totalPayment: z.number().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = calculatorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Ошибка валидации данных" },
        { status: 400 }
      );
    }

    const { amount, term, interestRate, monthlyPayment, totalPayment } = validation.data;

    // Сохранение расчета в базе данных
    const calculatorHistory = await prisma.calculatorHistory.create({
      data: {
        userId: session.user.id,
        amount,
        term,
        interestRate,
        monthlyPayment,
        totalPayment,
      },
    });

    return NextResponse.json({
      success: true,
      id: calculatorHistory.id,
      message: "Расчет успешно сохранен",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Произошла ошибка при сохранении расчета" },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Необходима авторизация" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { amount, term, interestRate, monthlyPayment, totalPayment } = data;

    // Валидация входных данных
    if (
      !amount ||
      !term ||
      !interestRate ||
      !monthlyPayment ||
      !totalPayment
    ) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    // Сохранение расчета в базу данных
    const calculation = await prisma.calculatorHistory.create({
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
      id: calculation.id,
    });
  } catch (error) {
    console.error("Ошибка сохранения расчета:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при сохранении расчета" },
      { status: 500 }
    );
  }
} 
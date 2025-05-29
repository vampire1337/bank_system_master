import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { calculateScoring } from "@/app/lib/utils";

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
    
    // Расчет возраста
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    // Расчет скоринга
    const scoringResult = calculateScoring(
      age,
      data.monthlyIncome || 0,
      data.employmentType,
      data.workExperience || 0,
      data.amount
    );
    
    // Определение прохождения скоринга (минимальный порог - 60)
    const scoringPassed = scoringResult >= 60;
    
    // Создание заявки в базе данных
    const creditRequest = await prisma.creditRequest.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        amount: data.amount,
        term: data.term,
        interestRate: data.interestRate,
        monthlyPayment: data.monthlyPayment,
        totalPayment: data.totalPayment,
        
        // Личная информация
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || null,
        birthDate: new Date(data.birthDate),
        passportNumber: data.passportNumber,
        passportIssuedBy: data.passportIssuedBy,
        passportIssuedDate: new Date(data.passportIssuedDate),
        passportRegistration: data.passportRegistration,
        
        // Данные о занятости
        employmentType: data.employmentType,
        employerName: data.employerName || null,
        jobTitle: data.jobTitle || null,
        workExperience: data.workExperience || null,
        monthlyIncome: data.monthlyIncome || null,
        
        // Контактные данные
        phone: data.phone,
        address: data.address,
        
        // Страхование
        hasInsurance: data.hasInsurance,
        insuranceProgramId: data.insuranceProgramId || null,
        
        // Скоринг
        scoringResult,
        scoringPassed,
      },
    });
    
    // Обновление статистики
    await prisma.statistics.update({
      where: { id: "1" }, // Предполагается, что у нас всегда есть запись с id=1
      data: {
        totalRequests: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      id: creditRequest.id,
      scoringPassed,
    });
  } catch (error) {
    console.error("Ошибка создания заявки:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при создании заявки" },
      { status: 500 }
    );
  }
} 
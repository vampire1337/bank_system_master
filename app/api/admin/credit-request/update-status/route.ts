import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { z } from "zod";

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "ISSUED", "CANCELED"]),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Проверка на права администратора
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Недостаточно прав для выполнения операции" },
        { status: 403 }
      );
    }

    // Валидация входящих данных
    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 }
      );
    }

    const { id, status } = validation.data;

    // Проверка существования заявки
    const existingRequest = await prisma.creditRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Заявка не найдена" },
        { status: 404 }
      );
    }

    // Проверка на изменение статуса
    if (existingRequest.status === "ISSUED" && status !== "ISSUED") {
      return NextResponse.json(
        { error: "Нельзя изменить статус выданного кредита" },
        { status: 400 }
      );
    }

    // Обновление статуса заявки
    await prisma.creditRequest.update({
      where: { id },
      data: { status },
    });

    // Обновление статистики
    if (status !== existingRequest.status) {
      let statisticsUpdate: Record<string, any> = {};

      // Если заявка была одобрена, увеличиваем счетчик одобренных
      if (status === "APPROVED") {
        statisticsUpdate.approvedRequests = { increment: 1 };
      }
      // Если заявка была отклонена, увеличиваем счетчик отклоненных
      else if (status === "REJECTED") {
        statisticsUpdate.rejectedRequests = { increment: 1 };
      }
      // Если заявка была ранее одобрена, но статус изменился, уменьшаем счетчик одобренных
      else if (existingRequest.status === "APPROVED") {
        statisticsUpdate.approvedRequests = { decrement: 1 };
      }
      // Если заявка была ранее отклонена, но статус изменился, уменьшаем счетчик отклоненных
      else if (existingRequest.status === "REJECTED") {
        statisticsUpdate.rejectedRequests = { decrement: 1 };
      }

      if (Object.keys(statisticsUpdate).length > 0) {
        await prisma.statistics.update({
          where: { id: "1" }, // Предполагается, что у нас всегда есть запись с id=1
          data: statisticsUpdate,
        });
      }
    }

    return NextResponse.json({
      success: true,
      status,
      message: "Статус заявки успешно обновлен",
    });
  } catch (error) {
    console.error("Ошибка обновления статуса:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при обновлении статуса заявки" },
      { status: 500 }
    );
  }
} 
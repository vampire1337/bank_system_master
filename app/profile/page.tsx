import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import StatusBadge from "@/app/components/StatusBadge";
import { formatCurrency, formatDate } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Личный кабинет | БанкКредит",
  description: "Управление вашими кредитными заявками и личным кабинетом",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?returnTo=/profile");
  }

  // Получение кредитных заявок пользователя
  const creditRequests = await prisma.creditRequest.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Последние 5 заявок
  });

  // Получение истории калькулятора
  const calculatorHistory = await prisma.calculatorHistory.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3, // Последние 3 расчета
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Мои заявки</h2>
            
            {creditRequests.length > 0 ? (
              <div className="space-y-4">
                {creditRequests.map((request) => (
                  <div key={request.id} className="border p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Заявка #{request.id.substring(0, 8)}</span>
                      <StatusBadge status={request.status} />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Сумма: {formatCurrency(request.amount)}
                      , Срок: {request.term} мес.
                    </p>
                    <p className="text-gray-500 text-xs">
                      Дата создания: {formatDate(request.createdAt)}
                    </p>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link href="/profile/applications">
                    <Button variant="outline" className="w-full">Все заявки</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">У вас пока нет кредитных заявок</p>
                <Link href="/credit-request">
                  <Button>Оформить заявку</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">История расчетов</h2>
            
            {calculatorHistory.length > 0 ? (
              <div className="space-y-4">
                {calculatorHistory.map((calc) => (
                  <div key={calc.id} className="border p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Сумма:</span>
                        <span className="font-medium ml-1">
                          {formatCurrency(calc.amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Срок:</span>
                        <span className="font-medium ml-1">{calc.term} мес.</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ставка:</span>
                        <span className="font-medium ml-1">{calc.interestRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Платеж:</span>
                        <span className="font-medium ml-1">
                          {formatCurrency(calc.monthlyPayment)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right mt-2">
                      <Link href={`/calculator?amount=${calc.amount}&term=${calc.term}&rate=${calc.interestRate}`}>
                        <Button variant="ghost" size="sm">Повторить</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">У вас пока нет сохраненных расчетов</p>
                <Link href="/calculator">
                  <Button>Открыть калькулятор</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Персональная информация</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 block text-sm">Имя:</span>
                <span className="font-medium">{session.user.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Email:</span>
                <span className="font-medium">{session.user.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Роль:</span>
                <span className="font-medium">
                  {session.user.role === "ADMIN" ? "Администратор" : "Клиент"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/profile/edit">
                <Button variant="outline" className="w-full">Редактировать профиль</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Быстрые действия</h2>
            <div className="space-y-3">
              <Link href="/credit-request">
                <Button className="w-full mb-3">Оформить кредит</Button>
              </Link>
              <Link href="/calculator">
                <Button variant="outline" className="w-full mb-3">Кредитный калькулятор</Button>
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="outline" className="w-full">Админ-панель</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
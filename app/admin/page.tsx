import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { formatCurrency } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Админ-панель | БанкКредит",
  description: "Управление кредитными заявками и пользователями",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Проверка роли пользователя
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Получение последних заявок
  const recentRequests = await prisma.creditRequest.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Получение статистики
  const statistics = await prisma.statistics.findFirst({
    where: { id: "1" },
  });

  // Получение количества пользователей
  const userCount = await prisma.user.count();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Админ-панель</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm font-medium mb-2">
            Всего заявок
          </h2>
          <p className="text-3xl font-bold">
            {statistics?.totalRequests || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm font-medium mb-2">
            Одобрено
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {statistics?.approvedRequests || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm font-medium mb-2">
            Отклонено
          </h2>
          <p className="text-3xl font-bold text-red-600">
            {statistics?.rejectedRequests || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-gray-500 text-sm font-medium mb-2">
            Пользователей
          </h2>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Последние заявки</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  № заявки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Срок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Скоринг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.user.name}
                    <div className="text-xs text-gray-400">{request.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(request.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.term} мес.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {request.scoringResult ? (
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          request.scoringPassed
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                          {request.scoringResult}
                        </span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100">
                          {request.scoringPassed ? "Прошел" : "Не прошел"}
                        </span>
                      </div>
                    ) : (
                      "Не выполнен"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        request.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : request.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "ISSUED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status === "APPROVED"
                        ? "Одобрено"
                        : request.status === "REJECTED"
                        ? "Отклонено"
                        : request.status === "PENDING"
                        ? "На рассмотрении"
                        : request.status === "ISSUED"
                        ? "Выдан"
                        : request.status === "CANCELED"
                        ? "Отменена"
                        : "Неизвестно"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/request/${request.id}`}>
                      <Button variant="ghost" size="sm">
                        Просмотр
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/requests">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Заявки</h3>
            <p className="text-gray-600 mb-4">
              Управление кредитными заявками, просмотр и изменение статусов
            </p>
            <Button variant="outline" className="w-full">
              Перейти к заявкам
            </Button>
          </div>
        </Link>

        <Link href="/admin/users">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Пользователи</h3>
            <p className="text-gray-600 mb-4">
              Управление пользователями системы, изменение ролей
            </p>
            <Button variant="outline" className="w-full">
              Перейти к пользователям
            </Button>
          </div>
        </Link>

        <Link href="/admin/settings">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-lg font-bold mb-2">Настройки</h3>
            <p className="text-gray-600 mb-4">
              Управление параметрами кредитования и системными настройками
            </p>
            <Button variant="outline" className="w-full">
              Перейти к настройкам
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
} 
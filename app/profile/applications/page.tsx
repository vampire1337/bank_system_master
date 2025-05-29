import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { formatCurrency } from "@/app/lib/utils";

export const metadata: Metadata = {
  title: "Мои заявки | БанкКредит",
  description: "Список всех ваших кредитных заявок",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { highlight?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?returnTo=/profile/applications");
  }

  // Получение всех кредитных заявок пользователя
  const creditRequests = await prisma.creditRequest.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const highlightedId = searchParams.highlight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои заявки</h1>
        <Link href="/credit-request">
          <Button>Новая заявка</Button>
        </Link>
      </div>

      {creditRequests.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № заявки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Срок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ставка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Платеж
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creditRequests.map((request) => (
                  <tr
                    key={request.id}
                    className={
                      highlightedId === request.id
                        ? "bg-yellow-50"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.DateTimeFormat("ru-RU").format(
                        request.createdAt
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(request.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.term} мес.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.interestRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.monthlyPayment
                        ? formatCurrency(request.monthlyPayment)
                        : "-"}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-xl font-bold mb-4">У вас пока нет заявок</h2>
          <p className="text-gray-500 mb-6">
            Оформите вашу первую заявку на кредит прямо сейчас
          </p>
          <Link href="/credit-request">
            <Button>Оформить заявку</Button>
          </Link>
        </div>
      )}

      <div className="mt-8">
        <Link href="/profile">
          <Button variant="outline">Назад в личный кабинет</Button>
        </Link>
      </div>
    </div>
  );
} 
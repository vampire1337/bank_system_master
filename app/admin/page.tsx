import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import StatusBadge from "@/app/components/StatusBadge";
import { formatCurrency } from "@/app/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Админ-панель</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-muted-foreground text-sm font-medium mb-2">
              Всего заявок
            </h2>
            <p className="text-3xl font-bold">
              {statistics?.totalRequests || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-muted-foreground text-sm font-medium mb-2">
              Одобрено
            </h2>
            <p className="text-3xl font-bold text-green-600">
              {statistics?.approvedRequests || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-muted-foreground text-sm font-medium mb-2">
              Отклонено
            </h2>
            <p className="text-3xl font-bold text-red-600">
              {statistics?.rejectedRequests || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-muted-foreground text-sm font-medium mb-2">
              Пользователей
            </h2>
            <p className="text-3xl font-bold">{userCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Последние заявки</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    № заявки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Срок
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Скоринг
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.user.name}
                      <div className="text-xs text-muted-foreground">{request.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(request.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full font-medium bg-muted">
                            {request.scoringPassed ? "Прошел" : "Не прошел"}
                          </span>
                        </div>
                      ) : (
                        "Не выполнен"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/requests" className="block">
          <Card className="h-full card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-2">Заявки</h3>
              <p className="text-muted-foreground mb-4">
                Управление кредитными заявками, просмотр и изменение статусов
              </p>
              <Button variant="outline" className="w-full">Перейти</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users" className="block">
          <Card className="h-full card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-2">Пользователи</h3>
              <p className="text-muted-foreground mb-4">
                Управление учетными записями пользователей и их правами
              </p>
              <Button variant="outline" className="w-full">Перейти</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings" className="block">
          <Card className="h-full card-hover">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-2">Настройки</h3>
              <p className="text-muted-foreground mb-4">
                Настройка параметров кредитования, ставок и скоринга
              </p>
              <Button variant="outline" className="w-full">Перейти</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { formatCurrency, formatDate } from "@/app/lib/utils";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { StatusActions } from "../components/StatusActions";

interface RequestDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: RequestDetailPageProps) {
  return {
    title: `Заявка ${params.id.substring(0, 8)} | Админ-панель`,
    description: "Детали кредитной заявки",
  };
}

export default async function RequestDetailPage({ params }: RequestDetailPageProps) {
  const session = await getServerSession(authOptions);

  // Проверка роли пользователя
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  // Получение заявки по ID
  const creditRequest = await prisma.creditRequest.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
      insuranceProgram: true,
    },
  });

  if (!creditRequest) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Заявка #{creditRequest.id.substring(0, 8)}
          </h1>
          <p className="text-gray-500">
            Создана: {formatDate(creditRequest.createdAt)}
          </p>
        </div>
        <Link href="/admin">
          <Button variant="outline">Назад к списку</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Информация о заявке</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-500 text-sm">Сумма кредита</h3>
                <p className="font-medium text-lg">
                  {formatCurrency(creditRequest.amount)}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Срок кредита</h3>
                <p className="font-medium text-lg">{creditRequest.term} мес.</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Процентная ставка</h3>
                <p className="font-medium text-lg">{creditRequest.interestRate}%</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Ежемесячный платеж</h3>
                <p className="font-medium text-lg">
                  {creditRequest.monthlyPayment
                    ? formatCurrency(creditRequest.monthlyPayment)
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Общая сумма выплат</h3>
                <p className="font-medium text-lg">
                  {creditRequest.totalPayment
                    ? formatCurrency(creditRequest.totalPayment)
                    : "-"}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Статус заявки</h3>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      creditRequest.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : creditRequest.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : creditRequest.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : creditRequest.status === "ISSUED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {creditRequest.status === "APPROVED"
                      ? "Одобрено"
                      : creditRequest.status === "REJECTED"
                      ? "Отклонено"
                      : creditRequest.status === "PENDING"
                      ? "На рассмотрении"
                      : creditRequest.status === "ISSUED"
                      ? "Выдан"
                      : creditRequest.status === "CANCELED"
                      ? "Отменена"
                      : "Неизвестно"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Личная информация</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-500 text-sm">ФИО</h3>
                <p className="font-medium">
                  {creditRequest.lastName} {creditRequest.firstName}{" "}
                  {creditRequest.middleName || ""}
                </p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Дата рождения</h3>
                <p className="font-medium">{formatDate(creditRequest.birthDate)}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Телефон</h3>
                <p className="font-medium">{creditRequest.phone}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Адрес проживания</h3>
                <p className="font-medium">{creditRequest.address}</p>
              </div>
            </div>
            
            <h3 className="text-gray-500 text-sm mt-4">Паспортные данные</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h3 className="text-gray-500 text-sm">Серия и номер</h3>
                <p className="font-medium">{creditRequest.passportNumber}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Дата выдачи</h3>
                <p className="font-medium">
                  {formatDate(creditRequest.passportIssuedDate)}
                </p>
              </div>
              <div className="col-span-2">
                <h3 className="text-gray-500 text-sm">Кем выдан</h3>
                <p className="font-medium">{creditRequest.passportIssuedBy}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-gray-500 text-sm">Адрес регистрации</h3>
                <p className="font-medium">{creditRequest.passportRegistration}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Данные о занятости</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-500 text-sm">Тип занятости</h3>
                <p className="font-medium">
                  {creditRequest.employmentType === "EMPLOYED"
                    ? "Работа по найму"
                    : creditRequest.employmentType === "SELF_EMPLOYED"
                    ? "Самозанятый"
                    : creditRequest.employmentType === "BUSINESS_OWNER"
                    ? "Владелец бизнеса"
                    : creditRequest.employmentType === "RETIRED"
                    ? "Пенсионер"
                    : creditRequest.employmentType === "STUDENT"
                    ? "Студент"
                    : creditRequest.employmentType === "UNEMPLOYED"
                    ? "Безработный"
                    : "Не указано"}
                </p>
              </div>
              
              {creditRequest.employmentType !== "UNEMPLOYED" && (
                <>
                  {creditRequest.employerName && (
                    <div>
                      <h3 className="text-gray-500 text-sm">Работодатель</h3>
                      <p className="font-medium">{creditRequest.employerName}</p>
                    </div>
                  )}
                  
                  {creditRequest.jobTitle && (
                    <div>
                      <h3 className="text-gray-500 text-sm">Должность</h3>
                      <p className="font-medium">{creditRequest.jobTitle}</p>
                    </div>
                  )}
                  
                  {creditRequest.workExperience !== null && (
                    <div>
                      <h3 className="text-gray-500 text-sm">Стаж работы</h3>
                      <p className="font-medium">{creditRequest.workExperience} мес.</p>
                    </div>
                  )}
                </>
              )}
              
              {creditRequest.monthlyIncome !== null && (
                <div>
                  <h3 className="text-gray-500 text-sm">Ежемесячный доход</h3>
                  <p className="font-medium">
                    {formatCurrency(creditRequest.monthlyIncome)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Скоринг</h2>
            
            {creditRequest.scoringResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Скоринговый балл:</span>
                  <span className={`font-bold text-xl ${
                    creditRequest.scoringPassed
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {creditRequest.scoringResult}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Результат:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    creditRequest.scoringPassed
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {creditRequest.scoringPassed ? "Одобрен" : "Не одобрен"}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${
                    creditRequest.scoringResult >= 80
                      ? "bg-green-600"
                      : creditRequest.scoringResult >= 60
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`} style={{ width: `${creditRequest.scoringResult}%` }}></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Скоринг не проводился</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Информация о клиенте</h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-gray-500 text-sm">Имя</h3>
                <p className="font-medium">{creditRequest.user.name}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Email</h3>
                <p className="font-medium">{creditRequest.user.email}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">ID клиента</h3>
                <p className="font-medium">{creditRequest.user.id}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Дата регистрации</h3>
                <p className="font-medium">{formatDate(creditRequest.user.createdAt)}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <Link href={`/admin/users/${creditRequest.user.id}`}>
                <Button variant="outline" className="w-full">
                  Просмотреть профиль
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Действия</h2>
            
            <StatusActions 
              requestId={creditRequest.id} 
              currentStatus={creditRequest.status} 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
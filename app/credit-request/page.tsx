import { Metadata } from "next";
import { CreditRequestForm } from "./components/CreditRequestForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Заявка на кредит | БанкКредит",
  description: "Оформление заявки на получение кредита",
};

export default async function CreditRequestPage() {
  const session = await getServerSession(authOptions);
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!session) {
    redirect("/auth/login?returnTo=/credit-request");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Заявка на кредит
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
        Заполните форму ниже для подачи заявки на кредит. Мы рассмотрим вашу заявку 
        в течение 10 минут и свяжемся с вами для уточнения деталей.
      </p>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
        <CreditRequestForm />
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Процесс рассмотрения заявки</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Заполните форму заявки и отправьте её.</li>
          <li>Система автоматически проведет предварительную проверку данных.</li>
          <li>В течение 10 минут вы получите предварительное решение по заявке.</li>
          <li>При положительном решении с вами свяжется менеджер для уточнения деталей.</li>
          <li>После окончательного одобрения вы сможете подписать договор и получить деньги.</li>
        </ol>
        <p className="mt-4 text-sm text-gray-600">
          Для ускорения процесса рассмотрения заявки, пожалуйста, предоставьте точные и достоверные данные.
        </p>
      </div>
    </div>
  );
} 
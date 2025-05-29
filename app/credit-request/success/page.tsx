import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "Заявка успешно отправлена | БанкКредит",
  description: "Ваша заявка на кредит успешно отправлена и принята в обработку",
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const { id } = searchParams;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Заявка успешно отправлена!</h1>

        <p className="text-gray-600 mb-6">
          Ваша заявка на кредит принята в обработку. Мы свяжемся с вами в
          ближайшее время для уточнения деталей.
        </p>

        {id && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700">
              Номер вашей заявки: <span className="font-bold">{id}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Сохраните этот номер для отслеживания статуса заявки
            </p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-gray-600 font-medium">Что происходит дальше?</p>
          <ol className="text-left text-gray-600 space-y-2 mb-6">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 font-bold">
                1
              </span>
              <span>
                Наша система автоматически проверит вашу заявку (займет около 10
                минут)
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 font-bold">
                2
              </span>
              <span>
                Вы получите SMS с предварительным решением по вашей заявке
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 font-bold">
                3
              </span>
              <span>
                Наш менеджер свяжется с вами для уточнения деталей и
                согласования дальнейших шагов
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link href="/">
            <Button variant="outline">Вернуться на главную</Button>
          </Link>
          <Link href={`/profile/applications${id ? `?highlight=${id}` : ""}`}>
            <Button>Перейти к моим заявкам</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
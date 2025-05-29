import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "О компании | БанкКредит",
  description: "Информация о банке, история и миссия компании",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        О компании БанкКредит
      </h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
          <p className="text-gray-700 mb-4">
            Наша миссия — сделать финансовые услуги доступными и понятными для каждого. 
            Мы стремимся предоставлять инновационные и удобные решения, которые помогают 
            нашим клиентам достигать своих финансовых целей.
          </p>
          <p className="text-gray-700">
            Мы верим, что прозрачность, честность и клиентоориентированность — 
            ключевые принципы успешного банковского дела. Поэтому мы всегда предлагаем 
            только те решения, которые действительно подходят нашим клиентам.
          </p>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1562920618-5e5d5a088667?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
            alt="Офис БанкКредит"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Наша история</h2>
        <div className="space-y-6">
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2010
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold">Основание компании</h3>
              <p className="text-gray-700 mt-2">
                Компания была основана группой опытных финансистов с целью создания 
                современного и технологичного банка, ориентированного на потребности клиентов.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2015
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold">Расширение услуг</h3>
              <p className="text-gray-700 mt-2">
                Запуск новых кредитных продуктов, включая ипотечное кредитование и 
                специальные предложения для малого и среднего бизнеса.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2018
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold">Цифровая трансформация</h3>
              <p className="text-gray-700 mt-2">
                Внедрение современных технологий и запуск онлайн-сервисов для 
                удобства клиентов. Создание мобильного приложения и личного кабинета.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2023
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold">Сегодняшний день</h3>
              <p className="text-gray-700 mt-2">
                Сегодня БанкКредит — это современный финансовый институт, предлагающий широкий 
                спектр услуг и продуктов, адаптированных под разные потребности клиентов.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Наши ценности</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Клиентоориентированность</h3>
            <p className="text-gray-600">
              Мы ставим интересы клиентов превыше всего и стремимся превосходить их ожидания.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Надежность</h3>
            <p className="text-gray-600">
              Мы обеспечиваем высокий уровень безопасности и стабильности всех финансовых операций.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Инновационность</h3>
            <p className="text-gray-600">
              Мы постоянно совершенствуем наши технологии и процессы для обеспечения лучшего сервиса.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Контактная информация</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Центральный офис</h3>
            <p className="mb-2"><strong>Адрес:</strong> г. Москва, ул. Кредитная, д. 123</p>
            <p className="mb-2"><strong>Телефон:</strong> +7 (999) 123-45-67</p>
            <p className="mb-2"><strong>Email:</strong> info@bankcredit.ru</p>
            <p className="mb-2"><strong>Режим работы:</strong> Пн-Пт с 9:00 до 18:00</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Для связи</h3>
            <p className="mb-2"><strong>Горячая линия:</strong> 8-800-123-45-67 (круглосуточно)</p>
            <p className="mb-2"><strong>Для юридических лиц:</strong> +7 (999) 765-43-21</p>
            <p className="mb-2"><strong>Техническая поддержка:</strong> support@bankcredit.ru</p>
            <p className="mb-2"><strong>Для прессы:</strong> pr@bankcredit.ru</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
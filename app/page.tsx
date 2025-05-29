import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  return (
    <div>
      {/* Hero секция */}
      <section className="bg-blue-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Кредиты на любые цели по выгодным ставкам
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Получите деньги быстро и просто, с минимальным пакетом документов и удобными условиями погашения.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/calculator">
                  <Button variant="default" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                    Рассчитать кредит
                  </Button>
                </Link>
                <Link href="/credit-request">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-800">
                    Оформить заявку
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block bg-white/10 rounded-lg p-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">Преимущества наших кредитов</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ставка от 5.9% годовых</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Сумма до 5 000 000 ₽</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Срок кредита до 7 лет</span>
          </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Решение за 10 минут</span>
          </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция услуг */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Наши кредитные продукты</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Ипотека</h3>
              <p className="text-gray-600 mb-4">
                Выгодные условия для покупки жилья. Низкие ставки и длительные сроки кредитования.
              </p>
              <span className="text-sm font-semibold text-blue-600">от 4.5% годовых</span>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Потребительский кредит</h3>
              <p className="text-gray-600 mb-4">
                Деньги на любые цели без залога и поручителей. Быстрое решение и минимум документов.
              </p>
              <span className="text-sm font-semibold text-blue-600">от 5.9% годовых</span>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Кредит на бизнес</h3>
              <p className="text-gray-600 mb-4">
                Финансирование малого и среднего бизнеса. Индивидуальные условия для предпринимателей.
              </p>
              <span className="text-sm font-semibold text-blue-600">от 8.5% годовых</span>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/credit-request">
              <Button variant="primary" size="lg">
                Подать заявку на кредит
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция калькулятора */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Кредитный калькулятор
                </h2>
                <p className="text-white/90 mb-6">
                  Рассчитайте ежемесячный платеж и общую стоимость кредита с помощью нашего удобного калькулятора.
                </p>
                <Link href="/calculator">
                  <Button variant="default" className="bg-white text-blue-700 hover:bg-gray-100">
                    Перейти к калькулятору
                  </Button>
                </Link>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white border border-white/20">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Сумма кредита</h4>
                    <div className="bg-white/20 rounded-md h-3"></div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Срок кредита</h4>
                    <div className="bg-white/20 rounded-md h-3"></div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Процентная ставка</h4>
                    <div className="bg-white/20 rounded-md h-3"></div>
                  </div>
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <h4 className="font-medium mb-2">Ежемесячный платеж</h4>
                    <div className="text-xl font-bold">-- ₽</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция отзывов */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Клиенты о нас</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">АИ</span>
                </div>
                <div>
                  <h4 className="font-bold">Алексей Иванов</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Очень быстро оформили потребительский кредит. Удобный сервис, минимум документов. Ставка действительно оказалась ниже, чем в других банках."
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">ЕС</span>
                </div>
                <div>
                  <h4 className="font-bold">Елена Смирнова</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Оформила ипотеку на очень выгодных условиях. Сотрудники банка помогли подобрать оптимальную программу. Рекомендую!"
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">ДК</span>
                </div>
                <div>
                  <h4 className="font-bold">Дмитрий Козлов</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Взял кредит на развитие бизнеса. Понравился индивидуальный подход и гибкий график погашения. Спасибо за профессионализм!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы оформить кредит?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Не откладывайте свои планы на потом. Оформите заявку онлайн и получите предварительное решение за 10 минут.
          </p>
          <Link href="/credit-request">
            <Button variant="default" size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
              Оформить заявку
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

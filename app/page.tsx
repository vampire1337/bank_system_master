import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero секция */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('/patterns/grid.svg')] z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Кредиты на любые цели по выгодным ставкам
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Получите деньги быстро и просто, с минимальным пакетом документов и удобными условиями погашения.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/calculator">
                  <Button variant="default" size="lg" animation="fadeIn" rounded="full" className="bg-white text-blue-700 hover:bg-gray-100">
                    Рассчитать кредит
                  </Button>
                </Link>
                <Link href="/credit-request">
                  <Button variant="glass" size="lg" rounded="full" className="border-white text-white hover:bg-white/20">
                    Оформить заявку
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="glass-effect rounded-2xl p-8 transform rotate-1 shadow-xl">
                <div className="backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h3 className="text-2xl font-bold mb-6 text-white">Преимущества наших кредитов</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white text-lg">Ставка от 5.9% годовых</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white text-lg">Сумма до 5 000 000 ₽</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white text-lg">Срок кредита до 7 лет</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 bg-white/30 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white text-lg">Решение за 10 минут</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-white z-10" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
      </section>

      {/* Секция услуг */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text inline-block mb-4">Наши кредитные продукты</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Выберите подходящий вариант кредитования с оптимальными условиями специально для вас
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" animation="hover" className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <CardTitle>Ипотека</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Выгодные условия для покупки жилья. Низкие ставки и длительные сроки кредитования.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">от 4.5% годовых</span>
                  <Link href="#">
                    <Button variant="ghost" size="sm">
                      Подробнее
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" animation="hover" className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <CardTitle>Потребительский кредит</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Деньги на любые цели без залога и поручителей. Быстрое решение и минимум документов.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">от 5.9% годовых</span>
                  <Link href="#">
                    <Button variant="ghost" size="sm">
                      Подробнее
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" animation="hover" className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle>Кредит на бизнес</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Финансирование малого и среднего бизнеса. Индивидуальные условия для предпринимателей.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">от 8.5% годовых</span>
                  <Link href="#">
                    <Button variant="ghost" size="sm">
                      Подробнее
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/credit-request">
              <Button variant="gradient" size="lg" rounded="full" className="px-8">
                Подать заявку на кредит
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция калькулятора */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('/patterns/circuit.svg')] z-0"></div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Кредитный калькулятор
                </h2>
                <p className="text-white/90 mb-6 text-lg">
                  Рассчитайте ежемесячный платеж и общую стоимость кредита с помощью нашего удобного калькулятора.
                </p>
                <Link href="/calculator">
                  <Button variant="default" size="lg" rounded="full" className="bg-white text-blue-700 hover:bg-gray-100">
                    Перейти к калькулятору
                  </Button>
                </Link>
              </div>
              <div className="glass-effect rounded-xl p-6 text-white border border-white/20 shadow-lg transform rotate-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Сумма кредита</h4>
                    <div className="bg-white/20 rounded-md h-3 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-white/50 w-3/4 rounded-md"></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>0 ₽</span>
                      <span>5 000 000 ₽</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Срок кредита</h4>
                    <div className="bg-white/20 rounded-md h-3 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-white/50 w-1/2 rounded-md"></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>1 год</span>
                      <span>7 лет</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Процентная ставка</h4>
                    <div className="bg-white/20 rounded-md h-3 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-white/50 w-1/4 rounded-md"></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>5.9%</span>
                      <span>15.0%</span>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <h4 className="font-medium mb-2">Ежемесячный платеж</h4>
                    <div className="text-2xl font-bold">42 500 ₽</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция отзывов */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gradient-text inline-block mb-4">Клиенты о нас</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Отзывы наших клиентов о качестве обслуживания и кредитных продуктах
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" animation="hover" className="overflow-hidden">
              <CardContent className="pt-6">
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
                <p className="text-muted-foreground">
                  "Очень быстро оформили потребительский кредит. Удобный сервис, минимум документов. Ставка действительно оказалась ниже, чем в других банках."
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Клиент с 2022 года
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" animation="hover" className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 font-bold">ЕС</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Елена Смирнова</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Оформила ипотеку на очень выгодных условиях. Сотрудники банка помогли подобрать оптимальную программу. Рекомендую!"
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Клиент с 2023 года
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" animation="hover" className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">МК</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Михаил Кузнецов</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Брал кредит на развитие бизнеса. Порадовала скорость рассмотрения заявки и доступная процентная ставка. Все условия прозрачны."
                </p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Клиент с 2021 года
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

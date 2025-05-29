import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">БанкКредит</h3>
            <p className="text-gray-300 text-sm">
              Мы предлагаем быстрое и удобное оформление кредитов на выгодных
              условиях. Наша цель - сделать финансовые услуги доступными для
              каждого.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="text-gray-300 hover:text-white"
                >
                  Кредитный калькулятор
                </Link>
              </li>
              <li>
                <Link
                  href="/credit-request"
                  className="text-gray-300 hover:text-white"
                >
                  Заявка на кредит
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  О компании
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">
                <span className="font-medium">Адрес:</span> г. Москва, ул.
                Кредитная, д. 123
              </li>
              <li className="text-gray-300">
                <span className="font-medium">Телефон:</span> +7 (999) 123-45-67
              </li>
              <li className="text-gray-300">
                <span className="font-medium">Email:</span> info@bankcredit.ru
              </li>
              <li className="text-gray-300">
                <span className="font-medium">Режим работы:</span> Пн-Пт 9:00 -
                18:00
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} БанкКредит. Все права защищены.</p>
          <p className="mt-2">
            Лицензия ЦБ РФ №1234 от 01.01.2023
          </p>
        </div>
      </div>
    </footer>
  );
}; 
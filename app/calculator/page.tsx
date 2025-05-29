import { Metadata } from "next";
import { CreditCalculator } from "./components/CreditCalculator";

export const metadata: Metadata = {
  title: "Кредитный калькулятор | БанкКредит",
  description: "Рассчитайте ежемесячный платеж и общую стоимость кредита с помощью нашего калькулятора",
};

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Кредитный калькулятор
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Рассчитайте примерный ежемесячный платеж и общую стоимость кредита с помощью нашего калькулятора. 
          Подберите оптимальные для вас параметры кредита.
        </p>
        
        <CreditCalculator />
        
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Как пользоваться калькулятором</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Укажите сумму кредита, которую вы хотите получить.</li>
            <li>Выберите срок кредита в месяцах (от 3 до 84 месяцев).</li>
            <li>Установите процентную ставку (мы предлагаем ставки от 5.9% годовых).</li>
            <li>Система автоматически рассчитает ежемесячный платеж и общую сумму выплат.</li>
            <li>При необходимости вы можете сохранить расчет и оформить заявку на кредит.</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            Калькулятор дает примерный расчет. Точные условия будут определены после рассмотрения вашей заявки.
          </p>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { formatCurrency, calculateMonthlyPayment, calculateTotalPayment } from "@/app/lib/utils";
import { Slider } from "@/app/components/ui/slider";

export const CreditCalculator = () => {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number>(500000);
  const [term, setTerm] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    calculatePayments();
  }, [amount, term, interestRate]);

  const calculatePayments = () => {
    setIsCalculating(true);
    
    // Добавляем небольшую задержку для лучшего UX
    setTimeout(() => {
      const monthly = calculateMonthlyPayment(amount, term, interestRate);
      const total = calculateTotalPayment(monthly, term);
      
      setMonthlyPayment(monthly);
      setTotalPayment(total);
      setIsCalculating(false);
    }, 300);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
    if (isNaN(value)) {
      setAmount(0);
    } else {
      setAmount(Math.min(Math.max(value, 10000), 5000000));
    }
  };

  const handleTermChange = (value: number[]) => {
    setTerm(value[0]);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
    if (isNaN(value)) {
      setInterestRate(0);
    } else {
      setInterestRate(Math.min(Math.max(value, 1), 30));
    }
  };

  const saveCalculation = async () => {
    if (!session) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/calculator/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          term,
          interestRate,
          monthlyPayment,
          totalPayment,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Ошибка сохранения расчета:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <Label htmlFor="amount" className="text-lg mb-2 block">
              Сумма кредита
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                value={formatCurrency(amount).replace("₽", "")}
                onChange={handleAmountChange}
                className="pr-10 text-lg"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₽
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={5000000}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>10 000 ₽</span>
              <span>5 000 000 ₽</span>
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="term" className="text-lg mb-2 block">
              Срок кредита: {term} мес.
            </Label>
            <Slider 
              defaultValue={[term]} 
              min={3} 
              max={84} 
              step={1} 
              onValueChange={handleTermChange}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>3 мес.</span>
              <span>84 мес.</span>
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="interestRate" className="text-lg mb-2 block">
              Процентная ставка
            </Label>
            <div className="relative">
              <Input
                id="interestRate"
                type="text"
                value={interestRate}
                onChange={handleInterestRateChange}
                className="pr-10 text-lg"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                %
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg flex flex-col">
          <h3 className="text-xl font-bold mb-6">Результаты расчета</h3>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Ежемесячный платеж</p>
            {isCalculating ? (
              <div className="animate-pulse bg-gray-200 h-8 w-2/3 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</p>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Общая сумма выплат</p>
            {isCalculating ? (
              <div className="animate-pulse bg-gray-200 h-8 w-2/3 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(totalPayment)}</p>
            )}
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Переплата по кредиту</p>
            {isCalculating ? (
              <div className="animate-pulse bg-gray-200 h-8 w-2/3 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(totalPayment - amount)}</p>
            )}
          </div>
          
          <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-4">
            {session ? (
              <Button 
                onClick={saveCalculation} 
                variant="outline" 
                disabled={isSaving}
                className="sm:flex-1"
              >
                {isSaving ? "Сохранение..." : saveSuccess ? "Сохранено!" : "Сохранить расчет"}
              </Button>
            ) : (
              <Link href="/auth/login" className="sm:flex-1">
                <Button variant="outline" className="w-full">
                  Войти для сохранения
                </Button>
              </Link>
            )}
            
            <Link href="/credit-request" className="sm:flex-1">
              <Button className="w-full">Оформить заявку</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { formatCurrency } from "@/app/lib/utils";
import { Slider } from "@/app/components/ui/slider";
import { CalculatorTabs } from "./CalculatorTabs";
import { loanPresets } from "@/app/lib/calculatorUtils";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

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
  const [showDetailedResults, setShowDetailedResults] = useState<boolean>(false);

  useEffect(() => {
    calculatePayments();
  }, [amount, term, interestRate]);

  const calculatePayments = () => {
    setIsCalculating(true);
    
    // Добавляем небольшую задержку для лучшего UX
    setTimeout(() => {
      const monthly = (amount * (interestRate / 100 / 12) * Math.pow(1 + interestRate / 100 / 12, term)) /
                     (Math.pow(1 + interestRate / 100 / 12, term) - 1);
      const total = monthly * term;
      
      setMonthlyPayment(Math.round(monthly));
      setTotalPayment(Math.round(total));
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
  
  const applyPreset = (preset: typeof loanPresets[0]) => {
    setAmount(preset.amount);
    setTerm(preset.term);
    setInterestRate(preset.rate);
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
      // Ошибка при сохранении
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <Label htmlFor="preset" className="text-lg mb-2 block">
                Готовые решения
              </Label>
              <Select onValueChange={(value) => {
                const preset = loanPresets.find(p => p.name === value);
                if (preset) applyPreset(preset);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип кредита" />
                </SelectTrigger>
                <SelectContent>
                  {loanPresets.map((preset, index) => (
                    <SelectItem key={index} value={preset.name}>
                      {preset.name} - {formatCurrency(preset.amount)}, {preset.term} мес., {preset.rate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
              <Slider
                defaultValue={[amount]}
                min={10000}
                max={5000000}
                step={10000}
                value={[amount]}
                onValueChange={(value) => setAmount(value[0])}
                className="mt-2"
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
                value={[term]}
                onValueChange={handleTermChange}
                className="mt-2"
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
              <Slider
                defaultValue={[interestRate]}
                min={1}
                max={30}
                step={0.1}
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                className="mt-2"
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
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPayment - amount)}</p>
              )}
            </div>
            
            <div className="mt-auto pt-4 flex flex-col gap-4">
              <Button 
                onClick={() => setShowDetailedResults(!showDetailedResults)}
                variant={showDetailedResults ? "default" : "outline"}
              >
                {showDetailedResults ? "Скрыть детали" : "Показать подробный расчет"}
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
      
      {showDetailedResults && (
        <Card>
          <CardContent className="pt-6">
            <CalculatorTabs 
              amount={amount}
              term={term}
              interestRate={interestRate}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { PaymentChart } from "./PaymentChart";
import { PaymentScheduleTable } from "./PaymentScheduleTable";
import { LoanComparison } from "./LoanComparison";
import { 
  calculatePaymentSchedule, 
  calculateLoanTotals, 
  PaymentScheduleItem 
} from "@/app/lib/calculatorUtils";

interface CalculatorTabsProps {
  amount: number;
  term: number;
  interestRate: number;
}

export const CalculatorTabs = ({ amount, term, interestRate }: CalculatorTabsProps) => {
  const [activeTab, setActiveTab] = useState("chart");
  
  // Вычисляем график платежей
  const schedule: PaymentScheduleItem[] = calculatePaymentSchedule(amount, interestRate, term);
  const { totalInterest } = calculateLoanTotals(schedule);
  
  return (
    <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="chart">График платежей</TabsTrigger>
        <TabsTrigger value="table">Таблица платежей</TabsTrigger>
        <TabsTrigger value="comparison">Сравнение</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="mt-0">
        <PaymentChart 
          schedule={schedule} 
          principal={amount} 
          totalInterest={totalInterest} 
        />
      </TabsContent>
      
      <TabsContent value="table" className="mt-0">
        <PaymentScheduleTable schedule={schedule} />
      </TabsContent>
      
      <TabsContent value="comparison" className="mt-0">
        <LoanComparison 
          currentLoan={{
            amount,
            term,
            rate: interestRate
          }}
        />
      </TabsContent>
    </Tabs>
  );
}; 
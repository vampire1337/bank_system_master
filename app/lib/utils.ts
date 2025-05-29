import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Функция для объединения классов Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует валюту в рублях
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирует дату в формате ДД.ММ.ГГГГ
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU").format(dateObj);
}

/**
 * Рассчитывает ежемесячный платеж по кредиту
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  // Преобразуем годовую ставку в месячную (в десятичном формате)
  const monthlyRate = annualRate / 100 / 12;
  
  // Используем формулу аннуитетного платежа
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  return Math.round(monthlyPayment);
}

/**
 * Рассчитывает общую сумму выплат по кредиту
 */
export function calculateTotalPayment(
  monthlyPayment: number,
  termMonths: number
): number {
  return Math.round(monthlyPayment * termMonths);
}

/**
 * Рассчитывает скоринговый балл для заявки
 * Возвращает значение от 0 до 100
 */
export function calculateScoring(
  age: number,
  monthlyIncome: number,
  employmentType: string,
  workExperience: number,
  loanAmount: number
): number {
  let score = 0;
  
  // Оценка по возрасту (0-20 баллов)
  if (age < 21) {
    score += 5; // Низкий балл для очень молодых
  } else if (age <= 25) {
    score += 10;
  } else if (age <= 45) {
    score += 20; // Наивысший балл для основной возрастной группы
  } else if (age <= 60) {
    score += 15;
  } else {
    score += 5; // Низкий балл для пожилых
  }
  
  // Оценка по типу занятости (0-20 баллов)
  switch (employmentType) {
    case "EMPLOYED":
      score += 20; // Максимальный балл для работающих по найму
      break;
    case "SELF_EMPLOYED":
      score += 15;
      break;
    case "BUSINESS_OWNER":
      score += 18;
      break;
    case "RETIRED":
      score += 10;
      break;
    case "STUDENT":
      score += 5;
      break;
    case "UNEMPLOYED":
      score += 0; // Минимальный балл для безработных
      break;
    default:
      score += 0;
  }
  
  // Оценка по стажу работы (0-15 баллов)
  if (workExperience < 6) {
    score += 5;
  } else if (workExperience < 12) {
    score += 10;
  } else if (workExperience < 36) {
    score += 13;
  } else {
    score += 15; // Максимальный балл за длительный стаж
  }
  
  // Оценка соотношения дохода к сумме кредита (0-30 баллов)
  // Рассчитываем, сколько месячных доходов составляет запрашиваемая сумма
  const incomeToLoanRatio = monthlyIncome > 0 ? loanAmount / monthlyIncome : Infinity;
  
  if (incomeToLoanRatio <= 6) {
    score += 30; // Наивысший балл - сумма кредита до 6 месячных доходов
  } else if (incomeToLoanRatio <= 12) {
    score += 25;
  } else if (incomeToLoanRatio <= 18) {
    score += 20;
  } else if (incomeToLoanRatio <= 24) {
    score += 15;
  } else if (incomeToLoanRatio <= 36) {
    score += 10;
  } else if (incomeToLoanRatio <= 48) {
    score += 5;
  } else {
    score += 0; // Минимальный балл, если кредит превышает 48 месячных доходов
  }
  
  // Проверка на наличие дохода (до 15 баллов)
  if (monthlyIncome > 0) {
    // Бонусные баллы за высокий доход
    if (monthlyIncome >= 150000) {
      score += 15;
    } else if (monthlyIncome >= 100000) {
      score += 12;
    } else if (monthlyIncome >= 70000) {
      score += 10;
    } else if (monthlyIncome >= 40000) {
      score += 8;
    } else if (monthlyIncome >= 25000) {
      score += 5;
    } else {
      score += 3;
    }
  }
  
  // Максимальный скоринговый балл равен 100
  return Math.min(100, score);
} 
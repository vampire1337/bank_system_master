"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useSession } from "next-auth/react";
import { formatCurrency, calculateMonthlyPayment, calculateTotalPayment } from "@/app/lib/utils";

// Схема валидации для формы заявки
const creditRequestSchema = z.object({
  // Параметры кредита
  amount: z.number().min(10000, "Минимальная сумма - 10 000 ₽").max(5000000, "Максимальная сумма - 5 000 000 ₽"),
  term: z.number().min(3, "Минимальный срок - 3 месяца").max(84, "Максимальный срок - 84 месяца"),
  
  // Личная информация
  firstName: z.string().min(2, "Укажите имя"),
  lastName: z.string().min(2, "Укажите фамилию"),
  middleName: z.string().optional(),
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18 && age <= 70;
  }, "Возраст должен быть от 18 до 70 лет"),
  passportNumber: z.string().regex(/^\d{10}$/, "Серия и номер паспорта должны содержать 10 цифр"),
  passportIssuedBy: z.string().min(5, "Укажите кем выдан паспорт"),
  passportIssuedDate: z.string(),
  passportRegistration: z.string().min(5, "Укажите адрес регистрации"),
  
  // Данные о занятости
  employmentType: z.enum(["EMPLOYED", "SELF_EMPLOYED", "BUSINESS_OWNER", "RETIRED", "STUDENT", "UNEMPLOYED"]),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  workExperience: z.number().optional(),
  monthlyIncome: z.number().min(1, "Укажите ежемесячный доход").optional(),
  
  // Контактные данные
  phone: z.string().regex(/^\+7\d{10}$/, "Формат: +7XXXXXXXXXX"),
  address: z.string().min(5, "Укажите адрес проживания"),
  
  // Страхование
  hasInsurance: z.boolean().default(false),
  insuranceProgramId: z.string().optional(),
});

type CreditRequestFormData = z.infer<typeof creditRequestSchema>;

export const CreditRequestForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [interestRate, setInterestRate] = useState(9.5); // Базовая ставка
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreditRequestFormData>({
    resolver: zodResolver(creditRequestSchema),
    defaultValues: {
      amount: 500000,
      term: 36,
      hasInsurance: false,
      employmentType: "EMPLOYED",
    },
  });
  
  const watchAmount = watch("amount");
  const watchTerm = watch("term");
  
  // Расчет платежей
  const monthlyPayment = calculateMonthlyPayment(
    watchAmount || 0,
    interestRate,
    watchTerm || 0
  );
  
  const totalPayment = calculateTotalPayment(monthlyPayment, watchTerm || 0);
  
  const onSubmit = async (data: CreditRequestFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/credit-request/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          interestRate,
          monthlyPayment,
          totalPayment,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Произошла ошибка при отправке заявки");
        return;
      }
      
      // Перенаправление на страницу успешной подачи заявки
      router.push(`/credit-request/success?id=${result.id}`);
    } catch (error) {
      setError("Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Шаг 1: Параметры кредита */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Параметры кредита</h2>
          
          <div>
            <Label htmlFor="amount">Сумма кредита</Label>
            <div className="relative mt-1">
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="amount"
                    type="text"
                    value={formatCurrency(field.value).replace("₽", "")}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                    className={errors.amount ? "border-red-500" : ""}
                  />
                )}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₽
              </span>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
            <input
              type="range"
              min={10000}
              max={5000000}
              step={10000}
              value={watchAmount || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                setValue("amount", value);
              }}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>10 000 ₽</span>
              <span>5 000 000 ₽</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="term">Срок кредита (месяцев)</Label>
            <div className="mt-1">
              <Controller
                name="term"
                control={control}
                render={({ field }) => (
                  <Input
                    id="term"
                    type="number"
                    min={3}
                    max={84}
                    {...field}
                    className={errors.term ? "border-red-500" : ""}
                  />
                )}
              />
            </div>
            {errors.term && (
              <p className="text-red-500 text-sm mt-1">{errors.term.message}</p>
            )}
            <input
              type="range"
              min={3}
              max={84}
              step={1}
              value={watchTerm || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                setValue("term", value);
              }}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>3 мес.</span>
              <span>84 мес.</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Расчет платежей</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Ежемесячный платеж:</p>
                <p className="font-bold">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Общая сумма:</p>
                <p className="font-bold">{formatCurrency(totalPayment)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Переплата:</p>
                <p className="font-bold">{formatCurrency(totalPayment - (watchAmount || 0))}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Процентная ставка:</p>
                <p className="font-bold">{interestRate}%</p>
              </div>
            </div>
          </div>
          
          <Button type="button" onClick={nextStep} className="w-full">
            Продолжить
          </Button>
        </div>
      )}
      
      {/* Шаг 2: Личная информация */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Личная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="middleName">Отчество (при наличии)</Label>
            <Input
              id="middleName"
              {...register("middleName")}
            />
          </div>
          
          <div>
            <Label htmlFor="birthDate">Дата рождения</Label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate")}
              className={errors.birthDate ? "border-red-500" : ""}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="passportNumber">Серия и номер паспорта (10 цифр)</Label>
            <Input
              id="passportNumber"
              {...register("passportNumber")}
              className={errors.passportNumber ? "border-red-500" : ""}
            />
            {errors.passportNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.passportNumber.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="passportIssuedBy">Кем выдан</Label>
            <Input
              id="passportIssuedBy"
              {...register("passportIssuedBy")}
              className={errors.passportIssuedBy ? "border-red-500" : ""}
            />
            {errors.passportIssuedBy && (
              <p className="text-red-500 text-sm mt-1">{errors.passportIssuedBy.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="passportIssuedDate">Дата выдачи</Label>
            <Input
              id="passportIssuedDate"
              type="date"
              {...register("passportIssuedDate")}
              className={errors.passportIssuedDate ? "border-red-500" : ""}
            />
            {errors.passportIssuedDate && (
              <p className="text-red-500 text-sm mt-1">{errors.passportIssuedDate.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="passportRegistration">Адрес регистрации</Label>
            <Input
              id="passportRegistration"
              {...register("passportRegistration")}
              className={errors.passportRegistration ? "border-red-500" : ""}
            />
            {errors.passportRegistration && (
              <p className="text-red-500 text-sm mt-1">{errors.passportRegistration.message}</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button type="button" onClick={prevStep} variant="outline">
              Назад
            </Button>
            <Button type="button" onClick={nextStep}>
              Продолжить
            </Button>
          </div>
        </div>
      )}
      
      {/* Шаг 3: Данные о занятости */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Данные о занятости</h2>
          
          <div>
            <Label htmlFor="employmentType">Тип занятости</Label>
            <Controller
              name="employmentType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={errors.employmentType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Выберите тип занятости" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYED">Работаю по найму</SelectItem>
                    <SelectItem value="SELF_EMPLOYED">Самозанятый</SelectItem>
                    <SelectItem value="BUSINESS_OWNER">Владелец бизнеса</SelectItem>
                    <SelectItem value="RETIRED">Пенсионер</SelectItem>
                    <SelectItem value="STUDENT">Студент</SelectItem>
                    <SelectItem value="UNEMPLOYED">Безработный</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employmentType && (
              <p className="text-red-500 text-sm mt-1">{errors.employmentType.message}</p>
            )}
          </div>
          
          {watch("employmentType") !== "UNEMPLOYED" && watch("employmentType") !== "STUDENT" && (
            <>
              <div>
                <Label htmlFor="employerName">Название организации</Label>
                <Input
                  id="employerName"
                  {...register("employerName")}
                  className={errors.employerName ? "border-red-500" : ""}
                />
                {errors.employerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.employerName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="jobTitle">Должность</Label>
                <Input
                  id="jobTitle"
                  {...register("jobTitle")}
                  className={errors.jobTitle ? "border-red-500" : ""}
                />
                {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="workExperience">Стаж работы (месяцев)</Label>
                <Controller
                  name="workExperience"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="workExperience"
                      type="number"
                      min={0}
                      {...field}
                      className={errors.workExperience ? "border-red-500" : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                {errors.workExperience && (
                  <p className="text-red-500 text-sm mt-1">{errors.workExperience.message}</p>
                )}
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="monthlyIncome">Ежемесячный доход (₽)</Label>
            <div className="relative mt-1">
              <Controller
                name="monthlyIncome"
                control={control}
                render={({ field }) => (
                  <Input
                    id="monthlyIncome"
                    type="text"
                    value={field.value ? formatCurrency(field.value).replace("₽", "") : ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ""));
                      field.onChange(isNaN(value) ? undefined : value);
                    }}
                    className={errors.monthlyIncome ? "border-red-500" : ""}
                  />
                )}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ₽
              </span>
            </div>
            {errors.monthlyIncome && (
              <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome.message}</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button type="button" onClick={prevStep} variant="outline">
              Назад
            </Button>
            <Button type="button" onClick={nextStep}>
              Продолжить
            </Button>
          </div>
        </div>
      )}
      
      {/* Шаг 4: Контактные данные и страхование */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4">Контактные данные</h2>
          
          <div>
            <Label htmlFor="phone">Телефон (формат: +7XXXXXXXXXX)</Label>
            <Input
              id="phone"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
              placeholder="+7XXXXXXXXXX"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="address">Адрес проживания</Label>
            <Input
              id="address"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-bold mb-4">Страхование</h2>
            
            <div className="flex items-center mb-4">
              <input
                id="hasInsurance"
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                {...register("hasInsurance")}
              />
              <Label htmlFor="hasInsurance" className="ml-2">
                Оформить страхование кредита
              </Label>
            </div>
            
            {watch("hasInsurance") && (
              <div>
                <Label htmlFor="insuranceProgramId">Программа страхования</Label>
                <Controller
                  name="insuranceProgramId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите программу страхования" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Базовая (1.5% от суммы кредита)</SelectItem>
                        <SelectItem value="standard">Стандартная (2.5% от суммы кредита)</SelectItem>
                        <SelectItem value="premium">Премиум (4% от суммы кредита)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">Обратите внимание</h3>
              <p className="text-sm">
                Нажимая кнопку "Отправить заявку", вы соглашаетесь с условиями обработки персональных данных
                и даете согласие на проверку кредитной истории.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button type="button" onClick={prevStep} variant="outline">
                Назад
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}; 
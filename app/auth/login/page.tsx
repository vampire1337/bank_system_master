"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result?.ok) {
        setError("Неверные учетные данные. Проверьте email и пароль.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("Произошла ошибка при входе. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Банковская система</h1>
          <p className="text-muted-foreground">Войдите в свой аккаунт</p>
        </div>
        
        <Card variant="elevated" animation="hover" className="overflow-hidden">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center">Вход в личный кабинет</CardTitle>
            <CardDescription className="text-center">
              Введите свои учетные данные для входа
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ваш@email.com"
                  {...register("email")}
                  className={cn(
                    "transition-all duration-200 focus:ring-2 focus:ring-primary/50",
                    errors.email ? "border-red-500 focus:ring-red-500/50" : ""
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Забыли пароль?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "transition-all duration-200 focus:ring-2 focus:ring-primary/50",
                    errors.password ? "border-red-500 focus:ring-red-500/50" : ""
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-sm font-medium">Запомнить меня</Label>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? "Выполняется вход..." : "Войти"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4 bg-muted/50">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Нет аккаунта?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary font-medium hover:underline"
                >
                  Зарегистрироваться
                </Link>
              </p>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              <p>Тестовый доступ:</p>
              <p>Email: user@example.com / Пароль: password123</p>
              <p>Email: admin@example.com / Пароль: admin123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const navItems = [
    { title: "Главная", href: "/" },
    { title: "Калькулятор", href: "/calculator" },
    { title: "Заявка на кредит", href: "/credit-request" },
    { title: "О компании", href: "/about" },
  ];

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              БанкКредит
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? "bg-slate-800 text-white"
                        : "text-gray-300 hover:bg-slate-700 hover:text-white",
                      "px-3 py-2 rounded-md text-sm font-medium"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      pathname.startsWith("/admin")
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-blue-600 hover:text-white",
                      "px-3 py-2 rounded-md text-sm font-medium"
                    )}
                  >
                    Админ-панель
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {session ? (
                <div className="relative ml-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      {session.user.name}
                    </span>
                    <Button
                      variant="outline"
                      className="border-gray-400 text-gray-300 hover:text-white"
                      onClick={handleSignOut}
                    >
                      Выйти
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-gray-400 text-gray-300 hover:text-white">
                      Вход
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button variant="primary">Регистрация</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Открыть меню</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                pathname === item.href
                  ? "bg-slate-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block px-3 py-2 rounded-md text-base font-medium"
              )}
              onClick={closeMenu}
            >
              {item.title}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                pathname.startsWith("/admin")
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:bg-blue-600 hover:text-white",
                "block px-3 py-2 rounded-md text-base font-medium"
              )}
              onClick={closeMenu}
            >
              Админ-панель
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {session ? (
            <div className="px-2 space-y-3">
              <div className="px-3 text-sm font-medium">{session.user.name}</div>
              <button
                onClick={() => {
                  closeMenu();
                  handleSignOut();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={closeMenu}
              >
                Вход
              </Link>
              <Link
                href="/auth/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={closeMenu}
              >
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}; 
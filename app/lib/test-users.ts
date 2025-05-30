/**
 * Тестовые пользователи для разработки
 * 
 * ВНИМАНИЕ: Это файл только для разработки!
 * В продакшене аутентификация должна использовать безопасные механизмы.
 */

export const TEST_USERS = [
  {
    id: "user-123",
    email: "user@example.com",
    password: "password123", // В реальном приложении пароли должны быть хешированы
    name: "Иван Петров",
    role: "CLIENT"
  },
  {
    id: "admin-456",
    email: "admin@example.com",
    password: "admin123",
    name: "Администратор Системы",
    role: "ADMIN"
  },
  {
    id: "user-789",
    email: "elena@example.com",
    password: "elena123",
    name: "Елена Смирнова",
    role: "CLIENT"
  }
];

/**
 * Простая функция для аутентификации тестового пользователя
 * Используется только в режиме разработки
 */
export const authenticateTestUser = (email: string, password: string) => {
  const user = TEST_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    return null;
  }
  
  // Возвращаем пользователя без пароля
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Получить всех тестовых пользователей (без паролей)
 */
export const getTestUsers = () => {
  return TEST_USERS.map(({ password: _, ...user }) => user);
}; 
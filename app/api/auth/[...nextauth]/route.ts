import NextAuth from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { authenticateTestUser } from '@/app/lib/test-users';
import CredentialsProvider from 'next-auth/providers/credentials';

// Если включен режим тестовых пользователей, заменяем стандартный CredentialsProvider
if (process.env.USE_TEST_USERS === 'true') {
  const testCredentialsProvider = CredentialsProvider({
    name: 'Тестовые учетные данные',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Пароль', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      return authenticateTestUser(credentials.email, credentials.password);
    }
  });

  // Заменяем первый провайдер (который должен быть CredentialsProvider) на тестовый
  if (authOptions.providers && authOptions.providers.length > 0) {
    authOptions.providers[0] = testCredentialsProvider;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
import { authOptions } from './auth';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

// Мокаем prisma и bcrypt
jest.mock('./prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('Auth Options', () => {
  describe('authorize function', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password',
      role: 'CLIENT',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('возвращает null если credentials отсутствуют', async () => {
      // @ts-ignore - для тестирования
      const result = await authOptions.providers[0].authorize({});
      expect(result).toBeNull();
    });

    it('возвращает null если пользователь не найден', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // @ts-ignore - для тестирования
      const result = await authOptions.providers[0].authorize({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });

    it('возвращает null если пароль неверный', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // @ts-ignore - для тестирования
      const result = await authOptions.providers[0].authorize({
        email: 'test@example.com',
        password: 'wrong_password',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
      expect(result).toBeNull();
    });

    it('возвращает пользователя если учетные данные верны', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // @ts-ignore - для тестирования
      const result = await authOptions.providers[0].authorize({
        email: 'test@example.com',
        password: 'correct_password',
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('correct_password', 'hashed_password');
      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
      });
    });
  });

  describe('callbacks', () => {
    it('добавляет id и role в JWT токен', async () => {
      const token = {};
      const user = { id: 'user-123', role: 'CLIENT' };

      const result = await authOptions.callbacks.jwt({ token, user, account: null, profile: undefined, trigger: 'signIn' });

      expect(result).toEqual({
        id: 'user-123',
        role: 'CLIENT',
      });
    });

    it('добавляет id и role в сессию', async () => {
      const session = { user: {} };
      const token = { id: 'user-123', role: 'CLIENT' };

      const result = await authOptions.callbacks.session({ session, token, user: undefined, newSession: null, trigger: 'update' });

      expect(result.user).toEqual({
        id: 'user-123',
        role: 'CLIENT',
      });
    });
  });
}); 
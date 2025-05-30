
// Мок для getServerSession
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({ status: init?.status ?? 200, json: async () => data }),
  },
  NextRequest: class {},
}));

// Мок для Prisma
jest.mock('@/app/lib/prisma', () => ({
  prisma: {
    calculatorHistory: {
      create: jest.fn(),
    },
  },
}));

describe('API маршрут для сохранения расчетов калькулятора', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('должен возвращать ошибку 401, если пользователь не авторизован', async () => {
    // Устанавливаем мок для getServerSession, который возвращает null
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue(null);
    
    // Динамически импортируем обработчик
    const { POST } = await import('./route');

    // Создаем запрос
    const request = {
      json: async () => ({
        amount: 100000,
        term: 12,
        interestRate: 10,
        monthlyPayment: 8792,
        totalPayment: 105504,
      }),
    } as any;
    
    // Вызываем обработчик запроса
    const response = await POST(request);
    
    // Проверяем, что возвращается статус 401
    expect(response.status).toBe(401);
    
    // Проверяем содержимое ответа
    const responseData = await response.json();
    expect(responseData).toEqual({ error: 'Необходима авторизация' });
  });
  
  it('должен возвращать ошибку 400 при невалидных данных', async () => {
    // Устанавливаем мок для getServerSession, который возвращает авторизованного пользователя
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user-id' },
    });
    
    // Динамически импортируем обработчик
    const { POST } = await import('./route');

    // Создаем запрос с невалидными данными (сумма меньше минимальной)
    const request = {
      json: async () => ({
        amount: 1000, // Меньше минимальной суммы 10000
        term: 12,
        interestRate: 10,
        monthlyPayment: 8792,
        totalPayment: 105504,
      }),
    } as any;
    
    // Вызываем обработчик запроса
    const response = await POST(request);
    
    // Проверяем, что возвращается статус 400
    expect(response.status).toBe(400);
    
    // Проверяем содержимое ответа
    const responseData = await response.json();
    expect(responseData).toEqual({ error: 'Ошибка валидации данных' });
  });
  
  it('должен успешно сохранять расчет при валидных данных', async () => {
    // Устанавливаем мок для getServerSession, который возвращает авторизованного пользователя
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { id: 'user-id' },
    });
    
    // Устанавливаем мок для создания записи в базе данных
    const { prisma } = require('@/app/lib/prisma');
    prisma.calculatorHistory.create.mockResolvedValue({
      id: 'calc-id',
      userId: 'user-id',
      amount: 100000,
      term: 12,
      interestRate: 10,
      monthlyPayment: 8792,
      totalPayment: 105504,
      createdAt: new Date(),
    });
    
    // Динамически импортируем обработчик
    const { POST } = await import('./route');

    // Создаем запрос с валидными данными
    const request = {
      json: async () => ({
        amount: 100000,
        term: 12,
        interestRate: 10,
        monthlyPayment: 8792,
        totalPayment: 105504,
      }),
    } as any;
    
    // Вызываем обработчик запроса
    const response = await POST(request);
    
    // Проверяем, что возвращается статус 200
    expect(response.status).toBe(200);
    
    // Проверяем содержимое ответа
    const responseData = await response.json();
    expect(responseData).toEqual({
      success: true,
      id: 'calc-id',
      message: 'Расчет успешно сохранен',
    });
    
    // Проверяем, что был вызван метод создания записи с правильными параметрами
    expect(prisma.calculatorHistory.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-id',
        amount: 100000,
        term: 12,
        interestRate: 10,
        monthlyPayment: 8792,
        totalPayment: 105504,
      },
    });
  });
}); 



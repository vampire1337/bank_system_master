import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginPage from './page';

// Мокаем next-auth/react
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Мокаем next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('отображает форму входа', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Вход в личный кабинет')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });

  it('отображает ошибку при неверных учетных данных', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      ok: false,
      error: 'Неверные учетные данные',
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByRole('button', { name: 'Войти' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Неверные учетные данные. Проверьте email и пароль.')).toBeInTheDocument();
    });
    
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('перенаправляет на главную страницу при успешном входе', async () => {
    (signIn as jest.Mock).mockResolvedValue({
      ok: true,
    });

    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByRole('button', { name: 'Войти' });
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
}); 
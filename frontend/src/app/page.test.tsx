import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { mockPush } from '@/test/mocks/next-navigation';
import { vi } from 'vitest';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  test('renders the login page with "Welcome back" heading', () => {
    render(<LoginPage />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  test('shows email and password errors when form is empty', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(submitButton);

    expect(screen.getByText('Введите корректный email-адрес, например name@domain.com')).toBeInTheDocument();
    expect(screen.getByText('Пароль не может быть пустым')).toBeInTheDocument();
  });

  test('successful login saves token and redirects to profile', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'A1b2c3d4!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBe('test-token');
    });

    expect(screen.getByText('Login successful! Redirecting...')).toBeInTheDocument();

    vi.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    vi.useRealTimers();
  });

  test('button shows "Signing in..." and is disabled during request', async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: Response) => void;

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockImplementationOnce(() => new Promise((resolve) => {
      resolveFetch = resolve;
    }));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'A1b2c3d4!');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Signing in...')).toBeInTheDocument();

    resolveFetch!({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    } as Response);
  });

  test('shows server error detail for 400 response', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Invalid credentials' }),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('shows generic error for 500 response', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'A1b2c3d4!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Произошла ошибка при входе')).toBeInTheDocument();
    });
  });

  test('shows connection error when fetch fails', async () => {
    const user = userEvent.setup();
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'A1b2c3d4!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Не удалось подключиться к серверу')).toBeInTheDocument();
    });
  });

  test('"Sign up" button navigates to register page', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const signUpButton = screen.getByRole('button', { name: 'Sign up' });
    await user.click(signUpButton);

    expect(mockPush).toHaveBeenCalledWith('/register');
  });
});

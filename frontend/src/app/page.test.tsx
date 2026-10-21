import { render, screen } from '@testing-library/react';
import LoginPage from './page';

test('LoginPage renders the login page with "Welcome back" heading', () => {
  render(<LoginPage />);
  expect(screen.getByText('Welcome back')).toBeInTheDocument();
});

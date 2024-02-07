import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { name: /Lista Zadań/i });
  expect(titleElement).toBeInTheDocument();
});

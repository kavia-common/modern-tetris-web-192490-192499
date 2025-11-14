import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Modern Tetris title and Controls', () => {
  render(<App />);
  expect(screen.getByText(/Modern Tetris/i)).toBeInTheDocument();
  expect(screen.getByText(/Controls/i)).toBeInTheDocument();
});

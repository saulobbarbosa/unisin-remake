import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza a pagina inicial', () => {
  render(<App />);
  expect(screen.getByText('Uma nova forma de aprender')).toBeInTheDocument();
});

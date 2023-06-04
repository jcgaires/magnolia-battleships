import { render, fireEvent } from '@testing-library/react';
import App from './App';

test('renders board correctly', () => {
  const { container } = render(<App />);
  expect(container.getElementsByClassName('board__cell').length).toBe(100);
  expect(container.getElementsByClassName('board__cell--hasShip').length).toBe(13);
  expect(container.getElementsByClassName('board__cell--shot').length).toBe(0);
});

test('shooting with a click works', () => {
  const { container } = render(<App />);
  const target = container.querySelector('.board__cell--hasShip');
  fireEvent.click(target);
  expect(container.getElementsByClassName('board__cell--shot').length).toBe(1);
});

test('shooting with the input works', () => {
  const { container } = render(<App />);
  const input = container.querySelector('.form__input');
  fireEvent.change(input, { target: { value: 'A1' } });
  const button = container.querySelector('.form__button');
  fireEvent.click(button);
  expect(container.getElementsByClassName('board__cell--shot').length).toBe(1);
});

test('shooting a ship works', () => {
  const { container } = render(<App />);
  const target = container.querySelector('.board__cell--hasShip');
  fireEvent.click(target);
  expect(container.getElementsByClassName('board__cell--shot').length).toBe(1);
  expect(container.getElementsByClassName('ship__cord--shot').length).toBe(1);
});

test('game over works', () => {
  const { container } = render(<App />);
  const ships = container.getElementsByClassName('board__cell--hasShip');

  for(let i = 0; i < ships.length; i++) {
    fireEvent.click(ships[i]);
  }

  expect(container.getElementsByClassName('app--game-over').length).toBe(1);
});

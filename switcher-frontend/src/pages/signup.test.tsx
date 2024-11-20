import {
  describe,
  it,
  expect,
  afterEach,
  vi,
  beforeEach,
  Mock,
  beforeAll,
  afterAll,
} from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Signup from './signup';
import { usePlayer } from '../hooks/usePlayer';
import { server } from '../mocks/node';
import { Navigate } from 'react-router-dom';
import { render } from '../services/testUtils';

vi.mock('../hooks/usePlayer');
vi.mock('react-router-dom');

describe('Signup', () => {
  const mockCreatePlayer = vi.fn();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (usePlayer as Mock).mockReturnValue({
      createPlayer: mockCreatePlayer,
      player: undefined,
    });
    (Navigate as Mock).mockReturnValue(<div>NavigateMock</div>);
  });

  afterEach(() => {
    cleanup();
  });

  it('Render the signup if the player is not loaded', () => {
    render(<Signup />);
    expect(screen.getByText('Selecciona tu apodo')).toBeInTheDocument();
  });

  it('Render the navigate component if the player is loaded', () => {
    (usePlayer as Mock).mockReturnValue({
      createPlayer: mockCreatePlayer,
      player: { playerID: 1, username: 'Username Test' },
    });
    render(<Signup />);
    expect(screen.getByText('NavigateMock')).toBeInTheDocument();
  });

  it('Se puede seleccionar un nombre de usuario y se llama a la función de creación', async () => {
    const user = userEvent.setup();
    const username = 'Usuario de test';

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username);
  });

  it('No se puede seleccionar un nombre con más de 32 caracteres y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();
    const username = 'a'.repeat(33);

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      screen.getByText('El nombre no puede tener más de 32 caracteres')
    ).toBeInTheDocument();
    expect(mockCreatePlayer).not.toHaveBeenCalled();
  });

  it('No se puede seleccionar un nombre con caracteres no ASCII y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), '😀');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      screen.getByText('El nombre solo puede contener caracteres ASCII')
    ).toBeInTheDocument();
    expect(mockCreatePlayer).not.toHaveBeenCalled();
  });

  it('Se puede seleccionar un nombre de usuario con 1 solo caracter', async () => {
    const user = userEvent.setup();
    const username = 'a';

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username);
  });

  it('Se puede seleccionar un nombre de usuario con 32 caracteres', async () => {
    const user = userEvent.setup();
    const username = 'a'.repeat(32);

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username);
  });

  it('Se puede seleccionar un nombre de usuario con muchos espacios al inicio/final y se remueven', async () => {
    const user = userEvent.setup();
    const username = '                  Usuario de test              ';

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(mockCreatePlayer).toHaveBeenCalledWith(username.trim());
  });

  it('No se puede seleccionar un nombre de usuario con solo espacios y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();
    const username = '                  ';

    render(<Signup />);

    await user.type(screen.getByRole('textbox'), username);
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      screen.getByText('El nombre no puede estar vacío')
    ).toBeInTheDocument();
    expect(mockCreatePlayer).not.toHaveBeenCalled();
  });
});

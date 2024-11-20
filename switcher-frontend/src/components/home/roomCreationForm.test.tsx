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
import RoomCreationForm from './roomCreationForm';
import { useRoom } from '../../hooks/useRoom';
import { server } from '../../mocks/node';
import { render } from '../../services/testUtils';

vi.mock('../../hooks/useRoom');

describe('RoomCreationForm', () => {
  const mockCreateRoom = vi.fn();

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    (useRoom as Mock).mockReturnValue({
      createRoom: mockCreateRoom,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('El modal es visible al abrirse', () => {
    render(<RoomCreationForm isOpen={true} onClose={() => null} />);
    expect(screen.getByText('Crear partida')).toBeInTheDocument();
  });

  it('El modal no es visible al cerrarse', () => {
    render(<RoomCreationForm isOpen={false} onClose={() => null} />);
    expect(screen.queryByText('Crear partida')).not.toBeInTheDocument();
  });

  it('El modal se cierra al hacer click en el botón de cerrar', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<RoomCreationForm isOpen={true} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('Se puede crear una sala y se llama a la función de creación', async () => {
    const user = userEvent.setup();
    const roomName = 'Sala de test';
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);
    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(mockCreateRoom).toHaveBeenCalledWith(
      roomName,
      maxPlayers,
      minPlayers,
      undefined
    );
  });

  it('No se puede crear una sala con un nombre con más de 32 caracteres y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();
    const roomName = 'a'.repeat(33);
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(
      screen.getByText('El nombre no puede tener más de 32 caracteres')
    ).toBeInTheDocument();
    expect(mockCreateRoom).not.toHaveBeenCalled();
  });

  it('No se puede crear una sala con un nombre con caracteres no ASCII y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      '😀'
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(
      screen.getByText('El nombre solo puede contener caracteres ASCII')
    ).toBeInTheDocument();
    expect(mockCreateRoom).not.toHaveBeenCalled();
  });

  it('No se puede crear una sala con un número de jugadores mínimos mayor que el de jugadores máximos y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();
    const roomName = 'Sala de test';
    const minPlayers = 4;
    const maxPlayers = 2;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(
      screen.getByText(
        'El mínimo de jugadores debe ser menor o igual al máximo'
      )
    ).toBeInTheDocument();
    expect(mockCreateRoom).not.toHaveBeenCalled();
  });

  it('Se puede seleccionar un nombre de sala con 1 solo caracter', async () => {
    const user = userEvent.setup();
    const roomName = 'a';
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(mockCreateRoom).toHaveBeenCalledWith(
      roomName,
      maxPlayers,
      minPlayers,
      undefined
    );
  });

  it('Se puede seleccionar un nombre de sala con 32 caracteres', async () => {
    const user = userEvent.setup();
    const roomName = 'a'.repeat(32);
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(mockCreateRoom).toHaveBeenCalledWith(
      roomName,
      maxPlayers,
      minPlayers,
      undefined
    );
  });

  it('Se puede seleccionar un número de jugadores mínimo igual al máximo', async () => {
    const user = userEvent.setup();
    const roomName = 'Sala de test';
    const minPlayers = 4;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(mockCreateRoom).toHaveBeenCalledWith(
      roomName,
      maxPlayers,
      minPlayers,
      undefined
    );
  });

  it('Se puede seleccionar un nombre con muchos espacios al inicio/final y se remueven', async () => {
    const user = userEvent.setup();
    const roomName = '                  Sala de test              ';
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(mockCreateRoom).toHaveBeenCalledWith(
      roomName.trim(),
      maxPlayers,
      minPlayers,
      undefined
    );
  });

  it('No se puede crear una sala con un nombre de solo espacios y se muestra un mensaje de error', async () => {
    const user = userEvent.setup();
    const roomName = '                  ';
    const minPlayers = 2;
    const maxPlayers = 4;

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(
      screen.getByText('El nombre no puede estar vacío')
    ).toBeInTheDocument();
    expect(mockCreateRoom).not.toHaveBeenCalled();
  });

  it('Se puede crear una sala con una contraseña', async () => {
    const user = userEvent.setup();
    const roomName = 'Sala de test';
    const minPlayers = 2;
    const maxPlayers = 4;
    const password = '1234';

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.type(
      screen.getByRole('textbox', { name: 'Nombre de la partida' }),
      roomName
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores mínimos' }),
      minPlayers.toString()
    );
    await user.type(
      screen.getByRole('spinbutton', { name: 'Jugadores máximos' }),
      maxPlayers.toString()
    );
    await user.type(screen.getByLabelText('Contraseña'), password);
    await user.click(screen.getByRole('button', { name: 'Crear' }));

    expect(mockCreateRoom).toHaveBeenCalledWith(
      roomName,
      maxPlayers,
      minPlayers,
      password
    );
  });

  it('Se puede mostrar y ocultar la contraseña', async () => {
    const user = userEvent.setup();

    render(<RoomCreationForm isOpen={true} onClose={() => null} />);

    await user.click(screen.getByRole('button', { name: 'Mostrar' }));
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Ocultar' }));
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute(
      'type',
      'password'
    );
  });
});

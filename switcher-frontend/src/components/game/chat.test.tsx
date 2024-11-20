import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Chat from './chat';
import { ChatMessage } from '../../types/gameTypes';
import { render } from '../../services/testUtils';

describe('Chat Component', () => {
  const mockSendMessage = vi.fn();
  const username = 'testUser';
  const chatMessages: ChatMessage[] = [
    { username: 'user1', text: 'Hello' },
    { username: 'user2', text: 'Hi there' },
  ];

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders chat messages', () => {
    render(
      <Chat
        sendMessage={mockSendMessage}
        username={username}
        chatMessages={chatMessages}
      />
    );

    chatMessages.forEach((msg) => {
      expect(screen.getByText(msg.text)).toBeInTheDocument();
      expect(screen.getByText(msg.username)).toBeInTheDocument();
    });
  });

  it('sends message on button click', async () => {
    render(
      <Chat
        sendMessage={mockSendMessage}
        username={username}
        chatMessages={chatMessages}
      />
    );
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Escribe tu mensaje');
    await user.type(input, 'New message');
    await user.click(screen.getByLabelText('Enviar mensaje'));

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'msg',
      payload: {
        username: username,
        text: 'New message',
      },
    });
    expect(input).toHaveValue('');
  });

  it('sends message on Enter key press', async () => {
    render(
      <Chat
        sendMessage={mockSendMessage}
        username={username}
        chatMessages={chatMessages}
      />
    );

    const input = screen.getByPlaceholderText('Escribe tu mensaje');
    const user = userEvent.setup();
    await user.type(input, 'Another message{enter}');

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'msg',
      payload: {
        username: username,
        text: 'Another message',
      },
    });
    expect(input).toHaveValue('');
  });

  it('does not send empty message', async () => {
    render(
      <Chat
        sendMessage={mockSendMessage}
        username={username}
        chatMessages={chatMessages}
      />
    );

    const input = screen.getByPlaceholderText('Escribe tu mensaje');
    const user = userEvent.setup();
    await user.type(input, '{enter}');

    expect(mockSendMessage).not.toHaveBeenCalled();

    await user.click(screen.getByLabelText('Enviar mensaje'));

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});

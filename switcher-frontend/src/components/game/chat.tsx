import {
  Box,
  Heading,
  HStack,
  IconButton,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import { GameMessage, ChatMessage } from '../../types/gameTypes';
import { useState, useEffect, useRef } from 'react';

interface ChatProps {
  sendMessage: (message: GameMessage) => void;
  username: string;
  chatMessages: ChatMessage[];
}

interface MessageProps {
  text: string;
  username: string;
}
const Message = ({ text, username }: MessageProps) => {
  return (
    <Box
      border="1px"
      borderColor="gray.600"
      borderRadius={20}
      padding={4}
      w="100%"
    >
      <Heading as="h6" size="sm">
        {username}
      </Heading>
      <Text>{text}</Text>
    </Box>
  );
};

export default function Chat(props: ChatProps) {
  const { sendMessage, username, chatMessages } = props;
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message === '') return;
    sendMessage({
      type: 'msg',
      payload: {
        username: username,
        text: message,
      },
    });
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <VStack
      border="2px"
      borderColor="gray.600"
      borderRadius={20}
      aria-label="game-board"
      w="100%"
      maxW="25vw"
      h="100%"
    >
      <VStack
        h="95%"
        w="100%"
        overflowY="auto"
        justifyContent="flex-start"
        p={1}
      >
        {chatMessages.map((msg, index) => (
          <Message key={index} text={msg.text} username={msg.username} />
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      <Box border="2px" borderColor="gray.600" w="100%" />
      <HStack w="100%" justifyContent="space-between" px={2} mb={2}>
        <Input
          placeholder="Escribe tu mensaje"
          variant="unstyled"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <IconButton
          aria-label="Enviar mensaje"
          icon={<MdSend />}
          variant={'ghost'}
          onClick={handleSendMessage}
        />
      </HStack>
    </VStack>
  );
}

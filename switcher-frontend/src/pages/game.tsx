import { useParams } from 'react-router-dom';
import { VStack, HStack, Button, Center } from '@chakra-ui/react';
import Board from '../components/game/board';
import PlayerInfo from '../components/game/playerInfo';
import MoveDeck from '../components/game/moveDeck';
import FigureDeck from '../components/game/figureDeck';
import CountdownComponent from '../components/game/countdown';
import { SlArrowDown } from 'react-icons/sl';
import { useGame } from '../hooks/useGame';
import { useGameWebSocket } from '../hooks/useGameWebSocket';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import { ImExit } from 'react-icons/im';
import Chat from '../components/game/chat';
import { ArrowRightIcon } from '@chakra-ui/icons';
import ProhibitedColor from '../components/game/prohibitedColor';

export default function Game() {
  const { ID } = useParams();
  const {
    currentPlayer,
    otherPlayersInPos,
    prohibitedColor,
    turnTimestamp,
    endTurn,
    cancelMove,
    leaveGame,
    posEnabledToPlay,
    chatMessages,
  } = useGame();

  const sendMessage = useGameWebSocket(parseInt(ID ?? ''));

  return (
    <Center>
      <HStack
        alignItems="flex-end"
        h="100vh"
        w="100%"
        py={4}
        px={2}
        justifyContent="space-between"
        spacing={2}
      >
        <Chat
          sendMessage={sendMessage}
          username={currentPlayer?.username ?? ''}
          chatMessages={chatMessages}
        />
        <VStack justifyContent="space-between" h="100%">
          <PlayerInfo player={otherPlayersInPos.top} pos="up" />
          <HStack spacing={4}>
            <PlayerInfo player={otherPlayersInPos.left} pos="left" />
            <Board />
            <PlayerInfo player={otherPlayersInPos.right} pos="right" />
          </HStack>
          {posEnabledToPlay === currentPlayer?.position && (
            <SlArrowDown
              size="4vh"
              color="white"
              aria-label="Bottom player turn"
            />
          )}
          <HStack spacing={4}>
            <MoveDeck
              cards={currentPlayer?.cardsMovement ?? []}
              vertical={false}
              own={true}
            />
            <FigureDeck
              figures={currentPlayer?.cardsFigure ?? []}
              vertical={false}
              amount={currentPlayer?.sizeDeckFigure ?? 0}
            />
          </HStack>
        </VStack>
        <VStack spacing={4}>
          <CountdownComponent remainingSeconds={turnTimestamp} />
          <ProhibitedColor color={prohibitedColor} />
          <Button
            rightIcon={<FaArrowRotateLeft />}
            isDisabled={
              !currentPlayer?.cardsMovement
                .map((card) => card?.isUsed)
                .includes(true) || posEnabledToPlay !== currentPlayer.position
            }
            colorScheme="gray"
            variant="outline"
            onClick={cancelMove}
            w="100%"
          >
            Cancelar movimiento
          </Button>
          <Button
            rightIcon={<ArrowRightIcon />}
            colorScheme="teal"
            isDisabled={posEnabledToPlay !== currentPlayer?.position}
            onClick={endTurn}
            variant="outline"
            w="100%"
          >
            Pasar turno
          </Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              if (
                window.confirm(
                  '¿Estás seguro de que quieres abandonar la partida?'
                )
              ) {
                await leaveGame();
              }
            }}
            variant="outline"
            rightIcon={<ImExit />}
            w="100%"
          >
            Abandonar partida
          </Button>
        </VStack>
      </HStack>
    </Center>
  );
}

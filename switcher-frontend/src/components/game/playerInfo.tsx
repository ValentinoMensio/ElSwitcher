import { PlayerInGame } from '../../types/gameTypes';
import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import FigureDeck from './figureDeck';
import { SlArrowUp, SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { useGame } from '../../hooks/useGame';
import shrek from '/avatars/shrek.png';
import burro from '/avatars/burro.png';
import cat from '/avatars/cat.png';
import human from '/avatars/human.png';
import genji from '/avatars/genji.png';
import farquaad from '/avatars/farquaad.png';
import principe from '/avatars/principe.png';
import fiona from '/avatars/fiona.png';
import MoveDeck from './moveDeck';

const getAvatar = (playerID: number, position: number) => {
  switch (position) {
    case 1:
      return playerID % 2 === 0 ? shrek : human;
    case 2:
      return playerID % 2 === 0 ? cat : burro;
    case 3:
      return playerID % 2 === 0 ? genji : fiona;
    case 4:
      return playerID % 2 === 0 ? principe : farquaad;
    default:
      return shrek;
  }
};

interface PlayerInfoProps {
  player: PlayerInGame | undefined;
  pos: 'up' | 'left' | 'right' | 'down';
}

export default function PlayerInfo(props: PlayerInfoProps) {
  const { player, pos } = props;
  const { posEnabledToPlay } = useGame();
  if (!player) return null;

  return (
    <>
      {pos === 'left' || pos === 'right' ? (
        <HStack spacing={2}>
          {pos === 'right' && posEnabledToPlay === player.position && (
            <SlArrowRight size="4vh" color="white" aria-label="ArrowLeft" />
          )}
          <VStack spacing={4}>
            <VStack spacing={0}>
              <Avatar
                size="lg"
                name={player.username}
                src={getAvatar(player.playerID, player.position)}
                filter={player.isActive ? '' : 'grayscale(100%)'}
              />
              <Text as="b">
                {player.isActive ? player.username : 'Desconectado'}
              </Text>
            </VStack>
            <HStack spacing={2}>
              {pos === 'left' && (
                <MoveDeck
                  cards={player.cardsMovement}
                  vertical={true}
                  own={false}
                />
              )}
              <FigureDeck
                figures={player.cardsFigure}
                vertical={true}
                chiquito={true}
                amount={player.sizeDeckFigure}
              />
              {pos === 'right' && (
                <MoveDeck
                  cards={player.cardsMovement}
                  vertical={true}
                  own={false}
                />
              )}
            </HStack>
          </VStack>
          {pos === 'left' && posEnabledToPlay === player.position && (
            <SlArrowLeft size="4vh" color="white" aria-label="ArrowRight" />
          )}
        </HStack>
      ) : (
        <>
          {posEnabledToPlay === player.position && pos === 'down' && (
            <SlArrowUp size="4vh" color="white" aria-label="ArrowDown" />
          )}
          <HStack spacing={4}>
            <VStack spacing={0}>
              <Avatar
                size="lg"
                name={player.username}
                src={getAvatar(player.playerID, player.position)}
                filter={player.isActive ? '' : 'grayscale(100%)'}
              />
              <Text as="b">
                {player.isActive ? player.username : 'Desconectado'}
              </Text>
            </VStack>
            <MoveDeck
              cards={player.cardsMovement}
              vertical={false}
              own={false}
            />
            <FigureDeck
              figures={player.cardsFigure}
              vertical={false}
              chiquito={true}
              amount={player.sizeDeckFigure}
            />
          </HStack>
          {posEnabledToPlay === player.position && pos === 'up' && (
            <SlArrowUp size="4vh" color="white" aria-label="ArrowDown" />
          )}
        </>
      )}
    </>
  );
}

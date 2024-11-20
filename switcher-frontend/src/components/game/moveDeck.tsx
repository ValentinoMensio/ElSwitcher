import { Box, HStack, Button, VStack } from '@chakra-ui/react';
import L1 from '/movementCards/L1.png';
import L2 from '/movementCards/L2.png';
import Lineal1 from '/movementCards/Lineal1.png';
import Lineal2 from '/movementCards/Lineal2.png';
import Diagonal1 from '/movementCards/Diagonal1.png';
import Diagonal2 from '/movementCards/Diagonal2.png';
import LineaLateral from '/movementCards/LineaLateral.png';
import movreverse from '/movementCards/movreverse.png';
import { Movement } from '../../types/gameTypes';
import { MovementCard } from '../../types/gameTypes';
import { useGame } from '../../hooks/useGame';

function getImgMoveCard(cardData: MovementCard | null) {
  let img;

  if (!cardData) {
    img = movreverse;
    return img;
  }

  switch (cardData.type) {
    case Movement.mov1:
      img = Diagonal2;
      break;
    case Movement.mov2:
      img = Lineal2;
      break;
    case Movement.mov3:
      img = Lineal1;
      break;
    case Movement.mov4:
      img = Diagonal1;
      break;
    case Movement.mov5:
      img = L2;
      break;
    case Movement.mov6:
      img = L1;
      break;
    case Movement.mov7:
      img = LineaLateral;
      break;
  }

  return img;
}

interface MoveDeckProps {
  cards: (MovementCard | null)[];
  vertical: boolean;
  own: boolean;
}

export default function MoveDeck(props: MoveDeckProps) {
  const { cards, vertical, own } = props;
  const { handleClickCard, selectedCard } = useGame();
  const RenderMovementCard = ({
    card,
    isSelected,
  }: {
    card: MovementCard | null;
    isSelected: boolean;
  }) =>
    own ? (
      <Button
        onClick={() => {
          if (card) handleClickCard(card);
        }}
        backgroundImage={getImgMoveCard(card)}
        backgroundSize="cover"
        variant="unstyled"
        width="8.9vh"
        height="12vh"
        _hover={{
          transform: !card?.isUsed ? 'scale(1.1)' : 'scale(0.9)',
        }}
        transform={
          card?.isUsed ? 'scale(0.9)' : isSelected ? 'scale(1.1)' : 'scale(1)'
        }
        filter={
          card?.isUsed
            ? 'grayscale(50%) brightness(0.5)'
            : selectedCard && !isSelected
              ? 'brightness(0.5)'
              : ''
        }
        disabled={card?.isUsed}
      />
    ) : (
      <Button
        backgroundImage={getImgMoveCard(card)}
        backgroundSize="cover"
        variant="unstyled"
        width="7.4vh"
        height="10vh"
        _hover={{
          transform: !card?.isUsed ? 'scale(1.0)' : 'scale(0.9)',
        }}
        transform={
          card?.isUsed ? 'scale(0.9)' : isSelected ? 'scale(1.1)' : 'scale(1)'
        }
        filter={
          card?.isUsed
            ? 'grayscale(50%)'
            : selectedCard && !isSelected
              ? ''
              : ''
        }
        disabled={card?.isUsed}
      />
    );
  return (
    <>
      <Box height="auto" width="auto" justifyContent="center" padding="10px">
        {vertical ? (
          <VStack spacing={4}>
            {cards.map((card, index) => {
              const isSelected =
                selectedCard &&
                selectedCard.cardID === card?.cardID &&
                selectedCard.type === card.type;
              return (
                <RenderMovementCard
                  key={index}
                  card={card}
                  isSelected={isSelected ?? false}
                />
              );
            })}
          </VStack>
        ) : (
          <HStack spacing={4}>
            {cards.map((card, index) => {
              const isSelected =
                selectedCard &&
                selectedCard.cardID === card?.cardID &&
                selectedCard.type === card.type;
              return (
                <RenderMovementCard
                  key={index}
                  card={card}
                  isSelected={isSelected ?? false}
                />
              );
            })}
          </HStack>
        )}
      </Box>
    </>
  );
}

import { Box, Button, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Color, isFigureCard, isMovementCard } from '../../types/gameTypes';
import { ExtendedTile } from '../../types/gameTypes';
import { useGameTile } from '../../hooks/useGameTile';
import { useGame } from '../../hooks/useGame';

const breathingKeyframes = keyframes`
  0% { box-shadow: none; }
  20% { box-shadow: 0 0 4px 1px currentColor; }
  40% { box-shadow: 0 0 8px 2px currentColor; }
  60% { box-shadow: 0 0 8px 2px currentColor; }
  80% { box-shadow: 0 0 4px 1px currentColor; }
  100% { box-shadow: none; }
`;

const colorScheme = (color: Color | undefined) => {
  switch (color) {
    case Color.Y:
      return 'yellow';
    case Color.R:
      return 'red';
    case Color.B:
      return 'blue';
    case Color.G:
      return 'green';
    default:
      return 'gray';
  }
};

interface BoardTileProps {
  tile: ExtendedTile;
}

export default function BoardTile({ tile }: BoardTileProps) {
  const { posX, posY, color, isHighlighted, isPartial } = tile;
  const {
    markTopBorder,
    markRightBorder,
    markBottomBorder,
    markLeftBorder,
    markBackground,
  } = tile;
  const { handleClickTile, selectedTile } = useGameTile();
  const { selectedCard } = useGame();
  const isSelected =
    selectedTile && selectedTile.posX === posX && selectedTile.posY === posY;

  const isNotImportant =
    selectedTile &&
    !isHighlighted &&
    !isSelected &&
    selectedCard &&
    isMovementCard(selectedCard);

  const isNotImportant2 =
    selectedCard && isFigureCard(selectedCard) && !markBackground;

  return (
    <>
      <Box
        height="100%"
        width="100%"
        position="relative"
        color={colorScheme(color) + '.200'}
        borderRadius="22%"
        _before={{
          content: '""',
          position: 'absolute',
          height: '100%',
          width: '100%',
          p: '4px',
          transform: 'translate(-5px, -5px)',
          borderTop: markTopBorder
            ? '1px solid currentColor'
            : '1px solid transparent',
          borderRight: markRightBorder
            ? '1px solid currentColor'
            : '1px solid transparent',
          borderBottom: markBottomBorder
            ? '1px solid currentColor'
            : '1px solid transparent',
          borderLeft: markLeftBorder
            ? '1px solid currentColor'
            : '1px solid transparent',
          borderTopLeftRadius: markLeftBorder && markTopBorder ? '20px' : '0',
          borderTopRightRadius: markRightBorder && markTopBorder ? '20px' : '0',
          borderBottomRightRadius:
            markRightBorder && markBottomBorder ? '20px' : '0',
          borderBottomLeftRadius:
            markLeftBorder && markBottomBorder ? '20px' : '0',
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          height: '100%',
          width: '100%',
          p: '4px',
          bg:
            markBackground &&
            'color-mix(in srgb, currentColor 10%, transparent)',
          borderTopLeftRadius: markLeftBorder && markTopBorder ? '20px' : '0',
          borderTopRightRadius: markRightBorder && markTopBorder ? '20px' : '0',
          borderBottomRightRadius:
            markRightBorder && markBottomBorder ? '20px' : '0',
          borderBottomLeftRadius:
            markLeftBorder && markBottomBorder ? '20px' : '0',
          pointerEvents: 'none',
        }}
      >
        <Button
          onClick={() => handleClickTile(posX, posY)}
          backgroundSize="cover"
          colorScheme={colorScheme(color)}
          variant="outline"
          width="100%"
          height="100%"
          borderRadius="22%"
          bg="color-mix(in srgb, currentColor 5%, transparent)"
          // Modo claro
          //border = "3px solid currentColor"
          _after={{
            content: '""',
            position: 'absolute',
            top: '5px',
            right: '5px',
            borderTop: '1px solid currentColor',
            borderRight: '1px solid currentColor',
            borderRadius: '0 60% 0 0',
            height: '25%',
            width: '25%',
          }}
          _hover={{
            transform: 'scale(1.1)',
          }}
          isActive={isSelected}
          transform={isSelected ? 'scale(1.1)' : 'scale(1)'}
          filter={isNotImportant ? 'brightness(0.5)' : ''}
          animation={
            isHighlighted ? `${breathingKeyframes} 1s ease-in-out infinite` : ''
          }
          disabled={isNotImportant2}
        >
          <Text fontSize="2xl" fontWeight="bold">
            {isPartial ? 'P' : '\u00A0'}
          </Text>
        </Button>
      </Box>
    </>
  );
}

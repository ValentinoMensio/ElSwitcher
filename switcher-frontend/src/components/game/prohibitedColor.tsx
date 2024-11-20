import { Box } from '@chakra-ui/react';
import { Color } from '../../types/gameTypes';

const colorScheme = (color: Color | undefined) => {
  switch (color) {
    case Color.Y:
      return 'yellow.300';
    case Color.R:
      return 'red.300';
    case Color.B:
      return 'blue.300';
    case Color.G:
      return 'green.300';
    default:
      return 'gray';
  }
};

interface BannedColorProps {
  color: Color | undefined;
}

export default function ProhibitedColor(props: BannedColorProps) {
  const { color } = props;

  return (
    <Box
      w="50px"
      h="50px"
      borderRadius="xl"
      outline="2px solid #5e666a"
      bg={colorScheme(color)}
      aria-label={
        color === Color.Y
          ? 'Yellow'
          : color === Color.R
            ? 'Red'
            : color === Color.B
              ? 'Blue'
              : color === Color.G
                ? 'Green'
                : 'Gray'
      }
      position="relative"
      overflow="hidden"
      _after={{
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '140%',
        height: '2px',
        backgroundColor: 'red',
        transform: 'rotate(45deg)',
        transformOrigin: 'left',
      }}
    />
  );
}

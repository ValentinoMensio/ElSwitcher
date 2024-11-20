import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface CountdownProps {
  remainingSeconds: number; // Cantidad de segundos restantes al comienzo del turno
}

export default function CountdownComponent({
  remainingSeconds,
}: CountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(remainingSeconds));

  useEffect(() => {
    setSecondsLeft(Math.floor(remainingSeconds));

    // Inicia un temporizador local que descuenta cada segundo
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [remainingSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <Box fontSize="2xl" fontWeight="bold">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </Box>
  );
}

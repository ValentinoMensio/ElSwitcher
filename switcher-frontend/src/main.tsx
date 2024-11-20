import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './appRoutes';

async function enableMocking() {
  if (import.meta.env.VITE_MOCK !== 'true') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

enableMocking()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    );
  })
  .catch((error: unknown) => {
    console.error('Error during initialization:', error);
  });

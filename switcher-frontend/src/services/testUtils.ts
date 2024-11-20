import { ChakraProvider } from '@chakra-ui/react';
import { render as renderTest } from '@testing-library/react';
import { ReactElement } from 'react';

export const render = (component: ReactElement) =>
  renderTest(component, { wrapper: ChakraProvider });

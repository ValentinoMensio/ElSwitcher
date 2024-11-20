/* eslint-disable @typescript-eslint/no-unused-vars */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useColorMode, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import Home from './pages/home';
import Room from './pages/room';
import Game from './pages/game';
import Signup from './pages/signup';
import RequirePlayer from './components/requirePlayer';

const protectedRoutes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/room/:ID',
    element: <Room />,
  },
  {
    path: '/game/:ID',
    element: <Game />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequirePlayer />,
    children: protectedRoutes,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

export default function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      {/* <IconButton
        onClick={toggleColorMode}
        aria-label="Toggle Color Mode"
        icon={colorMode === "light" ? <MoonIcon aria-label="Dark Mode" /> : <SunIcon aria-label="Light Mode" />}
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      /> */}
      <RouterProvider router={router} />
    </>
  );
}

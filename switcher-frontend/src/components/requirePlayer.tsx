import { Navigate, Outlet } from "react-router-dom";
import { usePlayer } from "../hooks/usePlayer";

export default function RequirePlayer() {
  const { player } = usePlayer();

  return player ? <Outlet /> : <Navigate to="/signup" />;
}

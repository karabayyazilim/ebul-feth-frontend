import { ReactNode, useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Matching from "@/sections/game/matching";
import FinishGame from "@/sections/game/finish-game";
import Game from "@/sections/game/game";
import { gameSocket } from "@/api/socket/game";
import { useAuthContext } from "@/auth/AuthContext";

GamePage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

enum Events {
  start = "start",
  match = "match",
  finish = "finish",
  connect = "connect",
  disconnect = "disconnect",
}

export default function GamePage() {
  const { user } = useAuthContext();

  const [rival, setRival] = useState<IUser>();

  const [pending, setPending] = useState(true);

  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = gameSocket();

    socket.on(Events.connect, () => {
      socket.emit(Events.match, { id: user!.id });
    });

    socket.on(Events.start, (rival) => {
      setPending(false);
      setGameOver(false);
      setRival(rival);
    });

    socket.on(Events.finish, () => {
      setPending(false);
      setGameOver(true);
    });

    socket.on(Events.disconnect, () => {
      setPending(false);
      setGameOver(true);
    });
  }, [user]);

  if (pending) {
    return <Matching />;
  }

  if (gameOver) {
    return <FinishGame score={123} />;
  }

  if (rival) {
    return <Game rival={rival} />;
  }
}

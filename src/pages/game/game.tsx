import {ReactNode, useEffect, useRef, useState} from "react";
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
  connect = "connect",
  disconnect = "disconnect",
  start = "client:start",
  finish = "client:finish",
  match = "server:match",
}

export default function GamePage() {
  const { user } = useAuthContext();

  const [rival, setRival] = useState<IUser>();

  const [pending, setPending] = useState(true);

  const [gameOver, setGameOver] = useState(false);

  let socket: any = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    socket.current = gameSocket();

    //Debug
    socket.current.on(Events.connect, () => {
      console.log("connect");
    });

    socket.current.emit(Events.match, { id: user!.id });

    socket.current.on(Events.start, (rival: any) => {
      setPending(false);
      setGameOver(false);
      setRival(rival);
    });


    socket.current.on(Events.finish, () => {
      setPending(false);
      setGameOver(true);
    });

    socket.current.on(Events.disconnect, () => {
      setPending(false);
      setGameOver(true);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  if (pending) {
    return <Matching />;
  }

  if (gameOver) {
    return <FinishGame score={123} />;
  }

  if (rival) {
    return <Game rival={rival} socket={socket.current} />;
  }
}

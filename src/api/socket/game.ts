import { io } from "socket.io-client";

export function gameSocket() {
  return io("http://localhost:9000/game");
}

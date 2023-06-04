import { io } from "socket.io-client";

export function connectSocket(url: string) {
  return io(url);
}

import styles from "./game.module.css";
import { useEffect, useRef, useState } from "react";
import { gameSocket } from "@/api/socket/game";
import { useAuthContext } from "@/auth/AuthContext";

interface Vector2d {
  X: number;
  Y: number;
}

interface Player {
  width: number;
  speed: number;
  score: number;
  color: string;
  height: number;
  target: number;
  position: Vector2d;
}

interface Guest {
  width: number;
  color: string;
  height: number;
  position: Vector2d;
}

interface Ball {
  radius: number;
  speed: Vector2d;
  position: Vector2d;
}

interface IGameProps {
  rival: IUser;
}

export default function Game({ rival }: IGameProps) {
  const { user } = useAuthContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeInfo, setTimeInfo] = useState("");

  useEffect(() => {
    let canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const socket = gameSocket();

    const PLAYER_MARGINY = 5;
    const PLAYER_MARGINX = 10;
    const PLAYER_MOVE_SPEED = 5;
    const PLAYER_WIDTH_SCALE = 0.01;
    const PLAYER_HEIGTH_SCALE = 0.25;
    const keyPressed: { [x: string]: boolean } = {};

    let timer: NodeJS.Timer;
    let gameTime: number = Date.now() / 1000;
    let guestPos: "up" | "down" | number | null = null;

    const ball: Ball = {
      position: {
        X: canvas.width / 2,
        Y: canvas.height / 2,
      },
      speed: {
        X: canvas.width * 0.008,
        Y: canvas.height * 0.008,
      },
      radius: canvas.width * 0.01,
    };

    const player: Player = {
      width: canvas.width * PLAYER_WIDTH_SCALE,
      height: canvas.height * PLAYER_HEIGTH_SCALE,
      position: {
        X: PLAYER_MARGINX,
        Y: canvas.height / 2 - (canvas.height * PLAYER_HEIGTH_SCALE) / 2,
      },
      target: canvas.height / 2 - (canvas.height * PLAYER_HEIGTH_SCALE) / 2,
      speed: PLAYER_MOVE_SPEED * (canvas.height * 0.0025),
      color: "blue",
      score: 0,
    };

    const guest: Guest = {
      color: "red",
      height: canvas.height * PLAYER_HEIGTH_SCALE,
      position: {
        X: canvas.width - canvas.width * PLAYER_WIDTH_SCALE - PLAYER_MARGINX,
        Y: player.position.Y,
      },
      width: canvas.width * PLAYER_WIDTH_SCALE,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!keyPressed[e.key]) {
        if (e.key === "w") {
          socket.emit("movePlayer", "up");
        } else if (e.key === "s") {
          socket.emit("movePlayer", "down");
        }
      }
      keyPressed[e.key] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "s") {
        player.speed = PLAYER_MOVE_SPEED * (canvas.height * 0.0025);
        player.target = player.position.Y;
        socket.emit("movePlayer", player.position.Y);
      }
      delete keyPressed[e.key];
    };

    const onResize = (event: Event) => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    const calculatePlayerA = async () => {
      setTimeout(() => {
        if (keyPressed["s"]) {
          player.speed += 0.1;
          player.target += player.position.Y + player.speed;
        } else if (keyPressed["w"]) {
          player.speed += 0.1;
          player.target -= player.position.Y + player.speed;
        }
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBall();
      moveBall();

      calculatePlayerA();

      movePlayer(player);
      drawPlayer(player);

      moveGuest(guest);
      drawPlayer(guest);

      requestAnimationFrame(gameLoop);
    };

    const moveGuest = (guest: Guest) => {
      const speed = player.speed;
      if (guestPos === "up") {
        guest.position.Y -= player.speed;
      } else if (guestPos === "down") {
        guest.position.Y += player.speed;
      } else if (typeof guestPos === "number") {
        guest.position.Y = guestPos;
      }
    };

    const movePlayer = (player: Player) => {
      const speed = player.speed;
      if (player.position.Y < player.target) {
        if (
          player.position.Y + player.height + speed <
          canvas.height - PLAYER_MARGINY
        )
          player.position.Y += speed;
        else if (
          player.position.Y + player.height <
          canvas.height - PLAYER_MARGINY
        )
          player.position.Y += 1;
      } else if (player.position.Y > player.target) {
        if (player.position.Y - speed > PLAYER_MARGINY)
          player.position.Y -= speed;
        else if (player.position.Y > PLAYER_MARGINY) player.position.Y -= 1;
      }
    };

    const drawPlayer = (player: Player | Guest) => {
      ctx.fillStyle = player.color;
      ctx.fillRect(
        player.position.X,
        player.position.Y,
        player.width,
        player.height
      );
    };

    socket.on("movePlayer", (data: "up" | "down" | number | null) => {
      guestPos = data;
      console.log(data);
    });

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.position.X, ball.position.Y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00BFFF";
      ctx.fill();
      ctx.closePath();
    };

    const moveBall = () => {
      const ballRadius = ball.radius / 2;
      ball.position.X += ball.speed.X;
      ball.position.Y += ball.speed.Y;

      const ballX =
        ball.position.X + (ball.speed.X > 0 ? ballRadius : -ballRadius);
      const ballY =
        ball.position.Y + (ball.speed.Y > 0 ? ballRadius : -ballRadius);

      if (ballY > canvas.height || ballY < 0) {
        ball.speed.Y = -ball.speed.Y;
      } else if (ballX > canvas.width || ballX < canvas.clientLeft) {
        let target = ball.position.X + ball.radius > canvas.width ? 0 : 1;
        setScore(target, player.score + 1);
        console.log("reset ball");
        resetBall();
      } else {
        for (let i = 0; i < 2; i++) {
          if (
            ballX >= player.position.X &&
            ballX <= player.position.X + player.width &&
            ballY >= player.position.Y &&
            ballY <= player.position.Y + player.height
          ) {
            ball.speed.X = -ball.speed.X;
            ball.speed.X = Math.min(Math.max(ball.speed.X * 1.1, -12), 12);
          }
        }
      }
    };

    const resetBall = () => {
      ball.position.X = canvas.width / 2;
      ball.position.Y = canvas.height / 2;

      let rnd = Math.random();
      if (rnd > 0.5) {
        ball.speed.X = canvas.width * 0.002;
      } else {
        ball.speed.X = canvas.width * -0.002;
      }
    };

    const setScore = (target: number, value: number) => {
      player.score = value;

      if (target == 0) setScore1((score) => score + 1);
      else setScore2((score) => score + 1);
    };

    requestAnimationFrame(gameLoop);

    timer = setInterval(() => {
      const time = Date.now() / 1000;
      const min = Math.floor((time - gameTime) / 60);
      const sec = Math.floor(time - (gameTime + min * 60));
      setTimeInfo(
        min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0")
      );
    });

    socket.on("connect", () => {
      socket.emit("match", { id: user!.id });
      socket.off("match");
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(timer);
      socket.disconnect();
      socket.close();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.scoreboard} ref={scoreboardRef}>
        <div className={styles.playerScore}>
          <img src={user?.avatar || ""} className={styles.avatar} />
          <div className={styles.playerInfo}>
            <span className={styles.username}>{user?.full_name}</span>
            <span className={styles.score}>{score1}</span>
          </div>
        </div>

        <div className={styles.timer}>{timeInfo}</div>

        <div className={styles.playerScore}>
          <div className={styles.playerInfo}>
            <span className={styles.score}>{score2}</span>
            <span className={styles.username}>{rival.full_name}</span>
          </div>
          <img src={rival.avatar || ""} className={styles.avatar} />
        </div>
      </div>
      <div className={styles.game}>
        <canvas className={styles.canvas} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import styles from "./game.module.css";
import { Socket } from "socket.io-client";
import { connectSocket } from "@/api/socket/game";

interface Vector2d {
  X: number;
  Y: number;
}

interface Player {
  position: Vector2d;
  width: number;
  height: number;
  target: number;
  speed: number;
  color: string;
  score: number;
}

interface Guest {
  position: Vector2d;
  width: number;
  height: number;
  color: string;
}

interface Ball {
  position: Vector2d;
  radius: number;
  speed: Vector2d;
}

let guestPos: "up" | "down" | number | null = null;

const keyPressed: { [x: string]: boolean } = {};

const PLAYER_MOVE_SPEED = 5;
const PLAYER_WIDTH_SCALE = 0.01;
const PLAYER_HEIGTH_SCALE = 0.25;
const PLAYER_MARGINX = 10;
const PLAYER_MARGINY = 5;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let ballRadius: number;
let timer: any;
let gameTime: number = Date.now() / 1000;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeInfo, setTimeInfo] = useState("");

  useEffect(() => {
    canvas = canvasRef.current as HTMLCanvasElement;

    if (!canvas) return;

    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const socket = connectSocket("http://localhost:9000/game");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const bodyElement = document.querySelector("body");
    if (bodyElement) {
      bodyElement.style.height = "100vh";
    }

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
      // Eğer tuşa basılırsa keyPressed objesine basılan tuş atanacak,
      // tuştan el kaldırılırsa objeden silinecek. Bu sayede multiple
      // her 2 player için de tuş kombinasyonları yakalanabilir
      console.log("pressed");
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

      // drawBall();
      // moveBall();

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
      // Object.assign(guest, data);

      // guest.target = data.target;

      // guest.position.Y = data.position.Y;
    });

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.position.X, ball.position.Y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00BFFF";
      ctx.fill();
      ctx.closePath();
    };

    const moveBall = () => {
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

    ballRadius = ball.radius / 2;
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    requestAnimationFrame(gameLoop);

    // setInterval(() => {
    //   socket.emit("movePlayer", players[0]);

    //   socket.send("movePlayer", "deneme");
    // }, 1000);

    setInterval(() => {
      const time = Date.now() / 1000;
      const min = Math.floor((time - gameTime) / 60);
      const sec = Math.floor(time - (gameTime + min * 60));
      setTimeInfo(
        min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0")
      );
    }, 1000);

    socket.on("connect", () => {
      console.log("connected");
    });

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
          <img
            src={
              "https://www.shareicon.net/data/512x512/2016/09/15/829452_user_512x512.png"
            }
            className={styles.avatar}
          ></img>
          <div className={styles.playerInfo}>
            <span className={styles.username}>İlknur Yarıkan</span>
            <span className={styles.score}>{score1}</span>
          </div>
        </div>
        <div className={styles.timer}>{timeInfo}</div>
        <div className={styles.playerScore}>
          <div className={styles.playerInfo}>
            <span className={styles.score}>{score2}</span>
            <span className={styles.username}>İlknur Yarıkan</span>
          </div>
          <img
            src={
              "https://www.shareicon.net/data/512x512/2016/09/15/829452_user_512x512.png"
            }
            className={styles.avatar}
          ></img>
        </div>
      </div>
      <div className={styles.game}>
        <canvas className={styles.canvas} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

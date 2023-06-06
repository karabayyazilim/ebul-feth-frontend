import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./game.module.css";
import { Socket } from "socket.io-client";
import { connectSocket } from "@/api/socket/game";
import Loading from "@/components/loading";
import { useAuthContext } from "@/auth/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import axios from "@/lib/axios";

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

let startGame: () => void;

Game.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default function Game() {
  const { user } = useAuthContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeInfo, setTimeInfo] = useState("");

  const [opponent, setOpponent] = useState<IUser>();

  const [userList, setUserList] = useState<
    {
      socketId: string;
      user: IUser;
    }[]
  >();

  useEffect(() => {
    let canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const socket = connectSocket("http://localhost:9000/game");

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

    /*function playBallSound(): void {
      const audio = new Audio("/assets/ballBounce.mp3");
      audio.play();
    }

    function scoreSound(): void {
      const audio = new Audio("/assets/score.mp3");
      audio.play();
    }*/

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
        /*scoreSound();*/
        resetBall();
      } else if (
        ballX >= player.position.X &&
        ballX <= player.position.X + player.width &&
        ballY >= player.position.Y &&
        ballY <= player.position.Y + player.height
      ) {
        ball.speed.X = -ball.speed.X;
        /*playBallSound(); Hocam ses ekledik sanırım hataların var düzelttiğin zaman 213, 221, 252 ve bu satırları açarsan oyun kısmnda küçük bir sürpriz ile karşılaşacaksınız. - SAYGILAR OYUN DEPARTMANI */
        ball.speed.X = Math.min(Math.max(ball.speed.X * 1.1, -12), 12);
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

    const getUserInterval = setInterval(() => {
      console.log("request");
      axios.get("/game").then((resp) => setUserList(resp.data));
    }, 3000);

    startGame = () => {
      clearInterval(getUserInterval);
      requestAnimationFrame(gameLoop);

      timer = setInterval(() => {
        const time = Date.now() / 1000;
        const min = Math.floor((time - gameTime) / 60);
        const sec = Math.floor(time - (gameTime + min * 60));
        setTimeInfo(
          min.toString().padStart(2, "0") +
            ":" +
            sec.toString().padStart(2, "0")
        );
      }, 1000);
    };

    socket.on("connect", () => {
      console.log("Connected. Pending..");
      socket.emit("matchRequest", { id: user!.id });
      socket.off("matchRequest");
    });

    socket.on("disconnect", () => {
      setOpponent(undefined);
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(timer);
      clearInterval(getUserInterval);
      socket.disconnect();
      socket.close();
    };
  }, []);

  const handlePlayUser = (user: IUser) => {
    console.log(user);
    startGame();
    setOpponent(user);
  };

  return (
    <>
      {!opponent && (
        <div>
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-5xl h-4/6">
              <h3 className="font-bold text-4xl text-center animate-bounce">
                User List
              </h3>

              <div className=" grid grid-cols-4">
                {userList?.map((x) => (
                  <div className="flex flex-col items-center">
                    <img
                      className="avatar w-24 h-24 rounded-full mb-3"
                      src={x.user.avatar || ""}
                    />
                    <p>{x.user.full_name}</p>
                    <button
                      onClick={() => handlePlayUser(x.user)}
                      className="btn btn-primary"
                    >
                      Play
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </dialog>
        </div>
      )}
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
              <span className={styles.username}>{opponent?.full_name}</span>
            </div>
            <img src={opponent?.avatar || ""} className={styles.avatar} />
          </div>
        </div>
        <div className={styles.game}>
          <canvas className={styles.canvas} ref={canvasRef}></canvas>
        </div>
      </div>
    </>
  );
}
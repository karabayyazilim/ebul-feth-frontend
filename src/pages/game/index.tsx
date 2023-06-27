import { useEffect, useRef, useState } from "react";
import styles from "./game.module.css";
import { gameSocket } from "@/api/socket/game";
import { useAuthContext } from "@/auth/AuthContext";
import {RxExit} from "react-icons/rx";
import Link from "next/link";
import { useRouter } from 'next/router';


interface Vector2d {
  X: number;
  Y: number;
}

interface IGameProps {
  rival: IUser;
  socket: any;
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
interface Ball {
  radius: number;
  speed: Vector2d;
  position: Vector2d;
}

const PLAYER_MARGINY = 5;
const PLAYER_MARGINX = 10;
const PLAYER_MOVE_SPEED = 5;
const PLAYER_WIDTH_SCALE = 0.01;
const PLAYER_HEIGTH_SCALE = 0.25;

const keyPressed: { [x: string]: boolean } = {};

export default function Game({ rival, socket }: IGameProps) {
  const { user } = useAuthContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreboardRef = useRef<HTMLDivElement>(null);

  let gameState = false;
  let countDown = 3;
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeInfo, setTimeInfo] = useState("");



  //socket  = gameSocket();

  useEffect(() => {
    let canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let timer: NodeJS.Timer;
    let gameTime: number = Date.now() / 1000;

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
      color: "lightpink",
      score: 0,
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key == 'w') {
        player.speed += 0.5;
        player.target -= player.position.Y + player.speed;
        //socket.emit("server:movePlayer", player.position);
      } else if (e.key == 's') {
        player.speed += 0.5;
        player.target += player.position.Y + player.speed;
        //socket.emit("server:movePlayer", player.position);
      }
      keyPressed[e.key] = true;
    };

    setInterval(() => {
      //socket.emit("server:movePlayer", player.position);
    },50);

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "w" || e.key === "s") {
        player.speed = PLAYER_MOVE_SPEED * (canvas.height * 0.0025);
        player.target = player.position.Y;
      }
      delete keyPressed[e.key];
    };

    const onResize = (event: Event) => {
      const oldHeight = canvas.height;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const scale = player.position.Y  * 100 / oldHeight;

      player.height = canvas.height * PLAYER_HEIGTH_SCALE;
      player.width = canvas.width * PLAYER_WIDTH_SCALE;
      player.speed = PLAYER_MOVE_SPEED * (canvas.height * 0.0025)
      player.position.Y = scale * canvas.height / 100;
      player.target = player.position.Y;

      ball.radius = canvas.width * 0.01;
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


    var preterit = setInterval(() => {
      countDown--;
      if (countDown === 0) {
        gameState = true;
        clearInterval(preterit);
      }
    }, 1000);

    function drawText() {

      var fontSize = canvas.width * 0.10;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = 'green';
      ctx.textAlign = 'center';
      ctx.fillText(countDown.toString(), canvas.width / 2, canvas.height / 2);

    }
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawPlayer(player);
      if(countDown > 0)
        drawText();

      if(gameState == false)
        return;

      calculatePlayerA();

      movePlayer(player);
      moveBall();

      //requestAnimationFrame(gameLoop);
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

    const drawPlayer = (player: Player) => {
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

    /*
    socket.on("movePlayer", (data: any) => {

      //console.log(data);
    });

    */
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

    const resetBall = async () => {
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

    //gerekliymiş
    //requestAnimationFrame(gameLoop);
    setInterval(() => {
      gameLoop();
    }, 30);



    //Todo: Süreyi hesaplayacak kütüphane kullan
    timer = setInterval(() => {
      const time = Date.now() / 1000;
      const min = Math.floor((time - gameTime) / 60);
      const sec = Math.floor(time - (gameTime + min * 60));
      setTimeInfo(
          min.toString().padStart(2, "0") + ":" + sec.toString().padStart(2, "0")
      );
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
              <span className={styles.username}>{rival?.full_name}</span>
            </div>
            <img src={rival?.avatar || ""} className={styles.avatar} />
          </div>
        </div>
        <div className={styles.game}>
          <canvas className={styles.canvas} ref={canvasRef}></canvas>
        </div>
        <div className={styles.footer}>
          Exit
          <Link href={"/"}><RxExit/></Link>
        </div>
      </div>
  );
}

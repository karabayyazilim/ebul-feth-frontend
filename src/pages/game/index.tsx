import {useEffect, useRef, useState} from "react";
import styles from './game.module.css';

interface Vector2d {
    X: number;
    Y: number;
}

interface Player {
    position: Vector2d;
    playerWidth: number;
    playerHeight: number;
    playerTargetY: number;
    playerSpeed: number;
    playerColor: string;
    playerScore: number;
}

interface Ball {
    position: Vector2d;
    ballRadius: number;
    ballSpeed: Vector2d;
}

const PLAYER_MOVE_SPEED = 1;
const PLAYER_WIDTH_SCALE = 0.01;
const PLAYER_HEIGTH_SCALE = 0.25;
const PLAYER_MARGINX = 10;
const PLAYER_MARGINY = 5;

let isGameInit : boolean = false;


export default function Game()
{
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scoreboardRef = useRef<HTMLDivElement>(null);

    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [timeInfo, setTimeInfo] = useState("");


    let canvas : any;
    let ctx : any;
    let ball : Ball;
    let players: Player[];
    let ballRadius: number;
    let timer : any;
    let gameTime : number = Date.now() / 1000;

    useEffect(() => {
        canvas = canvasRef.current;
        if(!canvas)
            return;

        ctx = canvas.getContext("2d");
        if(!ctx)
            return;

        console.log("Effect");

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const bodyElement = document.querySelector("body");
        if (bodyElement) {
            bodyElement.style.height = "100vh";
        }

        if(!isGameInit) {
            console.log("game");
            ball = {
                position: {
                    X: canvas.width / 2,
                    Y: canvas.height / 2,
                },
                ballSpeed: {
                    X: canvas.width * 0.0020,
                    Y: canvas.height * 0.0020,
                },
                ballRadius: canvas.width * 0.01,
            }

            players = [
                {
                    playerWidth: canvas.width * PLAYER_WIDTH_SCALE,
                    playerHeight: canvas.height * PLAYER_HEIGTH_SCALE,
                    position: {
                        X: PLAYER_MARGINX,
                        Y: PLAYER_MARGINY,
                    },
                    playerTargetY: PLAYER_MARGINY,
                    playerSpeed: PLAYER_MOVE_SPEED * (canvas.height * 0.0025),
                    playerColor: '#00CED1',
                    playerScore: 0,
                },
                {
                    playerWidth: canvas.width * PLAYER_WIDTH_SCALE,
                    playerHeight: canvas.height * PLAYER_HEIGTH_SCALE,
                    position: {
                        X: canvas.width - canvas.width * PLAYER_WIDTH_SCALE - PLAYER_MARGINX,
                        Y: PLAYER_MARGINY,
                    },
                    playerTargetY: PLAYER_MARGINY,
                    playerSpeed: PLAYER_MOVE_SPEED * (canvas.height * 0.0025),
                    playerColor: '#00CED1',
                    playerScore: 0,
                },
            ];
            ballRadius = ball.ballRadius / 2;
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener("keyup", onKeyUp);
            window.addEventListener("resize", onResize);
            timer = setInterval(gameLoop, 5);
            setInterval(() => {
                const time = Date.now() / 1000;
                const min = Math.floor((time - gameTime) / 60);
                const sec = Math.floor(time - (gameTime + (min * 60)));
                setTimeInfo(min.toString().padStart(2,'0') + ":" + sec.toString().padStart(2,'0'));

            },1000);
            isGameInit = true;
            gameLoop();
        }
        return () => {
            //clearInterval(timer);
        }

    })



    const onResize = (event : Event) => {
        console.log("Resize");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    const drawPlayer = (player: Player) => {
        ctx.fillStyle = player.playerColor;
        ctx.fillRect(player.position.X, player.position.Y, player.playerWidth, player.playerHeight);
    };

    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(ball.position.X, ball.position.Y, ball.ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#00BFFF';
        ctx.fill();
        ctx.closePath();
    };


    const onKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 83) {
            players[0].playerSpeed += 0.5;
            players[0].playerTargetY += players[0].position.Y + players[0].playerSpeed;
        } else if (e.keyCode === 87) {
            players[0].playerSpeed += 0.5;
            players[0].playerTargetY -= players[0].position.Y + players[0].playerSpeed;
        } else if (e.keyCode === 40) {
            players[1].playerSpeed += 0.5;
            players[1].playerTargetY += players[1].position.Y + players[1].playerSpeed;
        } else if (e.keyCode === 38) {
            players[1].playerSpeed += 0.5;
            players[1].playerTargetY -= players[1].position.Y + players[1].playerSpeed;
        }
    };

    const onKeyUp = (e: KeyboardEvent) => {
        if(e.keyCode == 83 || e.keyCode == 87) {
            players[0].playerSpeed = PLAYER_MOVE_SPEED * (canvas.height * 0.0025);
            players[0].playerTargetY = players[0].position.Y;
        }
        else if(e.keyCode == 40 || e.keyCode == 38) {
            players[1].playerSpeed = PLAYER_MOVE_SPEED * (canvas.height * 0.0025);
            players[1].playerTargetY = players[1].position.Y;
        }

    }

    const onBallCollide = (target : any) => {
        if(target.targetName == "wall")
            ball.ballSpeed.Y = -ball.ballSpeed.Y;
    }

    const gameLoop = () => {
        if(!isGameInit)
            return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        moveBall();

        for (let i = 0; i < 2; i++) {
            movePlayer(players[i]);
            drawPlayer(players[i]);
        }

        //window.requestAnimationFrame(gameLoop);
    };

    const movePlayer = (player : Player) => {
        const speed = player.playerSpeed;
        if(player.position.Y < player.playerTargetY) {
            if(player.position.Y + player.playerHeight + speed < canvas.height - PLAYER_MARGINY)
                player.position.Y += speed;
            else if(player.position.Y + player.playerHeight < canvas.height - PLAYER_MARGINY)
                player.position.Y += 1;
        }
        else if(player.position.Y > player.playerTargetY) {
            console.log("2");
            if(player.position.Y - speed > PLAYER_MARGINY)
                player.position.Y -= speed;
            else if(player.position.Y > PLAYER_MARGINY)
                player.position.Y -= 1;
        }
    };

    const moveBall = () => {
        ball.position.X += ball.ballSpeed.X;
        ball.position.Y += ball.ballSpeed.Y;

        if ((ball.position.Y + ballRadius) > canvas.height || (ball.position.Y + ballRadius) < 0)
            onBallCollide({targetName: "wall", targetEntity: null});
        else if(ball.position.X > canvas.width|| ball.position.X < canvas.clientLeft)
        {
            let target = ball.position.X + ball.ballRadius > canvas.width ? 0 : 1;
            setScore(target, players[target].playerScore + 1);
            resetBall();

        }
        else
        {
            const ballX = ball.position.X + ballRadius;
            const ballY = ball.position.Y + ballRadius;

            for (let i = 0; i < 2; i++)
            {
                if (ballX >= players[i].position.X && ballX <= players[i].position.X + players[i].playerWidth
                    && ballY >= players[i].position.Y && ballY <= players[i].position.Y + players[i].playerHeight)
                {
                    console.log("Collide");
                    ball.ballSpeed.X = -ball.ballSpeed.X
                    ball.ballSpeed.X = Math.min(Math.max(ball.ballSpeed.X * 1.1, -25), 25);
                }
            }
        }
    };

    const resetBall = () => {
        ball.position.X = canvas.width / 2;
        ball.position.Y = canvas.height / 2;

        let rnd = Math.random();
        if (rnd > 0.5) {
            ball.ballSpeed.X = canvas.width * 0.0050;
        } else {
            ball.ballSpeed.X = canvas.width * -0.0050;
        }
    };

    const setScore = (target: number, value: number) => {
        players[target].playerScore = value;

        if(target == 0)
            setScore1((score) => score + 1);
        else
            setScore2((score) => score + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.scoreboard} ref={scoreboardRef}>
                <div className={styles.playerScore}>
                    <img src={"https://www.shareicon.net/data/512x512/2016/09/15/829452_user_512x512.png"} className={styles.avatar}></img>
                    <div className={styles.playerInfo}>
                        <span className={styles.username}>İlknur Yarıkan</span>
                        <span className={styles.score}>{score1}</span>
                    </div>
                </div>
                <div className={styles.timer}>
                    {
                        timeInfo
                    }
                </div>
                <div className={styles.playerScore}>
                    <div className={styles.playerInfo}>
                        <span className={styles.score}>{score2}</span>
                        <span className={styles.username}>İlknur Yarıkan</span>
                    </div>
                    <img src={"https://www.shareicon.net/data/512x512/2016/09/15/829452_user_512x512.png"} className={styles.avatar}></img>
                </div>

            </div>
            <div className={styles.game}>
                <canvas className={styles.canvas} ref={canvasRef}></canvas>
            </div>
        </div>
    )
}
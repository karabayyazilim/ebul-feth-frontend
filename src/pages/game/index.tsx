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
    playerSpeed: number;
    playerColor: string;
    playerScore: number;
}

interface Ball {
    position: Vector2d;
    ballRadius: number;
    ballSpeed: Vector2d;
}

const PLAYER_SPEED = 50;
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

    let canvas : any;
    let ctx : any;
    let ball : Ball;
    let players: Player[];
    let ballRadius: number;

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
                    X: canvas.width * 0.0050,
                    Y: canvas.height * 0.0050,
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
                    playerSpeed: PLAYER_SPEED,
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
                    playerSpeed: PLAYER_SPEED,
                    playerColor: '#00CED1',
                    playerScore: 0,
                },
            ];
            ballRadius = ball.ballRadius / 2;
            window.addEventListener('keydown', onKeyDown);
            window.addEventListener("resize", onResize);
            isGameInit = true;
            gameLoop();
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
            movePlayer(1, players[0]);
        } else if (e.keyCode === 87) {
            movePlayer(0, players[0]);
        } else if (e.keyCode === 40) {
            movePlayer(1, players[1]);
        } else if (e.keyCode === 38) {
            movePlayer(0, players[1]);
        }
    };

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

        for (let i = 0; i < 2; i++)
            drawPlayer(players[i]);

        window.requestAnimationFrame(gameLoop);
    };

    const movePlayer = (direction: number, player: Player) => {
        if (direction === 1) {
            if (player.position.Y + player.playerHeight < canvas.height)
                player.position.Y += PLAYER_SPEED;
        } else {
            if (player.position.Y > 0)
                player.position.Y -= PLAYER_SPEED;
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
                    asdad
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
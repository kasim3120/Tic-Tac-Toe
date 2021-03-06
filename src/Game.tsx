import { useState, useEffect } from "react";

import Square from "./Square";

type Scored = {
  [key:string]:number;
}

const INITIAL_GAME_STATE = ['','','','','','','','',''];
const INITIAL_SCORES: Scored = {"X": 0, "O": 0};
const WINNER_COMBO = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function Game() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [scores, setScores] = useState(INITIAL_SCORES);

  useEffect(() => {
    const storedScores = localStorage.getItem("scores");
    if(storedScores){
      setScores(JSON.parse(storedScores));
    }
  },[])

  useEffect(()=>{
    if(gameState === INITIAL_GAME_STATE){
      return 
    }
    checkForWinner();
  },[gameState]);
  
  //重置盤面
  const resetBoard = () => setGameState(INITIAL_GAME_STATE);
  
  //勝利玩家處理流程
  const handleWin = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);

    const newPlayerScore = scores[currentPlayer] + 1;
    const newScores = {...scores};
    newScores[currentPlayer] = newPlayerScore;
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    
    resetBoard();
  }
  
  //平手處理流程
  const handleDraw = () => {
    window.alert("The game ended in a draw");

    resetBoard();
  }
  
  //勝利玩家確認流程
  const checkForWinner = () => {
    let roundWin = false;

    for(let i = 0; i < WINNER_COMBO.length; i++) {
      const winCombo = WINNER_COMBO[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if([a, b, c] .includes("")) {
        continue;
      };

      if(a === b && b ===c) {
        roundWin = true;
        break;
      };
    }

    if(roundWin) {
      setTimeout(() =>  handleWin() , 500);
      return ;
    };

    if(!gameState.includes("")){
      setTimeout(() =>  handleDraw() , 500);
      return ;
    };
    changePlayer();
  };

  //切換下手順序
  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };
  
  const handleCellClick = (event:any) => {
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));

    const currentValue = gameState[cellIndex];
    if(currentValue) {
      return 
    }
    const newValues = [...gameState];
    newValues[cellIndex] = currentPlayer;
    setGameState(newValues);
  }  
  //重置分數
  const handleReset = () => {
    setScores(INITIAL_SCORES)
  }
  
  return(
    <div className='h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500'>
      <h1 className='text-center text-5xl mb-4 font-display text-white'>Tic Tac Toe Game Page</h1>
      <div>
        <div className='grid grid-cols-3 gap-3 mx-auto w-96'>{gameState.map((player, index) => (
          <Square key={index} onClick={handleCellClick} {...{index, player }}/>
        )
        )}</div>
        <div className="mx-auto w-96 text-2xl text-serif">
          <p className="text-white mt-5">Next Player: <span>{currentPlayer}</span></p>
          <p className="text-white mt-5">Player X Wins: <span>{scores["X"]}</span></p>
          <p className="text-white mt-5">Player O Wins: <span>{scores["O"]}</span></p>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  )
}


export default Game

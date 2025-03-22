import { useEffect, useState } from "react";
import Confetti from 'react-confetti'
import "./App.css";

const gameIcons = [
  "😃", "💖", "🎉", "👑", "🎩", "🌹", "☃️", "🌈", 
  "🍉", "🍿", "🎂", "🚗", "🚀", "⛱️", "⏰", "⚖️",
];

function App() {
  const [pieces, setPieces] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false); // New state for completion screen

  const startGame = () => {
    const duplicateGameIcons = [...gameIcons, ...gameIcons];
    const newGameIcons = [];

//Shuffling the icons
    while (newGameIcons.length < gameIcons.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }

    setPieces(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, []);

  //Handle Click event
  const handleClick = (data) => {
    
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if(flippedData.length === 2) return;

    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPieces(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) {
      setTimeout(() => {
        if (flippedData[0].emoji === flippedData[1].emoji) {
          const resetFlippedData = pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) { piece.solved = true; }
            return piece;
          });
          setPieces(resetFlippedData);
        } else {
          const resetFlippedData = pieces.map((piece) => {
            if (
              piece.position === flippedData[0].position ||
              piece.position === flippedData[1].position
            ) { piece.flipped = false; }
            return piece;
          });
          setPieces(resetFlippedData);
        }
      }, 800);
    }
  };

  const checkIfGameFinished = () => {
    if (pieces.every((piece) => piece.solved)) {
      setGameCompleted(true); // Trigger the game completion screen
    }
  };

  useEffect(() => {
    gameLogicForFlipped();

    if (pieces.length > 0) {
      checkIfGameFinished();
    }
  }, [pieces]);

  return (
    <main className="home-page">
      <h1>Memory Game in React</h1>
      {gameCompleted ? (
        <div className="game-complete">
          <h2>Congratulations! 🎉</h2>
          <p>You completed the game!</p>
          <button onClick={() => {
            setGameCompleted(false); // Restart the game
            startGame();
          }}>
            Play Again
          </button>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </div>
      ) : (
        <div className="container">
          {pieces.map((data, index) => (
            <div
              className={`flip-card ${data.flipped ? "active" : ""}`}
              key={index}
              onClick={() => handleClick(data)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front" />
                <div className="flip-card-back">{data.emoji}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;

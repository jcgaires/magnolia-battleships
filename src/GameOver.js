
export default ({ board, onPlayAgain }) => {
  return (
    <div className="app app--game-over">
      <h1 className="main-title">Congratulations!</h1>
      <p className="main-description">{`You won! Your shot total is ${board.filter(point => point.shot).length}.`}</p>
      <button className="form__button" onClick={onPlayAgain}>Play again</button>
    </div>
  );
};

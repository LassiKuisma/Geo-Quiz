interface Props {
  gameId: undefined | number;
}

const GameView = ({ gameId }: Props) => {
  if (!gameId) {
    return <div>Loading new game...</div>;
  }

  return <div>GameId is: {gameId}</div>;
};

export default GameView;

import styles from './game-board.module.scss';
import TCharacter from '@/types/character';
import CardZone from './card-zone/card-zone';
const GameBoard = async ({ size }: { size: number }) => {
  const url = new URL('/api/characters', process.env.NEXT_PUBLIC_BASE_URL);
  url.searchParams.append('number', `${size * size}`);
  url.searchParams.append('isRandom', 'true');
  const response = await fetch(url);
  const cardsFlatArray = (await response.json()) as Array<TCharacter>;
  const cards = Array.from({ length: size }, (_, i) =>
    cardsFlatArray.slice(i * size, size * (i + 1)),
  );
  return (
    <div className={styles.gameboard}>
      <CardZone startCards={cards} size={size} />
    </div>
  );
};

export default GameBoard;

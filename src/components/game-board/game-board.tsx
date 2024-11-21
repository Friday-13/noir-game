import styles from './game-board.module.scss';
import TCharacter from '@/types/character';
import CardZone from './card-zone/card-zone';
import StoreProvider from '@/utils/store/store-provider';
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
      <StoreProvider activeCharacter={cards[0][0]}>
        <CardZone startCards={cards} size={size} />
      </StoreProvider>
    </div>
  );
};

export default GameBoard;

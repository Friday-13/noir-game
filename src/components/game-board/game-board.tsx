import CharacterCard from '../character-card/character-card';
import styles from './game-board.module.scss';
import TCharacter from '@/types/character';
const GameBoard = async ({ size }: { size: number }) => {
  const url = new URL('/api/characters', process.env.NEXT_PUBLIC_BASE_URL);
  url.searchParams.append('number', `${size * size}`);
  url.searchParams.append('isRandom', 'true');
  const response = await fetch(url);
  const cards = (await response.json()) as Array<TCharacter>;
  return (
    <div className={styles.gameboard}>
      <div
        className={styles['card-zone']}
        style={{
          gridTemplateColumns: `repeat(${size}, auto)`,
          gridTemplateRows: `repeat(${size}, auto)`,
        }}
      >
        {cards.map((card, index) => (
          <CharacterCard character={card} key={index} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

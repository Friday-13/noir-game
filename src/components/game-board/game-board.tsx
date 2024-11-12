import Image from 'next/image';
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
          <div
            className={styles.card}
            key={index}
            style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
          >
            <Image
              src={card.photo.noir}
              alt='char'
              width={150}
              height={150}
              style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
            />
            <div className={styles['character-name']}>
              <p>{card.name.eng}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

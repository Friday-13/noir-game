import Image from 'next/image';
import styles from './game-board.module.scss';
const GameBoard = ({ size }: { size: number }) => {
  const cards = Array.from({ length: size * size });
  return (
    <div className={styles.gameboard}>
      <div
        className={styles['card-zone']}
        style={{
          gridTemplateColumns: `repeat(${size}, auto)`,
          gridTemplateRows: `repeat(${size}, auto)`,
        }}
      >
        {cards.map((_, index) => (
          <div
            className={styles.card}
            key={index}
            style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
          >
            <Image
              src='/characters/noir-style/Eris.png'
              alt='char'
              width={150}
              height={150}
              style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

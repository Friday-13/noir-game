'use client';
import TCardPosition from '@/types/card-position';
import TCharacter from '@/types/character';
import styles from './card-zone.module.scss';
import CharacterCard from '@/components/character-card/character-card';
import { useState } from 'react';

const cardGrid = (cards: Array<Array<TCharacter>>) => {
  return cards.map((row, i) =>
    row.map((card, j) => {
      const position: TCardPosition = {
        top: i,
        left: j,
      };
      return {
        character: card,
        position,
        key: `${i}-${j}`,
      };
    }),
  );
};

const CardZone = ({
  startCards,
  size,
}: {
  startCards: Array<Array<TCharacter>>;
  size: number;
}) => {
  const [cards] = useState(cardGrid(startCards));

  return (
    <div
      className={styles['card-zone']}
      style={{
        height: `${280 * size}px`,
      }}
    >
      {cards.map((row) =>
        row.map((card) => {
          return (
            <CharacterCard
              character={card.character}
              position={card.position}
              key={card.key}
            />
          );
        }),
      )}
    </div>
  );
};

export default CardZone;

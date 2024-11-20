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
  const [cards, setCards] = useState(cardGrid(startCards));
  const moveCards = () => {
    const newCards = cards.map((row) =>
      row.map((card) => {
        if (card.position.top === 1) {
          if (card.position.left === 0) {
            card.position.left = size - 1;
          } else {
            card.position.left -= 1;
          }
        }
        return card;
      }),
    );
    setCards(newCards);
  };

  return (
    <div
      className={styles['card-zone']}
      style={{
        height: `${280 * size}px`,
      }}
      onClick={() => {
        // [cards[0][0].position, cards[2][2].position] = [
        //   cards[2][2].position,
        //   cards[0][0].position,
        // ];
        // const newCards = [...cards];
        // console.log(cards[0][0].position);
        // setCards(newCards);
        moveCards();
      }}
    >
      {cards.map((row) =>
        row.map((card) => {
          return (
            <CharacterCard
              character={card.character}
              position={card.position}
              key={card.character.id}
            />
          );
        }),
      )}
    </div>
  );
};

export default CardZone;

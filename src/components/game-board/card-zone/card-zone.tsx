'use client';
import { TCardPosition } from '@/types/card-position';
import TCharacter from '@/types/character';
import styles from './card-zone.module.scss';
import CharacterCard from '@/components/character-card/character-card';
import { useState } from 'react';
import TMoveDirection from '@/types/move-direction';

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
  const moveCards = (
    direction: TMoveDirection,
    currentPosition: TCardPosition,
  ) => {
    let step = 0;
    if (direction === 'left' || direction === 'up') {
      step = -1;
    } else {
      step = 1;
    }

    const newCards = cards.map((row) =>
      row.map((card) => {
        if (direction === 'left' || direction === 'right') {
          if (card.position.top === currentPosition.top) {
            card.position.left += step;
            if (card.position.left < 0) {
              card.position.left = size - 1;
            }
            if (card.position.left >= size) {
              card.position.left = 0;
            }
          }
        } else {
          if (card.position.left === currentPosition.left) {
            card.position.top += step;
            if (card.position.top < 0) {
              card.position.top = size - 1;
            }
            if (card.position.top >= size) {
              card.position.top = 0;
            }
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
        // moveCards();
      }}
    >
      {cards.map((row) =>
        row.map((card) => {
          return (
            <CharacterCard
              character={card.character}
              position={card.position}
              key={card.character.id}
              moveCallback={moveCards}
            />
          );
        }),
      )}
    </div>
  );
};

export default CardZone;

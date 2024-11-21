'use client';
import { TCardPosition } from '@/types/card-position';
import TCharacter from '@/types/character';
import styles from './card-zone.module.scss';
import CharacterCard from '@/components/character-card/character-card';
import { useState } from 'react';
import TMoveDirection from '@/types/move-direction';
import { TCard } from '@/types/card';
import moveCards from './move-cards';
import { useAppDispatch, useAppSelector } from '@/utils/store/hooks';
import { increment } from '@/utils/store/slices/counter-slice';

const cardGrid = (cards: TCharacter[][]): TCard[][] => {
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
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const handleMove = (
    direction: TMoveDirection,
    currentPosition: TCardPosition,
  ) => {
    const newCards = moveCards(cards, size, direction, currentPosition);
    setCards(newCards);
  };

  return (
    <div
      className={styles['card-zone']}
      style={{
        height: `${280 * size}px`,
      }}
      onClick={() => {
        console.log(count);
        dispatch(increment());
      }}
    >
      {cards.map((row) =>
        row.map((card) => {
          return (
            <CharacterCard
              character={card.character}
              position={card.position}
              key={card.character.id}
              moveCallback={handleMove}
            />
          );
        }),
      )}
    </div>
  );
};

export default CardZone;

'use client';
import TCardPosition from '@/types/card-position';
import TCharacter from '@/types/character';
import styles from './card-zone.module.scss';
import CharacterCard from '@/components/character-card/character-card';
import { useState } from 'react';
import CardControls from '../card-controls/card-controls';

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
  const [controlsShown, setControlsShown] = useState(false);
  const [controlsPosition, setControlsPosition] = useState<TCardPosition>({
    top: 0,
    left: 0,
  });

  const showControls = (position: TCardPosition) => {
    setControlsShown(true);
    const newControlsPosition: TCardPosition = {
      top: position.top - 60,
      left: position.left - 60,
    };
    console.log(newControlsPosition);
    setControlsPosition(newControlsPosition);
  };

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
              showControls={showControls}
            />
          );
        }),
      )}
      {controlsShown ? <CardControls position={controlsPosition} /> : <></>}
    </div>
  );
};

export default CardZone;

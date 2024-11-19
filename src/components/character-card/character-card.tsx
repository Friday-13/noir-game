'use client';
import TCharacter from '@/types/character';
import Image from 'next/image';
import styles from './character-card.module.scss';
import { Suspense, useEffect, useState } from 'react';
import FlippingLoader from '../flipping-loader/flipping-loader';
import TCardPosition from '@/types/card-position';
import CardControls from '../game-board/card-controls/card-controls';

const CharacterCard = ({
  character,
  position,
}: {
  character: TCharacter;
  position: TCardPosition;
}) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [cardRotation, setCardRotation] = useState<number>(0);
  const [isAlive, setIsAlive] = useState<boolean>(true);

  const getStyle = () => {
    if (isActive) {
      return {
        transform: `scale(1.1)`,
        top: `${position.top * 280}px`,
        left: `${position.left * 220}px`,
        zIndex: 2,
      };
    }
    if (isHover) {
      return {
        transform: `scale(1.1)`,
        top: `${position.top * 280}px`,
        left: `${position.left * 220}px`,
      };
    }
    return {
      transform: `rotate(${cardRotation}deg)`,
      top: `${position.top * 280}px`,
      left: `${position.left * 220}px`,
    };
  };

  useEffect(() => {
    setCardRotation(Math.random() * 6 - 3);
    setImageRotation(Math.random() * 6 - 3);
  }, []);

  return (
    <>
      <div
        className={styles.card}
        style={getStyle()}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        onClick={() => {
          setIsActive(true);
        }}
      >
        <Suspense fallback={<FlippingLoader />}>
          <Image
            src={character.photo.noir}
            alt={character.name.eng}
            width={150}
            height={150}
            style={{ transform: `rotate(${imageRotation}deg)` }}
          />
          <div className={styles['character-name']}>
            <p>{character.name.eng}</p>
          </div>
          {isAlive ? <></> : <div className={styles.card_crossed} />}
        </Suspense>
      </div>
      {isActive ? (
        <CardControls
          position={{
            top: position.top * 280 - 60,
            left: position.left * 220 - 60,
          }}
          hideControls={() => setIsActive(false)}
          catchSpy={() => {
            setIsAlive(false);
          }}
          interrogate={() => {}}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default CharacterCard;

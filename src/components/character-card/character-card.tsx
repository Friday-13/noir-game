'use client';
import TCharacter from '@/types/character';
import Image from 'next/image';
import styles from './character-card.module.scss';
import { Suspense, useEffect, useState } from 'react';
import FlippingLoader from '../flipping-loader/flipping-loader';

const CharacterCard = ({ character }: { character: TCharacter }) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const [cardRotation, setCardRotation] = useState<number>(0);

  const getHoverStyle = () => {
    if (isHover) {
      return { transform: `scale(1.1)` };
    }
    return { transform: `rotate(${cardRotation}deg)` };
  };

  useEffect(() => {
    setCardRotation(Math.random() * 6 - 3);
    setImageRotation(Math.random() * 6 - 3);
  }, []);

  return (
    <div
      className={styles.card}
      style={getHoverStyle()}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
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
      </Suspense>
    </div>
  );
};

export default CharacterCard;

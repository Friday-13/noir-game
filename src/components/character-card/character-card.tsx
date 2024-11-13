import TCharacter from '@/types/character';
import Image from 'next/image';
import styles from './character-card.module.scss';
import { Suspense } from 'react';
import FlippingLoader from '../flipping-loader/flipping-loader';

const CharacterCard = ({ character }: { character: TCharacter }) => {
  return (
    <div
      className={styles.card}
      style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
    >
      <Suspense fallback={<FlippingLoader />}>
        <Image
          src={character.photo.noir}
          alt={character.name.eng}
          width={150}
          height={150}
          style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
        />
        <div className={styles['character-name']}>
          <p>{character.name.eng}</p>
        </div>
      </Suspense>
    </div>
  );
};

export default CharacterCard;

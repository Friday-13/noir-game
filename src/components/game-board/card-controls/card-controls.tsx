import TCardPosition from '@/types/card-position';
import styles from './card-controls.module.scss';
const CardControls = ({ position }: { position: TCardPosition }) => {
  return (
    <div
      className={styles.controls}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div
        className={[styles.controls__arrow, styles.controls__arrow_up].join(
          ' ',
        )}
      ></div>
      <div
        className={[styles.controls__arrow, styles.controls__arrow_right].join(
          ' ',
        )}
      ></div>
      <div
        className={[styles.controls__arrow, styles.controls__arrow_down].join(
          ' ',
        )}
      ></div>
      <div
        className={[styles.controls__arrow, styles.controls__arrow_left].join(
          ' ',
        )}
      ></div>
    </div>
  );
};

export default CardControls;

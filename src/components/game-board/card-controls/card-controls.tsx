import TCardPosition from '@/types/card-position';
import styles from './card-controls.module.scss';
const CardControls = ({
  position,
  hideControls,
  catchSpy,
  interrogate,
}: {
  position: TCardPosition;
  hideControls: () => void;
  catchSpy: () => void;
  interrogate: () => void;
}) => {
  return (
    <>
      <div className={styles.overlay} onClick={() => hideControls()}></div>
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
          className={[
            styles.controls__arrow,
            styles.controls__arrow_right,
          ].join(' ')}
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
        <div
          className={[
            styles.controls,
            styles.controls__action,
            styles.controls__action_interrogate,
          ].join(' ')}
          onClick={() => interrogate()}
        ></div>
        <div
          className={[
            styles.controls,
            styles.controls__action,
            styles.controls__action_catch,
          ].join(' ')}
          onClick={() => catchSpy()}
        ></div>
      </div>
    </>
  );
};

export default CardControls;

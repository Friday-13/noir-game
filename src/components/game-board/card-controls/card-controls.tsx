import { TCardPosition } from '@/types/card-position';
import styles from './card-controls.module.scss';
import TMoveDirection from '@/types/move-direction';
import positionToPixels from '@/utils/position-to-pixels';
const CardControls = ({
  position,
  hideControls,
  catchSpy,
  interrogate,
  moveCards,
}: {
  position: TCardPosition;
  hideControls: () => void;
  catchSpy: () => void;
  interrogate: () => void;
  moveCards: (
    direction: TMoveDirection,
    currentPosition: TCardPosition,
  ) => void;
}) => {
  const positionPx = positionToPixels(position, 220, 280, -60, -60);

  return (
    <>
      <div className={styles.overlay} onClick={() => hideControls()}></div>
      <div
        className={styles.controls}
        style={{ top: `${positionPx.topPx}px`, left: `${positionPx.leftPx}px` }}
      >
        <div
          className={[styles.controls__arrow, styles.controls__arrow_up].join(
            ' ',
          )}
          onClick={() => {
            hideControls();
            moveCards('up', position);
          }}
        ></div>
        <div
          className={[
            styles.controls__arrow,
            styles.controls__arrow_right,
          ].join(' ')}
          onClick={() => {
            hideControls();
            moveCards('right', position);
          }}
        ></div>
        <div
          className={[styles.controls__arrow, styles.controls__arrow_down].join(
            ' ',
          )}
          onClick={() => {
            hideControls();
            moveCards('down', position);
          }}
        ></div>
        <div
          className={[styles.controls__arrow, styles.controls__arrow_left].join(
            ' ',
          )}
          onClick={() => {
            hideControls();
            moveCards('left', position);
          }}
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

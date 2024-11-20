import { TCard } from '@/types/card';
import { TCardPosition } from '@/types/card-position';
import TMoveDirection from '@/types/move-direction';

const getMovingStep = (direction: TMoveDirection) => {
  if (direction === 'left' || direction === 'up') {
    return -1;
  }
  return 1;
};

const getIsHorizontal = (direction: TMoveDirection) => {
  return direction === 'left' || direction === 'right';
};

const isTheSameLine = (
  position1: TCardPosition,
  position2: TCardPosition,
  isHorizontal: boolean,
) => {
  if (isHorizontal) {
    return position1.top === position2.top;
  }
  return position1.left === position2.left;
};

const wrapPosition = (nextPositionValue: number, maxValue: number): number => {
  if (nextPositionValue < 0) {
    return maxValue - 1;
  }
  if (nextPositionValue >= maxValue) {
    return 0;
  }
  return nextPositionValue;
};

const moveCards = (
  cards: TCard[][],
  size: number,
  direction: TMoveDirection,
  currentPosition: TCardPosition,
) => {
  const step = getMovingStep(direction);
  const isHorizontal = getIsHorizontal(direction);

  const newCards = cards.map((row) =>
    row.map((card) => {
      if (isTheSameLine(currentPosition, card.position, isHorizontal)) {
        if (isHorizontal) {
          card.position.left = wrapPosition(card.position.left + step, size);
        } else {
          card.position.top = wrapPosition(card.position.top + step, size);
        }
      }
      return card;
    }),
  );
  return newCards;
};

export default moveCards;

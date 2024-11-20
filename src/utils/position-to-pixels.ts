import { TCardPosition, TCardPositionPixels } from '@/types/card-position';

const positionToPixels = (
  postion: TCardPosition,
  width: number,
  height: number,
  widthOffset: number = 0,
  heightOffset: number = 0,
): TCardPositionPixels => {
  return {
    topPx: postion.top * height + heightOffset,
    leftPx: postion.left * width + widthOffset,
  };
};

export default positionToPixels;

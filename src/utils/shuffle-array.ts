/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const shuffleArray = (arr: Array<any>) => {
  const shuffled = arr.toSorted(() => 0.5 - Math.random());
  return shuffled;
};

export default shuffleArray;

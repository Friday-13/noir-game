import characters from '@data/characters.json';
import shuffleArray from '@utils/shuffle-array';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const maxNumber = characters.characters.length;
  const isRandom = searchParams.get('isRandom');
  const number = Number(searchParams.get('number'));
  try {
    if (id) {
      const character = characters.characters.find(
        (character) => `${character.id}` === id,
      );
      if (!character) {
        throw Error(`Character with id ${id} not found`);
      }
      return Response.json(
        characters.characters.find((character) => `${character.id}` === id),
      );
    }

    if (!isNaN(number)) {
      if (number > maxNumber) {
        throw Error(`The number shouldn't exceed ${maxNumber}`);
      }
      const sampleCharacters = isRandom
        ? shuffleArray(characters.characters)
        : characters.characters;
      const selectedCharacters = sampleCharacters.slice(0, number);
      return Response.json(selectedCharacters);
    }
    return Response.json(characters.characters);
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 400 });
  }
};

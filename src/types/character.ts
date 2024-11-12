type TLocalizedString = {
  eng: string;
  ru: string;
};

type TStyledContent = {
  noir: string;
  victorian: string;
};

type TCharacter = {
  id: number;
  name: TLocalizedString;
  photo: TStyledContent;
  description: TStyledContent;
};

export default TCharacter;

const FIELD_NAME = "nickname";
export const saveNameOrEmail = (nameOrEmail: string) => {
  localStorage.setItem(FIELD_NAME, nameOrEmail);
};

export const getNameOrEmail = () => {
  return localStorage.getItem(FIELD_NAME);
};

export const removeNameOrEmail = () => {
  localStorage.removeItem(FIELD_NAME);
};

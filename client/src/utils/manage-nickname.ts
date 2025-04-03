const FIELD_NAME = "nickname";
export function saveNameOrEmail(nameOrEmail: string) {
  localStorage.setItem(FIELD_NAME, nameOrEmail);
}

export function getNameOrEmail() {
  return localStorage.getItem(FIELD_NAME);
}

export function removeNameOrEmail() {
  localStorage.removeItem(FIELD_NAME);
}

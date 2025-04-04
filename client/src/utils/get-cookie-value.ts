const getCookieValue = (name: string) => {
  if (document.cookie.length === 0) return null;
  const regExp = new RegExp(`(^| )${name}=([^;]+)`);
  const cookieMatch = document.cookie.match(regExp);
  return cookieMatch ? cookieMatch[2] : null;
};

export default getCookieValue;

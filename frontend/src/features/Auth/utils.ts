export type Token = string | undefined;

export function getTokenFromCookie(): Token | undefined {
  const tokenCookie = document.cookie?.split(';').filter((item) => item.trim().startsWith('token='))[0];
  return tokenCookie?.split('=').pop();
}

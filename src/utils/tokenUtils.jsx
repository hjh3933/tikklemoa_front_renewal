export const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  const payload = JSON.parse(atob(token.split(".")[1]));
  const exp = payload.exp * 1000; // Unix time in milliseconds
  const now = Date.now();

  return now > exp;
};

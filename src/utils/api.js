export const CLIENT_ID = "2fd69128dd2a402ea9dca8a5ea6b4d6f";
export const CLIENT_SECRET = "81526518e36446eea552ef803ad36c3f";
export const BASE_URL_BACKEND =
  import.meta.env && import.meta.env.MODE === "production"
    ? "https://spotify.thekunfo.com"
    : "http://127.0.0.1:3001";
export const accessToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return token;
};

export const accessApplication = () => {
  const token = localStorage.getItem("app");
  if (!token) {
    return null;
  }
  return token;
};

export const getBaseUrl = () => {
  return BASE_URL_BACKEND;
};

export const getAuthToken = () => {
  return accessToken();
};

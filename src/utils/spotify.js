import { CLIENT_ID, CLIENT_SECRET, accessToken } from "./api";
import { checkResponse } from "./response";

export const authenticationSpotify = () => {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Spotify authentication failed:", error);
      throw error;
    });
};

export const getAlbum = (params = {}) => {
  const {
    q = "kita usahakan lagi",
    type = "track",
    limit = 20,
    offset = 20,
  } = params;

  return fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken()}`,
      },
    }
  )
    .then(checkResponse)
    .catch((error) => {
      console.error("Get album request failed:", error);
      throw error;
    });
};

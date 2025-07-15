import { CLIENT_ID, CLIENT_SECRET, accessToken } from "./api";
import { checkResponse } from "./response";

// Spotify API base URL
const SPOTIFY_URL = "https://api.spotify.com/v1";

// Spotify Authorization URL for user login
export const getSpotifyAuthUrl = () => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-library-read",
    "user-library-modify",
    "user-top-read",
    "user-read-recently-played",
  ].join(" ");

  // Use a fixed redirect URI that matches your Spotify app settings
  const redirectUri = "http://localhost:5174/callback";

  console.log("Spotify Auth Debug:", {
    clientId: CLIENT_ID,
    redirectUri: redirectUri,
    currentOrigin: window.location.origin,
    port: window.location.port,
  });

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: "true",
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  console.log("Full Auth URL:", authUrl);

  return authUrl;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://127.0.0.1:5174/callback",
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Token exchange error:", errorData);
    throw new Error("Failed to exchange code for token");
  }

  return response.json();
};

// Refresh Spotify access token
export const refreshSpotifyToken = async (refreshToken) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
};

// Get current Spotify user profile
export const getSpotifyUserProfile = async () => {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) {
    throw new Error("Please connect your Spotify account first");
  }

  try {
    const response = await fetch(`${SPOTIFY_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear stored tokens
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_token_expiry");
        throw new Error(
          "Spotify session expired. Please reconnect your account."
        );
      }
      throw new Error(`Failed to get user profile: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching Spotify user profile:", error);
    throw new Error(
      error.message || "Failed to load Spotify profile. Please try again."
    );
  }
};

// Get user's Spotify playlists
export const getSpotifyPlaylists = async (limit = 20, offset = 0) => {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) {
    throw new Error("Please connect your Spotify account to view playlists");
  }

  try {
    const response = await fetch(
      `${SPOTIFY_URL}/me/playlists?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_token_expiry");
        throw new Error(
          "Spotify session expired. Please reconnect your account."
        );
      }
      throw new Error(`Failed to get playlists: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching Spotify playlists:", error);
    throw new Error(
      error.message || "Failed to load Spotify playlists. Please try again."
    );
  }
};

export const getAlbum = (params = {}) => {
  const {
    q = "kita usahakan lagi",
    type = "track",
    limit = 20,
    offset = 20,
  } = params;

  return fetch(
    `${SPOTIFY_URL}/search?q=${q}&type=${type}&limit=${limit}&offset=${offset}`,
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

export const searchSpotify = (query, type = "track", limit = 20) => {
  const token = accessToken();
  if (!token) {
    throw new Error("No access token available");
  }

  const searchParams = new URLSearchParams({
    q: query,
    type: type,
    limit: limit.toString(),
  });

  return fetch(`${SPOTIFY_URL}/search?${searchParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Spotify search failed:", error);
      throw new Error("Failed to search Spotify. Please try again.");
    });
};

// Legacy client credentials authentication (for public data only)
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

// Check if user is connected to Spotify
export const isSpotifyConnected = () => {
  const token = localStorage.getItem("spotify_access_token");
  const expiry = localStorage.getItem("spotify_token_expiry");

  if (!token || !expiry) {
    return false;
  }

  return Date.now() < parseInt(expiry);
};

// Connect to Spotify (redirect to authorization)
export const connectToSpotify = () => {
  window.location.href = getSpotifyAuthUrl();
};

// Disconnect from Spotify
export const disconnectFromSpotify = () => {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expiry");
  localStorage.removeItem("spotify_user_profile");
};

// Generic Spotify Web API fetch function
export const fetchWebApi = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("spotify_access_token");
  if (!token) {
    throw new Error(
      "Please connect your Spotify account to access this feature"
    );
  }

  try {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method,
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      let errorMessage = `Spotify API error: ${res.status}`;

      try {
        const errorData = await res.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        // If error response is not JSON, use status text
        errorMessage = res.statusText || errorMessage;
      }

      if (res.status === 401) {
        // Token expired, clear stored tokens
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_token_expiry");
        throw new Error(
          "Spotify session expired. Please reconnect your account."
        );
      } else if (res.status === 403) {
        throw new Error(
          "Access denied. You may need additional Spotify permissions."
        );
      } else if (res.status === 429) {
        throw new Error(
          "Too many requests to Spotify. Please wait a moment and try again."
        );
      }

      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    console.error(`Spotify API error for ${endpoint}:`, error);
    throw error;
  }
};

// Get user's top tracks
export const getTopTracks = async (timeRange = "long_term", limit = 5) => {
  try {
    const response = await fetchWebApi(
      `v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      "GET"
    );
    return response.items || [];
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw new Error("Failed to fetch top tracks");
  }
};

// Get user's top artists
export const getTopArtists = async (timeRange = "long_term", limit = 5) => {
  try {
    const response = await fetchWebApi(
      `v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      "GET"
    );
    return response.items || [];
  } catch (error) {
    console.error("Error fetching top artists:", error);
    throw new Error("Failed to fetch top artists");
  }
};

// Get user's recently played tracks
export const getRecentlyPlayed = async (limit = 10) => {
  try {
    const response = await fetchWebApi(
      `v1/me/player/recently-played?limit=${limit}`,
      "GET"
    );
    return response.items || [];
  } catch (error) {
    console.error("Error fetching recently played:", error);
    throw new Error("Failed to fetch recently played tracks");
  }
};

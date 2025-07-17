import { getBaseUrl, getAuthToken } from "./api.js";
import { checkResponse } from "./response.js";
import { accessApplication } from "./api";

// Get all playlists
export const getAllPlaylists = () => {
  // const token = getAuthToken();
  const token = localStorage.getItem("app");
  if (!token) {
    throw new Error("Please log in to view your playlists.");
  }

  return fetch(`${getBaseUrl()}/playlists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((err) => {
      console.error("Error fetching playlists:", err);

      if (err.message.includes("401")) {
        throw new Error("Your session has expired. Please log in again.");
      } else if (err.message.includes("403")) {
        throw new Error("You don't have permission to view playlists.");
      } else if (err.message.includes("500")) {
        throw new Error("Server error. Please try again in a few minutes.");
      } else if (err.message.includes("Network")) {
        throw new Error("Network error. Please check your connection.");
      }

      throw new Error(
        err.message || "Failed to load playlists. Please try again."
      );
    });
};

// Get playlist by ID
export const getPlaylistById = (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to view this playlist.");
  }

  return fetch(`${getBaseUrl()}/playlists/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((err) => {
      console.error("Error fetching playlist:", err);
      throw new Error("Failed to load playlist. Please try again.");
    });
};

// Create new playlist
export const createPlaylist = (playlistData) => {
<<<<<<< HEAD
  const token = accessApplication();
=======
  //const token = getAuthToken();
  const token = localStorage.getItem("app");
>>>>>>> 74370f39ffff626b477b9240ed04e464d5415270
  if (!token) {
    throw new Error("You must be logged in to create a playlist.");
  }

  return fetch(`${getBaseUrl()}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playlistData),
  }).then(checkResponse);
};

// Update playlist
export const updatePlaylist = (id, playlistData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to update a playlist.");
  }

  return fetch(`${getBaseUrl()}/playlists/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playlistData),
  })
    .then(checkResponse)
    .catch((err) => {
      console.error("Error updating playlist:", err);
      throw new Error("Failed to update playlist. Please try again.");
    });
};

// Delete playlist
export const deletePlaylist = (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to delete a playlist.");
  }

  return fetch(`${getBaseUrl()}/playlists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((err) => {
      console.error("Error deleting playlist:", err);
      throw new Error("Failed to delete playlist. Please try again.");
    });
};

// Like playlist
export const likePlaylist = (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to like a playlist.");
  }

  return fetch(`${getBaseUrl()}/playlists/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((err) => {
      console.error("Error liking playlist:", err);
      throw new Error("Failed to like playlist. Please try again.");
    });
};

// Unlike playlist
export const unlikePlaylist = (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to unlike a playlist.");
  }

  return fetch(`${getBaseUrl()}/playlists/${id}/unlike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(checkResponse)
    .catch((err) => {
      console.error("Error unliking playlist:", err);
      throw new Error("Failed to unlike playlist. Please try again.");
    });
};

import { BASE_URL_BACKEND } from "./api";
import { checkResponse } from "./response";
import { accessApplication } from "./api";

export const createUser = ({ name, password, email, avatar }) => {
  return fetch(`${BASE_URL_BACKEND}/signup`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name, password, email, avatar }),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Create user request failed:", error);
      throw error;
    });
};

export const loginUser = ({ email, password }) => {
  return fetch(`${BASE_URL_BACKEND}/signin`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Login request failed:", error);
      throw error;
    });
};

export const currencyUser = () => {
  return fetch(`${BASE_URL_BACKEND}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessApplication()}`,
    },
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Get current user request failed:", error);
      throw error;
    });
};

export const updateUser = ({ name, email, avatar }) => {
  return fetch(`${BASE_URL_BACKEND}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${accessApplication()}`,
    },
    body: JSON.stringify({ name, email, avatar }),
  })
    .then(checkResponse)
    .catch((error) => {
      console.error("Update user request failed:", error);
      throw error;
    });
};

export const logoutUser = () => {
  // Clear tokens from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("app");

  // Return a resolved promise for consistency with other user functions
  return Promise.resolve({ message: "Logged out successfully" });
};

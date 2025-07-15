import { BASE_URL_BACKEND } from "./api";
import { checkResponse } from "./response";
import { accessApplication } from "./api";

export const createUser = ({ name, password, email, avatar }) => {
  console.log("Attempting signup to:", `${BASE_URL_BACKEND}/signup`);
  console.log("Environment mode:", import.meta.env?.MODE);

  return fetch(`${BASE_URL_BACKEND}/signup`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name, password, email, avatar }),
  })
    .then(async (response) => {
      console.log("Signup response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Signup error response body:", errorText);

        if (response.status === 405) {
          throw new Error(
            "Signup endpoint not available. Please check if the backend server is running and accessible."
          );
        }
      }

      return checkResponse(response);
    })
    .catch((error) => {
      console.error("Create user request failed:", error);

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Cannot connect to the backend server. Please check your internet connection and try again."
        );
      }

      throw error;
    });
};

export const loginUser = ({ email, password }) => {
  console.log("Attempting login to:", `${BASE_URL_BACKEND}/signin`);
  console.log("Environment mode:", import.meta.env?.MODE);

  return fetch(`${BASE_URL_BACKEND}/signin`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(async (response) => {
      console.log("Login response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Login error response body:", errorText);

        if (response.status === 405) {
          throw new Error(
            "Login endpoint not available. Please check if the backend server is running and accessible."
          );
        }
      }

      return checkResponse(response);
    })
    .catch((error) => {
      console.error("Login request failed:", error);

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Cannot connect to the backend server. Please check your internet connection and try again."
        );
      }

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

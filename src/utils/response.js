export const checkResponse = (res) => {
  if (!res.ok) {
    let errorMessage = `HTTP error! Status: ${res.status}`;

    try {
      const errorData = res.json();

      // Handle different types of API error responses
      if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error_description) {
        errorMessage = errorData.error_description;
      }
    } catch (parseError) {
      // If response is not JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }

    // Map common HTTP status codes to user-friendly messages
    switch (res.status) {
      case 400:
        errorMessage = errorMessage.includes("redirect")
          ? "Invalid Spotify app configuration. Please check redirect URI settings."
          : `Bad request: ${errorMessage}`;
        break;
      case 401:
        errorMessage = "Authentication failed. Please log in again.";
        break;
      case 403:
        errorMessage = "You do not have permission to perform this action.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 429:
        errorMessage = "Too many requests. Please wait a moment and try again.";
        break;
      case 500:
        errorMessage = "Server error. Please try again later.";
        break;
      case 503:
        errorMessage =
          "Service temporarily unavailable. Please try again later.";
        break;
      default:
        errorMessage = `Error ${res.status}: ${errorMessage}`;
    }

    throw new Error(errorMessage);
  }
  return res.json();
};

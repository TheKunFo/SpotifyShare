import { useEffect, useState } from "react";
import ModalFormInput from "../ModalFormInput/ModalFormInput";
import "./SignIn.css";
import { currencyUser, loginUser } from "../../utils/user";

export default function SignIn({
  isOpen,
  onClose,
  errors,
  setErrors,
  saving,
  setSaving,
  setUser,
  setIsLogging,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (fieldName, value) => {
    let error = "";

    if (fieldName === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email format";
      }
    }

    if (fieldName === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  //Make still log in
  useEffect(() => {
    const token = localStorage.getItem("app");
    console.log(token, localStorage);

    if (token) {
      currencyUser(token)
        .then((userData) => {
          setIsLogging(true);
          setUser(userData.data);
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          setIsLogging(false);
          setUser({});
          localStorage.removeItem("app");

          // Session expired - will be shown in error state instead
          setErrors({
            general: "Your session has expired. Please log in again.",
          });
        });
    }
  }, [setIsLogging, setUser, setErrors]);

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    if (validateAll()) {
      setSaving("Saving ...");
      loginUser({ email, password })
        .then((res) => {
          localStorage.setItem("app", res.token);
          return currencyUser();
        })
        .then((response) => {
          setUser(response.data);
          console.log("Successfully Login : ", response.data);
          setIsLogging(true);

          // Close modal on successful login
          setSaving(null);
          onClose();
          setSuccessMessage("Successfully logged in!");
        })
        .catch((err) => {
          console.error("Login error:", err);

          // Use error state for user-friendly error messages
          let errorMessage = "Login failed. Please try again.";

          if (
            err.message.includes("401") ||
            err.message.includes("Unauthorized")
          ) {
            errorMessage = "Invalid email or password.";
          } else if (
            err.message.includes("400") ||
            err.message.includes("Bad Request")
          ) {
            errorMessage = "Please check your email and password.";
          } else if (
            err.message.includes("500") ||
            err.message.includes("Internal Server Error")
          ) {
            errorMessage = "Server error. Please try again later.";
          } else if (
            err.message.includes("NetworkError") ||
            err.message.includes("Failed to fetch")
          ) {
            errorMessage = "Network error. Please check your connection.";
          }

          // Show error via error state
          setErrors({ general: errorMessage });
          setSaving("Login Failed");

          // Reset saving state after 3 seconds
          setTimeout(() => {
            setSaving(null);
          }, 3000);
        })
        .finally(() => {
          // Only close on success, not on error
        });
    }
  };

  const validateAll = () => {
    validateField("email", email);
    validateField("password", password);

    return !errors.email && !errors.password;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateField("email", value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validateField("password", value);
  };

  return (
    <ModalFormInput
      isOpen={isOpen}
      onClose={onClose}
      title="Login"
      classForm="login__form"
      onSubmit={handleSubmitSignIn}
      classButton="login__button"
      titleButton={saving ?? "Login"}
    >
      {errors.general && (
        <div className="form__group">
          <span
            className="error"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            {errors.general}
          </span>
        </div>
      )}
      {successMessage && (
        <div className="form__group">
          <span
            className="success"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "1rem",
              color: "green",
            }}
          >
            {successMessage}
          </span>
        </div>
      )}
      <div className="form__group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form__group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          minLength="6"
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
    </ModalFormInput>
  );
}

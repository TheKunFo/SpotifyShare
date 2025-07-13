import { useState } from "react";
import ModalFormInput from "../ModalFormInput/ModalFormInput";
import "./SignUp.css";
import { createUser } from "../../utils/user";

export default function SignUp({
  isOpen,
  onClose,
  errors,
  setErrors,
  saving,
  setSaving,
}) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    avatar: "",
  });

  const handleSubmitSignUp = (e) => {
    e.preventDefault();
    if (validateAll()) {
      setSaving("Saving ...");
      createUser({
        email: form.email,
        password: form.password,
        name: form.name,
        avatar: form.avatar,
      })
        .then((response) => {
          console.log("Successfully create account", response.data);
          setSaving("Account Created");

          // Close modal on successful signup
          setTimeout(() => {
            setSaving(null);
            onClose();
          }, 1500);
        })
        .catch((err) => {
          console.error("Signup error:", err);

          // Set user-friendly error messages
          let errorMessage = "Signup failed. Please try again.";

          if (err.message.includes("409") || err.message.includes("Conflict")) {
            errorMessage =
              "This email is already registered. Please use a different email.";
          } else if (
            err.message.includes("400") ||
            err.message.includes("Bad Request")
          ) {
            errorMessage = "Please check all fields and try again.";
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

          // Set the error message for display
          setErrors((prev) => ({ ...prev, general: errorMessage }));
          setSaving("Signup Failed");

          // Reset saving state after 3 seconds
          setTimeout(() => {
            setSaving(null);
          }, 3000);
        });
    }
  };

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
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters";
      }
    }

    if (fieldName === "name") {
      if (!value) {
        error = "Name is required";
      }
    }

    if (fieldName === "avatar") {
      if (!value) {
        error = "Avatar URL is required";
      } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value)) {
        error = "Invalid image URL";
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const validateAll = () => {
    const allFields = ["email", "password", "name", "avatar"];
    allFields.forEach((field) => validateField(field, form[field]));
    return allFields.every((field) => !errors[field]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  return (
    <ModalFormInput
      isOpen={isOpen}
      onClose={onClose}
      title="Sign Up"
      classForm="signup__form"
      classButton="signup__button"
      titleButton={saving ?? "Sign Up"}
      onSubmit={handleSubmitSignUp}
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
      <div className="form__group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form__group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form__group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          minLength="8"
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form__group">
        <label>Avatar URL</label>
        <input
          type="url"
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          placeholder="Enter avatar image URL"
          required
        />
        {errors.avatar && <span className="error">{errors.avatar}</span>}
      </div>
    </ModalFormInput>
  );
}

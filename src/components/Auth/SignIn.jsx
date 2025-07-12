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
          console.error("Token invalid or expired:", err);
          setIsLogging(false);
          setUser({});
          localStorage.removeItem("app");
        });
    }
  }, []);

  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    if (validateAll()) {
      setSaving("Saving ...");
      loginUser({ email, password })
        .then((res) => {
          localStorage.setItem("app", res.token);
          currencyUser().then((response) => {
            setUser(response.data);
            console.log("Succeffully Login : ", response.data);
            setIsLogging(true);
          });
        })
        .catch((err) => {
          console.log("Response Error : " + err);
          setSaving("Fail");
        })
        .finally(() => {
          setSaving(null);
          onClose();
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
      <div className="form__group">
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
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
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>
    </ModalFormInput>
  );
}

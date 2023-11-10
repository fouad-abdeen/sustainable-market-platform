import "./ResetPassword.css";
import Visible from "../../assets/icon-visible.png";
import { FormEvent, useState } from "react";
import { authApi } from "../../api-helpers";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setMessage("Password and its confirmation do not match.");
      return;
    }

    try {
      const token = window.location.href.split("?token=").pop() ?? "";

      await authApi.resetPassword({ token, password });

      setPassword("");
      setPasswordConfirmation("");
      setMessage("Password reset successfully!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="request-form-container">
      <h2>Reset your Password</h2>
      <p>Please enter your new password.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Password:</label>
        <div className="password-reset-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
            <img
              src={Visible}
              alt="Show Password"
              className={`visible ${showPassword ? "icon" : ""}`}
            />
          </span>
        </div>

        <label htmlFor="passwordConfirmation">Password Confirmation:</label>
        <div className="password-reset-field">
          <input
            type={showPasswordConfirmation ? "text" : "password"}
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
          >
            <img
              src={Visible}
              alt="Show Password"
              className={`visible ${showPasswordConfirmation ? "icon" : ""}`}
            />
          </span>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default ResetPassword;

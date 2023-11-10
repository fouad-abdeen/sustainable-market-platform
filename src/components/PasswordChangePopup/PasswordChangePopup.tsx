import "./PasswordChangePopup.css";
import Visible from "../../assets/icon-visible.png";
import React, { useState } from "react";
import { authApi } from "../../api-helpers";
import { useNavigate } from "react-router-dom";

const PasswordChangePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);
  const [terminateAllSessions, setTerminateAllSessions] = useState(false);

  const handleChangePassword = async () => {
    const accessToken = localStorage.getItem("accessToken") as string;

    try {
      if (newPassword !== newPasswordConfirmation) {
        alert("New password and its confirmation do not match.");
        return;
      }

      if (!confirm("Are you sure you want to change your password?")) {
        return;
      }

      const response = await authApi.updatePassword(
        { currentPassword, newPassword, terminateAllSessions },
        accessToken,
      );

      if (!response.status) {
        throw new Error("You have to be logged in to change your password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");

      if (terminateAllSessions) {
        navigate("/signin");
      }

      onClose();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="password-change-popup">
      <h2>Change Password</h2>
      <div className="form-group password-input-container">
        <label htmlFor="currentPassword">Current Password</label>
        <input
          type={showCurrentPassword ? "text" : "password"}
          id="currentPassword"
          className="password-input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <span
          className="show-password-button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <img
            src={Visible}
            alt="Show Password"
            className={`visible ${showCurrentPassword ? "icon" : ""}`}
          />
        </span>
      </div>
      <div className="form-group password-input-container">
        <label htmlFor="newPassword ">New Password</label>
        <input
          type={showNewPassword ? "text" : "password"}
          id="newPassword"
          className="password-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <span className="show-password-button" onClick={() => setShowNewPassword(!showNewPassword)}>
          <img
            src={Visible}
            alt="Show Password"
            className={`visible ${showNewPassword ? "icon" : ""}`}
          />
        </span>
      </div>
      <div className="form-group password-input-container">
        <label htmlFor="newPasswordConfirmation">New Password Confirmation</label>
        <input
          type={showNewPasswordConfirmation ? "text" : "password"}
          id="newPasswordConfirmation"
          className="password-input"
          value={newPasswordConfirmation}
          onChange={(e) => setNewPasswordConfirmation(e.target.value)}
          required
        />
        <span
          className="show-password-button"
          onClick={() => setShowNewPasswordConfirmation(!showNewPasswordConfirmation)}
        >
          <img
            src={Visible}
            alt="Show Password"
            className={`visible ${showNewPasswordConfirmation ? "icon" : ""}`}
          />
        </span>
      </div>
      <div className="form-group">
        <label htmlFor="terminateAllSessions">Log out of all devices including this one: </label>
        <input
          type="checkbox"
          id="terminateAllSessions"
          checked={terminateAllSessions}
          onChange={(e) => setTerminateAllSessions(e.target.checked)}
        />
      </div>
      <div className="form-group">
        <button onClick={handleChangePassword}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PasswordChangePopup;

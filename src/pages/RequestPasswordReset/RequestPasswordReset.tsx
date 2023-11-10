import "./RequestPasswordReset.css";
import { FormEvent, useState } from "react";
import { authApi } from "../../api-helpers";

function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await authApi.sendPasswordResetLink(email);

      setEmail("");
      setMessage("Password reset email sent. Check your inbox.");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="request-form-container">
      <h2>Password Reset Request</h2>
      <p>Please enter your email address, and we'll send you a password reset link.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RequestPasswordReset;

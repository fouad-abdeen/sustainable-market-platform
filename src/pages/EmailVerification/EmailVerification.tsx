import { useEffect, useState } from "react";
import "./EmailVerification.css";
import { authApi } from "../../api-helpers";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState<string>("pending");

  useEffect(() => {
    (async () => {
      const token = window.location.search.split("?token=").pop();

      if (!token) {
        alert("Error: Invalid verification link");
      }

      try {
        const response = await authApi.verifyEmail(token as string);

        setVerificationStatus(response.status);
      } catch (error) {
        setVerificationStatus("error");
        setTimeout(() => {
          alert(error);
        }, 500);
      }
    })();
  }, []);

  return (
    <div className="email-verification">
      {verificationStatus === "success" ? (
        <div className="verification-success">
          <h2>Email Verification Successful</h2>
          <p>Your email has been successfully verified.</p>
          <p>You can now access all features of our platform.</p>
        </div>
      ) : verificationStatus === "error" ? (
        <div className="verification-error">
          <h2>Email Verification Failed</h2>
          <p>There was an error verifying your email.</p>
          <p>Please contact us for assistance.</p>
        </div>
      ) : (
        <div className="verification-pending">
          <h2>Requesting Email Verification</h2>
          <p>Please wait while we verify your email address.</p>
          <p>This may take a moment.</p>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

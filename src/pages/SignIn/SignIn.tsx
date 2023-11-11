import "./SignIn.css";
import Visible from "../../assets/icon-visible.png";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi, refreshAccessToken } from "../../api-helpers";

import { UserContext } from "../../contexts/UserContext";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    (async () => {
      try {
        const authenticated = await refreshAccessToken(
          localStorage.getItem("accessToken") as string,
          localStorage.getItem("refreshToken") as string
        );
        if (authenticated) navigate("/");
      } catch (error) {
        return;
      }
    })();
  }, []);

  const handleSignin = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      const response = await authApi.signin({ email, password });

      if (!response.data) {
        throw new Error("Server is not responding. Please try again later.");
      }

      const { userInfo } = response.data;

      setUser(userInfo);

      const userProfile = { ...userInfo.profile };

      Object.keys(userProfile).forEach((key) => {
        if (typeof (userProfile as any)[key] === "object") {
          delete (userProfile as any)[key];
        }
      });

      const { accessToken, refreshToken } = response.data.tokens;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("previouslyAuthenticated", "true");

      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="new-user">
          New To Food Grid?
          <Link to="/signup">
            {" "}
            <span className="sign-up-link">Sign Up</span>
          </Link>
        </div>
        <form>
          <h2>Welcome back to Sustainable Market</h2>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              className="form-input"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-group password-input-container">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-input password-input"
              name="password"
              placeholder="password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <span className="show-password-button" onClick={togglePasswordVisibility}>
              <img
                src={Visible}
                alt="Show Password"
                className={`visible ${showPassword ? "icon" : ""}`}
              />
            </span>
            <Link to="/request-password-reset" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
          <button className="form-input submit-button" type="submit" onClick={handleSignin}>
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
export default SignIn;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import backgroundImg from "../../assets/Nodado.jpg";
import Logo from "../../assets/Nodado.jfif";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const urlAPI = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if already logged in
    const verify = async () => {
      try {
        const response = await axios.get(`${urlAPI}/auth-api/protected`, {
          withCredentials: true,
        });
        if (response) {
          navigate("/dashboard/overview");
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    verify();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${urlAPI}/auth-api/login`,
        { username, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Show OTP modal instead of navigating directly
        setShowOTPModal(true);
      }
    } catch (error) {
      console.error("Login errors:", error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${urlAPI}/auth-api/verify-otp`,
        { username, otp },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Store the token and navigate to dashboard
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during OTP verifications");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section for logo and login */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <div className="mb-6">
          <img src={Logo} alt="Finance Department" className="h-23 w-auto" />
          <h1 className="text-2xl font-bold mb-4">HR3 Department</h1>
        </div>

        {/* Sign In Form */}
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-4 w-64">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          {error && <p className="text-red-500 text-md">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Right section with the background image */}
      <div
        className="w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* Additional content if needed */}
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold mb-4">OTP Verification</h2>
            <p className="mb-4">
              We've sent a 6-digit OTP to your email. Please enter it below:
            </p>

            <form onSubmit={handleOTPVerification}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                required
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
                <button
                  type="button"
                  className="text-gray-500 px-4 py-2 rounded hover:bg-gray-100"
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtp("");
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

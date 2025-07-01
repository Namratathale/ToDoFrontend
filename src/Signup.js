// Signup.js
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setSignupLoading(true);
    setSignupError("");

    try {
      const response = await fetch("https://todobackend-y2iq.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setSignupLoading(false);

      if (response.ok) {
        toast.success("🎉 Signup successful! Please login.");
        navigate("/login");
      } else {
        setSignupError(data.message || "Signup failed");
        toast.error(data.message || "Signup failed!");
      }
    } catch (error) {
      setSignupLoading(false);
      setSignupError("Network error. Please try again later.");
      console.error("Signup error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#94d6ff] via-[#fcd3ff] to-[#4e30a4] font-urbanist">
      <div className="max-w-md mx-auto p-10 rounded-3xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 animate-fadeIn text-white w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-lg">
          Create Your Account ✨
        </h2>
        {signupError && (
          <div className="mb-3 text-center text-red-300 font-semibold" aria-live="polite">
            {signupError}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup(username, password);
          }}
          className="space-y-5"
        >
          <div className="relative">
            <UserIcon className="w-5 h-5 my-4 mx-3 text-purple-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 py-3 w-full bg-white/10 text-white rounded-xl border border-white/20 placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:shadow-[0_0_15px_rgba(252,211,255,0.5)] transition-all"
              placeholder="Username"
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 my-4 mx-3  text-purple-300 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 py-3 w-full bg-white/10 text-white rounded-xl border border-white/20 placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:shadow-[0_0_15px_rgba(252,211,255,0.5)] transition-all"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="glow-button w-full mt-4 py-0 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white font-bold rounded-xl shadow-md hover:shadow-xl hover:brightness-110 transition-all duration-300"
          >
            {signupLoading ? "Signing up..." : "Signup"}
          </button>
        </form>
        <div className="mt-6 text-center text-white">
          Already have an account?{' '}
          <Link to="/login">
            <span className="text-blue-300 hover:underline font-semibold">
              Login
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
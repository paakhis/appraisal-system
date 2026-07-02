import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from "../../api/authApi";
import type { LoginResponse } from "../../interfaces/auth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const user: LoginResponse = await loginApi({ email, password });
      login(user);

      const role = user.role?.toUpperCase();
      if (role === "HR") {
        navigate("/hr");
      } else if (role === "MANAGER") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Login failed";
      if (msg === "BACKEND_DOWN") {
        alert("Backend is not reachable. Please start the Spring Boot server.");
      } else {
        alert("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#093769] via-[#092B5B] to-[#082050] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-8">

        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0E4CB7] text-3xl text-white">
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800">Elevate</h1>
          <p className="mt-2 text-gray-500">Employee Performance Management</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#0E4CB7] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#0E4CB7] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                className="h-4 w-4"
              />
              Remember Me
            </label>
            <button type="button" className="text-sm font-medium text-[#0E4CB7] hover:underline">
              Forgot Password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-lg bg-[#0E4CB7] p-3 font-semibold text-white transition hover:bg-[#0A3A8A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-[#F4F8FF] p-4 text-sm text-gray-600">
          <p className="font-semibold">Demo Accounts</p>
          <p>HR: hr@company.com</p>
          <p>Manager: manager@company.com</p>
          <p>Employee: employee@company.com</p>
        </div>

      </div>
    </div>
  );
}
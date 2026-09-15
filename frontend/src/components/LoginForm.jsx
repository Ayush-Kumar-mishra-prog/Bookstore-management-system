import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Eye, EyeOffIcon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import LoginLeftSide from "./LoginLeftSide";
import { apiFetch } from "../api";
import { validateEmail } from "../utils/authValidation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password, role: "admin" }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login successful");
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginLeftSide />
      <div className="flex flex-1 items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <Link
            to="/login"
            className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-700"
          >
            <ArrowLeftIcon size={16} /> Back to portals
          </Link>

          <div className="mb-8">
            <h1 className="font-heading text-2xl font-medium text-zinc-800 sm:text-3xl">
              Admin Portal
            </h1>
            <p className="font-subheading mt-2 text-sm text-slate-500 sm:text-base">
              Login to manage books, inventory, and orders.
            </p>
          </div>

          {error ? (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
              {error}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="********"
                  className="pr-11"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-indigo-600 py-2.5 font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-40"
            >
              {loading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

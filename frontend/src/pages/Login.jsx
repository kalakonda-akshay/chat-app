import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/chat" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const loginAsDemo = async () => {
    setForm({ email: "demo@example.com", password: "password123" });
    setSubmitting(true);
    setError("");

    try {
      await login({ email: "demo@example.com", password: "password123" });
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,#155e75,#0f172a_38%,#050816)] px-4 text-white">
      <form onSubmit={handleSubmit} className="glass w-full max-w-md rounded-2xl p-8 animate-floatIn">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-400 text-slate-950 shadow-glow">
            <MessageCircle size={26} />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-slate-300">Sign in to Nebula Chat</p>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-200">{error}</p>}

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-teal-300"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-teal-300"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>

        <button
          className="w-full rounded-xl bg-teal-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>

        <button
          className="mt-3 w-full rounded-xl border border-teal-300/40 bg-teal-300/10 px-4 py-3 font-semibold text-teal-100 transition hover:bg-teal-300/20 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          onClick={loginAsDemo}
          type="button"
        >
          Login as Demo
        </button>

        <p className="mt-6 text-center text-sm text-slate-300">
          New here?{" "}
          <Link className="font-semibold text-teal-300 hover:text-teal-200" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;

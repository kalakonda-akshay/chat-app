import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", avatar: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/chat" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_right,#0f766e,#0f172a_42%,#050816)] px-4 text-white">
      <form onSubmit={handleSubmit} className="glass w-full max-w-md rounded-2xl p-8 animate-floatIn">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-glow">
            <Sparkles size={25} />
          </span>
          <div>
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-sm text-slate-300">Start chatting in real time</p>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-200">{error}</p>}

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-slate-300">Username</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-cyan-300"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-cyan-300"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-slate-300">Avatar URL</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-cyan-300"
            value={form.avatar}
            onChange={(event) => setForm({ ...form, avatar: event.target.value })}
            placeholder="Optional image link"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <input
            className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none transition focus:border-cyan-300"
            type="password"
            minLength={6}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>

        <button
          className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Creating..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already registered?{" "}
          <Link className="font-semibold text-cyan-200 hover:text-white" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;

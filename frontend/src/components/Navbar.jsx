import { LogOut, MessageCircle, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ soundEnabled, setSoundEnabled }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-400 text-slate-950">
          <MessageCircle size={22} />
        </span>
        <div>
          <h1 className="text-base font-bold leading-tight">Nebula Chat</h1>
          <p className="text-xs text-slate-400">Signed in as {user?.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          onClick={() => setSoundEnabled((value) => !value)}
          title={soundEnabled ? "Disable sound notifications" : "Enable sound notifications"}
          type="button"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-red-500/20 hover:text-red-100"
          onClick={logout}
          title="Logout"
          type="button"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

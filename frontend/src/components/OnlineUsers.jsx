const OnlineUsers = ({ onlineUsers, setActiveChat, users }) => {
  const visibleUsers = users.filter((user) => onlineUsers.includes(user._id)).slice(0, 8);

  if (!visibleUsers.length) {
    return (
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Online now</h2>
        <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-400">
          No contacts online yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Online now</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {visibleUsers.map((user) => (
          <button
            className="shrink-0 text-center"
            key={user._id}
            onClick={() => setActiveChat({ ...user, type: "user" })}
            title={user.username}
            type="button"
          >
            {user.avatar ? (
              <img className="h-12 w-12 rounded-2xl object-cover ring-2 ring-emerald-400" src={user.avatar} alt={user.username} />
            ) : (
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400/20 font-bold text-emerald-200 ring-2 ring-emerald-400">
                {user.username?.[0]?.toUpperCase()}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;

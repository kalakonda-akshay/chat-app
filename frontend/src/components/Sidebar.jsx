import { useState } from "react";
import { Hash, Plus, Search } from "lucide-react";
import RoomList from "./RoomList.jsx";
import OnlineUsers from "./OnlineUsers.jsx";

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const Sidebar = ({
  activeChat,
  createRoom,
  joinRoom,
  leaveRoom,
  onlineUsers,
  rooms,
  setActiveChat,
  unread,
  users
}) => {
  const [query, setQuery] = useState("");
  const filteredUsers = users.filter((user) =>
    `${user.username} ${user.email}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="flex min-h-0 flex-col border-r border-white/10 bg-slate-950/50 max-[900px]:h-[46vh] max-[900px]:border-r-0 max-[900px]:border-b">
      <div className="border-b border-white/10 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-300"
            placeholder="Search users"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 scrollbar-thin">
        <OnlineUsers users={users} onlineUsers={onlineUsers} setActiveChat={setActiveChat} />

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Direct messages</h2>
          </div>
          <div className="space-y-2">
            {filteredUsers.map((chatUser) => {
              const key = `user:${chatUser._id}`;
              const selected = activeChat?.type === "user" && activeChat._id === chatUser._id;

              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    selected ? "bg-teal-400/15 text-teal-100" : "hover:bg-white/[0.06]"
                  }`}
                  key={chatUser._id}
                  onClick={() => setActiveChat({ ...chatUser, type: "user" })}
                  type="button"
                >
                  <div className="relative">
                    {chatUser.avatar ? (
                      <img className="h-11 w-11 rounded-xl object-cover" src={chatUser.avatar} alt={chatUser.username} />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-800 text-sm font-bold">
                        {initials(chatUser.username)}
                      </span>
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                        chatUser.online ? "bg-emerald-400" : "bg-slate-600"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{chatUser.username}</p>
                    <p className="truncate text-xs text-slate-400">{chatUser.online ? "Online" : chatUser.email}</p>
                  </div>
                  {unread[key] > 0 && (
                    <span className="grid min-w-6 place-items-center rounded-full bg-teal-300 px-2 py-1 text-xs font-bold text-slate-950">
                      {unread[key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Hash size={15} className="text-slate-500" />
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Rooms</h2>
            <Plus size={15} className="ml-auto text-slate-500" />
          </div>
          <RoomList
            activeChat={activeChat}
            createRoom={createRoom}
            joinRoom={joinRoom}
            leaveRoom={leaveRoom}
            rooms={rooms}
            setActiveChat={setActiveChat}
            unread={unread}
            users={users}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

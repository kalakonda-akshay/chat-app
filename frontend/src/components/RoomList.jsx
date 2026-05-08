import { useState } from "react";
import { LogOut, Users } from "lucide-react";

const RoomList = ({ activeChat, createRoom, joinRoom, leaveRoom, rooms, setActiveChat, unread, users }) => {
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (id) => {
    setSelectedMembers((members) =>
      members.includes(id) ? members.filter((memberId) => memberId !== id) : [...members, id]
    );
  };

  const submitRoom = async (event) => {
    event.preventDefault();
    if (!roomName.trim()) return;
    await createRoom(roomName.trim(), selectedMembers);
    setRoomName("");
    setSelectedMembers([]);
  };

  const submitJoin = async (event) => {
    event.preventDefault();
    if (!joinId.trim()) return;
    await joinRoom(joinId.trim());
    setJoinId("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submitRoom} className="rounded-xl border border-white/10 bg-white/5 p-3">
        <input
          className="mb-2 h-10 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm outline-none focus:border-cyan-300"
          placeholder="New room name"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
        />
        <div className="mb-3 grid max-h-24 gap-1 overflow-y-auto scrollbar-thin">
          {users.slice(0, 8).map((user) => (
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-xs text-slate-300 hover:bg-white/5" key={user._id}>
              <input
                checked={selectedMembers.includes(user._id)}
                className="accent-cyan-300"
                onChange={() => toggleMember(user._id)}
                type="checkbox"
              />
              {user.username}
            </label>
          ))}
        </div>
        <button className="w-full rounded-lg bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-200" type="submit">
          Create room
        </button>
      </form>

      <form onSubmit={submitJoin} className="flex gap-2">
        <input
          className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-teal-300"
          placeholder="Join by room ID"
          value={joinId}
          onChange={(event) => setJoinId(event.target.value)}
        />
        <button className="rounded-lg bg-white/10 px-3 text-sm font-semibold hover:bg-white/15" type="submit">
          Join
        </button>
      </form>

      <div className="space-y-2">
        {rooms.map((room) => {
          const key = `room:${room._id}`;
          const selected = activeChat?.type === "room" && activeChat._id === room._id;

          return (
            <div
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                selected ? "bg-cyan-300/15 text-cyan-100" : "hover:bg-white/[0.06]"
              }`}
              key={room._id}
            >
              <button
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => setActiveChat({ ...room, type: "room" })}
                type="button"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-800">
                  <Users size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{room.roomName}</span>
                  <span className="block truncate text-xs text-slate-400">{room.members?.length || 0} members</span>
                </span>
                {unread[key] > 0 && (
                  <span className="grid min-w-6 place-items-center rounded-full bg-cyan-300 px-2 py-1 text-xs font-bold text-slate-950">
                    {unread[key]}
                  </span>
                )}
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 opacity-0 transition hover:bg-red-500/15 hover:text-red-100 group-hover:opacity-100"
                onClick={() => leaveRoom(room._id)}
                title="Leave room"
                type="button"
              >
                <LogOut size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomList;

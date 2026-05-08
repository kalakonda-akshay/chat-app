import { useEffect, useRef, useState } from "react";
import { Hash, Send, Smile, Users } from "lucide-react";
import FileUpload from "./FileUpload.jsx";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

const emojis = ["😀", "😂", "😍", "🔥", "🎉", "👍", "🙏", "💬"];

const ChatWindow = ({ activeChat, currentUser, leaveRoom, messages, onSend, onTyping, typingLabel }) => {
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingLabel]);

  useEffect(() => {
    setContent("");
    setShowEmoji(false);
  }, [activeChat?._id]);

  const handleChange = (value) => {
    setContent(value);
    onTyping(true);

    window.clearTimeout(typingTimeout.current);
    typingTimeout.current = window.setTimeout(() => {
      onTyping(false);
    }, 900);
  };

  const submitMessage = (event) => {
    event.preventDefault();
    const text = content.trim();
    if (!text) return;
    onSend({ content: text, messageType: "text", fileUrl: "" });
    setContent("");
    setShowEmoji(false);
    onTyping(false);
  };

  const handleUploaded = (file) => {
    onSend({
      content: file.originalName,
      fileUrl: file.fileUrl,
      messageType: file.messageType
    });
  };

  if (!activeChat) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center p-6 text-center">
        <div className="max-w-sm">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-teal-400/15 text-teal-200">
            <Users size={32} />
          </div>
          <h2 className="text-xl font-bold">Choose a conversation</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pick a person or room from the sidebar to load chat history and start messaging instantly.
          </p>
        </div>
      </div>
    );
  }

  const title = activeChat.type === "room" ? activeChat.roomName : activeChat.username;
  const subtitle =
    activeChat.type === "room"
      ? `${activeChat.members?.length || 0} members`
      : activeChat.online
        ? "Online"
        : activeChat.email;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-teal-200">
            {activeChat.type === "room" ? <Hash size={20} /> : title?.[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold">{title}</h2>
            <p className="truncate text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
        {activeChat.type === "room" && (
          <button
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-red-500/15 hover:text-red-100"
            onClick={() => leaveRoom(activeChat._id)}
            type="button"
          >
            Leave
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(15,23,42,0.24),rgba(2,6,23,0.55))] px-4 py-5 scrollbar-thin sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble currentUser={currentUser} key={message._id} message={message} />
          ))}
          <TypingIndicator label={typingLabel} />
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={submitMessage} className="border-t border-white/10 bg-slate-950/55 p-3 sm:p-4">
        {showEmoji && (
          <div className="mx-auto mb-3 flex max-w-4xl flex-wrap gap-2 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl">
            {emojis.map((emoji) => (
              <button
                className="grid h-9 w-9 place-items-center rounded-lg text-xl transition hover:bg-white/10"
                key={emoji}
                onClick={() => setContent((value) => `${value}${emoji}`)}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="mx-auto flex max-w-4xl items-end gap-2">
          <FileUpload onUploaded={handleUploaded} />
          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            onClick={() => setShowEmoji((value) => !value)}
            title="Add emoji"
            type="button"
          >
            <Smile size={19} />
          </button>
          <textarea
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-5 outline-none transition focus:border-teal-300"
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitMessage(event);
              }
            }}
            placeholder={`Message ${title}`}
            rows={1}
            value={content}
          />
          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-400 text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!content.trim()}
            title="Send message"
            type="submit"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

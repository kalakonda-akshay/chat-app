import { CheckCheck, FileText } from "lucide-react";

const formatTime = (date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));

const MessageBubble = ({ currentUser, message }) => {
  const isMine = message.sender?._id === currentUser?._id;
  const bubbleClass = isMine
    ? "self-end rounded-br-sm bg-teal-400 text-slate-950"
    : "self-start rounded-bl-sm bg-white/10 text-slate-100";

  return (
    <article className={`flex max-w-[86%] flex-col rounded-2xl px-4 py-3 shadow-lg animate-floatIn sm:max-w-[68%] ${bubbleClass}`}>
      {!isMine && <p className="mb-1 text-xs font-bold text-cyan-200">{message.sender?.username}</p>}

      {message.messageType === "image" && message.fileUrl && (
        <a href={message.fileUrl} rel="noreferrer" target="_blank">
          <img className="mb-2 max-h-72 rounded-xl object-cover" src={message.fileUrl} alt={message.content || "Uploaded image"} />
        </a>
      )}

      {message.messageType === "file" && message.fileUrl && (
        <a
          className={`mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
            isMine ? "bg-slate-950/10" : "bg-slate-950/40"
          }`}
          href={message.fileUrl}
          rel="noreferrer"
          target="_blank"
        >
          <FileText size={18} />
          <span className="truncate">{message.content || "Download file"}</span>
        </a>
      )}

      {message.content && message.messageType === "text" && <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>}

      <div className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${isMine ? "text-slate-800/75" : "text-slate-400"}`}>
        <span>{formatTime(message.createdAt)}</span>
        {isMine && (
          <span title={message.seen ? "Seen" : "Delivered"}>
            <CheckCheck size={14} className={message.seen ? "text-blue-700" : ""} />
          </span>
        )}
      </div>
    </article>
  );
};

export default MessageBubble;

const TypingIndicator = ({ label }) => {
  if (!label) return null;

  return (
    <div className="flex self-start rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-sm text-slate-300">
      <span className="mr-2">{label} is typing</span>
      <span className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-slate-300" />
        <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-slate-300 [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-slate-300 [animation-delay:240ms]" />
      </span>
    </div>
  );
};

export default TypingIndicator;

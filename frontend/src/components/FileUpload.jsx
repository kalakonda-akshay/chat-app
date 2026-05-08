import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import api from "../api/axios.js";

const FileUpload = ({ onUploaded }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onUploaded(data);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <>
      <input className="hidden" onChange={handleFile} ref={inputRef} type="file" />
      <button
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        title={uploading ? "Uploading file" : "Attach file"}
        type="button"
      >
        <Paperclip size={19} className={uploading ? "animate-pulse" : ""} />
      </button>
    </>
  );
};

export default FileUpload;

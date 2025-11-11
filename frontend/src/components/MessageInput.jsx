import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { X, Image, Send, File } from "lucide-react"; // Added File icon for non-image media

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // New: Store the selected File object
  const [mediaPreview, setMediaPreview] = useState(null); // For image previews; null for videos/files/audio
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const { sendMessages } = useChatStore();

  const detectEmotionFromBackend = async (messageText) => {
    try {
      const res = await fetch("/api/messages/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to detect emotion");
      }
      const data = await res.json();
      return data.emotion;
    } catch (error) {
      console.error("Error detecting emotion:", error);
      return "Neutral 😐"; // Fallback emotion
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !mediaFile) {
      console.log("⚠️ No valid message content, skipping send.");
      return;
    }

    console.log("🚀 Preparing to send message:", text);

    // Call backend for emotion detection (only if text is present)
    const emotion = text.trim()
      ? await detectEmotionFromBackend(text.trim())
      : null;
    console.log("📩 Detected Emotion:", emotion);

    try {
      await sendMessages({
        text: text.trim(),
        mediaFile, // Updated: Pass the File object (for FormData in store)
        emotion, // Optional: Include if needed in store/backend
      });
 // after sending , clear input fields
      setText("");
      setMediaFile(null);
      setMediaPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input

      // ✅ Refocus the input// this improves UX for rapid messaging // it simply keeps the cursor in the text input after sending
      if (textInputRef.current) { 
        textInputRef.current.focus();
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation: Check against allowed MIME types (matches store)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/avi",
      "audio/mpeg", // For MP3
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Only images, videos, audio, and common files are allowed."
      );
      return;
    }

    // Size check (matches store: 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large. Max size is 50MB.");
      return;
    }

    setMediaFile(file);

    // For images: Create preview; for others: No preview, just store file
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null); // No preview for videos/files/audio
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 w-full">
      {mediaFile && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaPreview ? (
              // Image preview
              <img
                src={mediaPreview}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700 dark:border-zinc-300 shadow-sm"
              />
            ) : (
              // File/video/audio indicator
              <div className="w-20 h-20 flex items-center justify-center bg-base-200 dark:bg-base-300 rounded-lg border border-zinc-700 dark:border-zinc-300 shadow-sm">
                <File size={24} className="text-base-content/60" />
                <span className="text-xs ml-1 truncate max-w-16">
                  {mediaFile.name}
                </span>
              </div>
            )}
            <button
              onClick={removeMedia}
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 p-1 rounded-full transition-colors"
              type="button"
            >
              <X className="size-3 text-white" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            ref={textInputRef}
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md bg-base-200 dark:bg-base-300 text-base-content dark:text-base-content placeholder-base-content/50 dark:placeholder-base-content/70 border-base-content/20 dark:border-base-content/30 shadow-sm focus:shadow-md transition-shadow"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/*,audio/*,.pdf,.docx,.zip" // Updated: Includes videos, audio, and files
            className="hidden"
            ref={fileInputRef}
            onChange={handleMediaChange} // Updated: New handler
          />
          <button
            type="button"
            className={`flex btn btn-circle text-base-content/60 dark:text-base-content/80 hover:text-base-content dark:hover:text-primary transition-colors`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />{" "}
            {/* Could change to a more generic icon like File if preferred */}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle bg-base-300 dark:bg-primary text-base-content/60 dark:text-primary-content hover:bg-base-400 dark:hover:bg-primary-focus disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          disabled={!text.trim() && !mediaFile} // Updated: Check for mediaFile
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

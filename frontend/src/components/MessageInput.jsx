import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { X, Image, Send } from "lucide-react";
import Message from "../../../backend/src/models/message.model";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInptRef = useRef(null);
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
      return "Neutral 😐"; // fallback emotion
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) {
      console.log("⚠️ No valid message content, skipping send.");
      return;
    }

    console.log("🚀 Preparing to send message:", text);

    // Call backend for emotion detection
    const emotion = await detectEmotionFromBackend(text.trim());
    console.log("📩 Detected Emotion:", emotion);

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview || null,
        emotion, // Add detected emotion to the payload
      });

      setText("");
      setImagePreview(null);
      if (fileInptRef.current) fileInptRef.current.value = "";
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInptRef.current) fileInptRef.current.value = "";
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-red-500 p-1 rounded-full"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md bg-base-200 text-base-content placeholder-base-content/50"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInptRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-base-content/60"
            }`}
            onClick={() => fileInptRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle text-base-content/60 hover:text-base-content"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

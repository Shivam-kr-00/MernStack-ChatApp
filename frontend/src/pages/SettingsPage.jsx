// Remove theme import
// import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
// Remove unnecessary imports
// import { useEffect } from "react";
// import { FiSun, FiMoon } from "react-icons/fi";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  // Remove theme state
  // const { theme, setTheme } = useThemeStore();

  // Remove theme debug
  // useEffect(() => {
  //   console.log("Settings page rendered with theme:", theme);
  // }, [theme]);

  // Remove theme handler
  // const handleThemeChange = (newTheme) => {
  //   console.log("Changing theme to:", newTheme);
  //   setTheme(newTheme);
  // };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl bg-gradient-to-br from-base-100 via-base-200 to-base-300 dark:from-base-300 dark:via-base-100 dark:to-base-200 animate-fadeIn">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .message-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .message-slide-in.sent {
          animation: slideInSent 0.6s ease-out forwards;
        }
        @keyframes slideInSent {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .typing-dots {
          display: inline-flex;
          gap: 4px;
        }
        .typing-dots span {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        .glassmorphism {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glow-on-hover {
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .glow-on-hover:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          transform: scale(1.05);
        }
        .input-glow:focus {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          border-color: rgba(59, 130, 246, 0.5);
        }
      `}</style>

      <div className="space-y-6">
        {/* Preview Section - Enhanced with Gradient and Animations */}
        <h3 className="text-lg font-semibold mb-3 text-center lg:text-left">
          Chat Preview
        </h3>
        <div className="rounded-2xl border border-base-300/50 overflow-hidden bg-gradient-to-br from-base-100 to-base-200 shadow-2xl glassmorphism animate-fadeIn">
          <div className="p-4 bg-base-200/50">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI - Enhanced */}
              <div className="bg-gradient-to-b from-base-100 to-base-200 rounded-2xl shadow-lg overflow-hidden border border-base-300/30">
                {/* Chat Header - Added Hover Lift */}
                <div className="px-4 py-3 border-b border-base-300/50 bg-gradient-to-r from-base-100 to-base-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-focus flex items-center justify-center text-primary-content font-medium shadow-md">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages - Added Slide-In Animations */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100/80">
                  {PREVIEW_MESSAGES.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSent ? "justify-end" : "justify-start"
                      } message-slide-in ${message.isSent ? "sent" : ""}`}
                      style={{ animationDelay: `${index * 0.2}s` }} // Staggered delay
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-2xl p-3 shadow-md transition-all duration-300 hover:shadow-lg
                          ${
                            message.isSent
                              ? "bg-gradient-to-r from-primary to-primary-focus text-primary-content"
                              : "bg-gradient-to-r from-base-200 to-base-300"
                          }
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${
                              message.isSent
                                ? "text-primary-content/70"
                                : "text-base-content/70"
                            }
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input - Added Glow and Typing Indicator */}
                <div className="p-4 border-t border-base-300/50 bg-gradient-to-r from-base-100 to-base-200">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10 rounded-xl input-glow transition-all duration-300"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                      aria-label="Message input preview"
                    />
                    {/* Typing Indicator */}
                    <div className="typing-dots text-base-content/50 mr-2">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <button
                      className="btn btn-primary h-10 min-h-0 rounded-xl glow-on-hover"
                      aria-label="Send message"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

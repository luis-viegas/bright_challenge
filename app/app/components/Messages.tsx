import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Heart,
  Smile,
  Frown,
  Meh,
  Zap,
  User,
  BrainCircuit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ShowPastry from "./ShowPastry";

const getEmotionIcon = (emotion: string | null) => {
  switch (emotion) {
    case "anxious":
    case "stressed":
      return <Frown className="w-4 h-4 text-destructive" />;
    case "happy":
    case "excited":
      return <Smile className="w-4 h-4 text-primary" />;
    case "grateful":
      return <Heart className="w-4 h-4 text-accent-foreground" />;
    case "neutral":
      return <Meh className="w-4 h-4 text-muted-foreground" />;
    case "relieved":
    default:
      return null;
  }
};

const getEmotionColor = (emotion: string | null) => {
  switch (emotion) {
    case "anxious":
    case "stressed":
      return "border-l-destructive bg-destructive/10";
    case "happy":
    case "excited":
      return "border-l-primary bg-primary/10";
    case "relieved":
    case "grateful":
      return "border-l-accent bg-accent/10";
    case "neutral":
      return "border-l-muted-foreground bg-muted/50";
    default:
      return "border-l-primary bg-primary/10";
  }
};

export function Messages({ messages, showEmotions }) {
  return (
    <div className="overflow-y-auto p-6 space-y-4 h-[600px] bg-card ">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex items-start gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback
                className={
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {message.role === "user" ? <User /> : "AI"}
              </AvatarFallback>
            </Avatar>

            <div
              className={`space-y-1 ${message.role === "user" ? "text-right" : ""}`}
            >
              <div
                className={`p-4 rounded-2xl border-l-4 ${
                  message.role === "user"
                    ? `bg-primary text-primary-foreground border-l-primary`
                    : `${getEmotionColor(message.emotion)} border-l-4`
                }`}
              >
                <p
                  className={`text-sm ${message.role === "user" ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {message.content}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 text-xs text-muted-foreground ${message.role === "user" ? "justify-end" : ""}`}
              >
                {showEmotions && (
                  <>
                    {message.annotations?.[0].emotion && (
                      <div className="flex items-center gap-1">
                        Answering with emotion:
                        {getEmotionIcon(message.annotations?.[0].emotion)}
                        <span className="capitalize">
                          {message.annotations?.[0].emotion}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

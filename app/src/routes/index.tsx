import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@ai-sdk/react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Messages } from "@/components/Messages";
import { generateResponse } from "./api.chat";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  const [showEmotions, setShowEmotions] = useState(true);

  const { messages, input, setInput, append, data } = useChat({
    api: "/api/chat",
    maxSteps: 20,
    fetch: (_url, options) => {
      const { messages } = JSON.parse(options!.body! as string);
      return generateResponse({
        data: {
          messages,
          historicalEmotions: messages
            .filter((msg) => msg.role === "assistant")
            .map((msg) => msg.annotations?.[0]?.emotionResults),
        },
      });
    },
  });

  return (
    <div className="h-min-screen flex flex-col bg-gradient-to-br from-muted/30 via-background to-muted/50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Bright Store
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This is a demo of a chat interface that is aware of the user's
            emotions and adapts its responses accordingly. You can interact with
            the chat by typing your messages below.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col mb-[100px]">
          <Card className=" flex-1 flex flex-col pt-0">
            <CardHeader className="border-b bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  Bright Chat
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="see-emotions"
                    checked={showEmotions}
                    onClick={() => setShowEmotions(!showEmotions)}
                  />
                  <Label htmlFor="see-emotions">See emotions</Label>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col ">
              {/* Messages Area */}
              <Messages
                messages={messages}
                showEmotions={showEmotions}
                data={data}
              />
              {/* Input Area */}
              <div className="border-t p-4">
                <form
                  className="flex items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    append({ content: input, role: "user" });
                    setInput("");
                  }}
                >
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Share your thoughts and feelings..."
                      className="pr-12 bg-input/30  focus:ring-primary"
                      autoFocus
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

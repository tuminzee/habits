import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const messages = [
    { id: 1, text: "This is work in progress", sender: "user" },
    { id: 2, text: "I'm working on it", sender: "other" },
    {
      id: 3,
      text: "Once it is live, we shall be able to group chat",
      sender: "user",
    },
  ];

  return (
    <div className="w-full">
      <div className="h-[calc(100vh-4rem)]">
        <div className="flex-1 h-[calc(100%-6rem)] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="border-t">
          <div className="p-4 flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

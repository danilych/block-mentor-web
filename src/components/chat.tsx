import { useEffect, useRef, useState } from "react";
import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { aiChatsService } from "@/services/aiChatsService";
import { aiChatsStore } from "@/stores/aiChatsStore";
import { EChatMessageRole, TChatMessage } from "@/types/aiChats";
import { usePrivy } from "@privy-io/react-auth";

const Chat = () => {
  const [message, setMessage] = useState("");
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const { selectedChat, isBotTyping, showEmptyChat, setSelectedChat, setIsBotTyping } = aiChatsStore();
  const { getAccessToken } = usePrivy();

  useEffect(() => {
    const initChat = async () => {
      const token = await getAccessToken();
      console.log(token);
      try {
        await aiChatsService.openChat("User");
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initChat();
  }, [getAccessToken]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);

  async function sendMessage(content: string, role:string) {
    console.log("Sending message...");
    const messageId = crypto.randomUUID();
    if (!content.length) return;

    const userMessage: TChatMessage = {
      senderType: EChatMessageRole.USER,
      content: content,
      id: messageId,
      createdAt: Date.now(),
      role: EChatMessageRole.USER
    };

    // Set user message immediately
    if (selectedChat) {
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, userMessage]
      });
    }

    setIsBotTyping(true);

    try {
      const token = await getAccessToken();
      const response = await fetch('https://api-production-a609.up.railway.app/api/messages', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          prompt:content,
          role: role,
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let resultString = "";

      const aiMessage: TChatMessage = {
        senderType: EChatMessageRole.AI,
        content: "",
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        role: EChatMessageRole.AI
      };

      const messageChunks: string[] = [];
      
      // Add AI message to chat
      if (selectedChat) {
        setSelectedChat({
          ...selectedChat,
          messages: [...selectedChat.messages, aiMessage]
        });
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done || !selectedChat) break;

        const messageChunk = decoder.decode(value, { stream: true });
        messageChunks.push(messageChunk);
        resultString += messageChunk;

        // Update AI message content
        setSelectedChat({
          ...selectedChat,
          messages: selectedChat.messages.map((msg: TChatMessage) =>
            msg.id === aiMessage.id
              ? { ...msg, content: resultString, chunks: messageChunks }
              : msg
          )
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      setIsBotTyping(false);
      return response;
    } catch (error) {
      setIsBotTyping(false);
      
      if (error instanceof Error) {
        if (error.message.includes("ThrottlerException")) {
          return;
        }
        console.error("Error while send message: ", error.message);
      }
    }
  }

  const handleKeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(message, EChatMessageRole.USER);
    }
  };

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
              {selectedChat?.messages && selectedChat.messages.length > 0 && !showEmptyChat ? (
                <div className="flex flex-col items-center text-sm">
                  {selectedChat.messages.map((msg: TChatMessage) => (
                    <Message key={msg.id} message={msg} />
                  ))}
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
                </div>
              ) : null}
              {showEmptyChat ? (
                <div className="py-10 relative w-full flex flex-col h-full">
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-full md:w-1/2 lg:w-1/3 xl:w-1/4"></div>
                  </div>
                  <h1 className="text-2xl font-semibold text-center mt-6">
                    How can I help you today?
                  </h1>
                </div>
              ) : null}
              {isBotTyping && (
                <div className="text-sm text-gray-500 italic p-4">
                  Assistant is typing...
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(EChatMessageRole.USER, message);
            }}
            className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
          >
            <div className="relative flex h-full flex-1 md:flex-col">
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  tabIndex={0}
                  rows={1}
                  placeholder="Send a message..."
                  className="m-0 w-full outline-none resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                  style={{
                    maxHeight: "200px",
                    height: "24px",
                    overflowY: "hidden"
                  }}
                  onKeyDown={handleKeypress}
                />
                <Button
                  disabled={isBotTyping || message?.length === 0}
                  onClick={() => sendMessage(EChatMessageRole.USER, message)}
                  className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <p className="p-1">{">"}</p>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

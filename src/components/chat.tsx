import { useEffect, useRef, useState } from "react";
import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { EChatMessageRole, TChatMessage } from "@/types/aiChats";
import { usePrivy } from "@privy-io/react-auth";

const Chat = () => {
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const bottomOfChatRef = useRef<HTMLDivElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);  
  const { getAccessToken } = usePrivy();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage(prompt: string, role:string) {
    console.log("Sending message...");
    const messageId = crypto.randomUUID();
    if (!prompt.length) return;

    const userMessage: TChatMessage = {
      role: EChatMessageRole.USER,
      prompt: prompt,
      id: messageId,
    };

    // Set user message immediately
    setMessages(prev => [...prev, userMessage]);

    setIsBotTyping(true);

    try {
      const token = await getAccessToken();
      const response = await fetch("https://api-production-a609.up.railway.app/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          prompt:prompt,
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
        role: EChatMessageRole.AI,
        prompt: "",
        id: crypto.randomUUID(),
      };

      const messageChunks: string[] = [];
      
      // Add AI message to chat
      setMessages(prev => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const messageChunk = decoder.decode(value, { stream: true });
        const cleanedMessages = messageChunk
    .split("\n")
    .filter(line => line.startsWith("data: "))
    .map(line => line.replace("data: ", "").trim());

  // Append the new chunk to the message
  messageChunks.push(...cleanedMessages);
  resultString += cleanedMessages.join(" ");

  // Update AI message content **incrementally**
  setMessages((prevMessages: TChatMessage[]) =>
    prevMessages.map((msg) =>
      msg.id === aiMessage.id
        ? { ...msg, prompt: resultString, chunks: [...(msg.chunks || []), ...cleanedMessages] }
        : msg
    )
  );
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
    console.log(e.target);
    if (e.key === 'Enter' && !e.shiftKey) {
      formRef.current?.submit();
    }
  };

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full">
            <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
              {messages && messages.length > 0 ? (
                <div className="flex flex-col items-center text-sm">
                  {messages.map((msg: TChatMessage) => (
                    <Message key={msg.id} message={msg} />
                  ))}
                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                  <div ref={bottomOfChatRef}></div>
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
          ref={formRef}
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   e.stopPropagation();
            //   console.log(e.target.value)
            //   // sendMessage(e.target.value, EChatMessageRole.USER);
            // }}
            className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl"
          >
            <div className="relative flex h-full flex-1 md:flex-col">
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  // onChange={(e) => setMessage(e.target.value)}
                  ref={textareaRef}
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
                  disabled={isBotTyping}
                  onClick={() => sendMessage(textareaRef.current?.value || '', EChatMessageRole.USER)}
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

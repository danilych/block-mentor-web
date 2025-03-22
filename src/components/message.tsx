// import { SiOpenai } from "react-icons/si";
// import { HiUser } from "react-icons/hi";
// import { TbCursorText } from "react-icons/tb";

interface MessageProps {
  message: {
    role: 'USER' | 'AGENT';
    content: string | null;
  };
}

const Message = ({ message }: MessageProps) => {
  const { role, content } = message;
  const isUser = role === "USER";

  return (
    <div
      className={`group w-full max-w-3xl px-4 text-white dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${
        isUser ? "bg-gray-800/70" : "bg-gray-700/70"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-3 py-3 md:py-6">
        <div className="flex-shrink-0">
          <div className="relative h-8 w-8 rounded-sm text-white flex items-center justify-center bg-black/75">
            {isUser ? (
              <p className="text-sm">user</p>
            ) : (
              <p className="text-sm">AI</p>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="prose prose-sm md:prose-base w-full break-words dark:prose-invert dark">
            {!isUser && content === null ? (
              <p className="text-gray-400">Error</p>
            ) : (
              <div className="whitespace-pre-wrap">{content}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

// import { SiOpenai } from "react-icons/si";
// import { HiUser } from "react-icons/hi";
// import { TbCursorText } from "react-icons/tb";

import { EChatMessageRole } from '@/types/aiChats'

interface MessageProps {
  message: {
    role: EChatMessageRole
    content: string | null
  }
}

const Message = ({ message }: MessageProps) => {
  const { role, content } = message
  const isUser = role === EChatMessageRole.USER

  return (
    <div className={`w-full max-w-3xl px-4 mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[90%] rounded-2xl shadow-sm 
          ${isUser 
            ? 'bg-gray-500/70 rounded-tr-sm' 
            : 'bg-gray-700/70 rounded-tl-sm'
          }`}
      >
        <div className="flex flex-col gap-2 p-4">
          <div className={`absolute ${isUser ? '-top-3 right-0' : '-top-3 left-0'}`}>
            <div className="h-6 w-6 rounded-full text-white flex items-center justify-center bg-black/75 text-xs">
              {isUser ? 'U' : 'AI'}
            </div>
          </div>
          <div className="flex-1 overflow-hidden mt-2">
            <div className={`prose prose-sm md:prose-base w-full break-words dark:prose-invert dark ${isUser ? 'pr-2' : 'pl-2'}`}>
              {!isUser && content === null ? (
                <p className="text-gray-400">Error</p>
              ) : (
                <div className="whitespace-pre-wrap text-white">{content}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message

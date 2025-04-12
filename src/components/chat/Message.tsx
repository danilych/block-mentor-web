import React from 'react'
import { ChatMessage, ChatMessageRole } from '@/types'
import { cn } from '@/lib/utils'

interface MessageProps {
  message: ChatMessage
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === ChatMessageRole.USER
  
  return (
    <div className={cn(
      "relative m-auto flex gap-4 p-6 text-base md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl w-full flex-1",
      isUser ? "bg-gray-200 dark:bg-[#242424]" : "bg-gray-100 dark:bg-[#1c1c1c]"
    )}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isUser
            ? "bg-white text-gray-900"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? "You" : "A"}
      </div>
      <div className="min-h-[20px] whitespace-pre-wrap flex flex-1">
        <span className="prose dark:prose-invert break-words">
          {message.content || ''}
        </span>
      </div>
    </div>
  )
}

export default Message

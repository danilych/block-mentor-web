import React from 'react'
import { ChatMessage, ChatMessageRole } from '@/types'
import { cn } from '@/lib/utils'

interface MessageProps {
  message: ChatMessage
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === ChatMessageRole.USER

  return (
    <div
      className={cn(
        'w-full max-w-3xl px-4 mb-4 flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'relative max-w-[90%] rounded-2xl shadow-sm',
          isUser
            ? 'bg-gray-500/70 rounded-tr-sm'
            : 'bg-gray-700/70 rounded-tl-sm'
        )}
      >
        <div className="flex flex-col gap-2 p-4">
          <div className={cn('absolute -top-3', isUser ? 'right-0' : 'left-0')}>
            <div className="h-6 w-6 rounded-full text-white flex items-center justify-center bg-black/75 text-xs">
              {isUser ? 'U' : 'AI'}
            </div>
          </div>
          <div className="flex-1 overflow-hidden mt-2">
            <div
              className={cn(
                'prose prose-sm md:prose-base w-full break-words dark:prose-invert dark',
                isUser ? 'pr-2' : 'pl-2'
              )}
            >
              {!isUser && message.content === null ? (
                <p className="text-gray-400">Error</p>
              ) : (
                <div className="whitespace-pre-wrap text-white">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message

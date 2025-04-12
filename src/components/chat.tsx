import { useEffect, useRef, useState } from 'react'
import Message from '@/components/message'
import { Button } from '@/components/ui/button'
import { usePrivy } from '@privy-io/react-auth'
import $client from '@/services/api/apiClient'
import { ScrollArea } from '@/components/ui/scroll-area'
import { API_BASE_URL } from '@/config'
import { ChatMessage, ChatMessageRole } from '@/types/index'

const Chat = ({ user }: { user: any }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [isBotTyping, setIsBotTyping] = useState(false)
  const { getAccessToken } = usePrivy()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { authenticated } = usePrivy()

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])
  async function getOrCreateChat() {
    try {
      const res = await $client.get('/chats')
      setMessages(res.data.messages)
    } catch (error) {
      console.error('Error getting or creating chat:', error)
      return null
    }
  }

  useEffect(() => {
    if (authenticated && user) {
      getOrCreateChat()
    }
  }, [authenticated, user])

  async function sendMessage(prompt: string, role: string) {
    const messageId = crypto.randomUUID()
    if (textareaRef.current) textareaRef.current.value = ''
    if (!prompt.length) return

    const userMessage: ChatMessage = {
      role: ChatMessageRole.USER,
      content: prompt,
      id: messageId,
    }

    // Set user message immediately
    setMessages(prev => [...prev, userMessage])

    setIsBotTyping(true)
    try {
      const token = await getAccessToken()
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: prompt,
          role: role,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to send message')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let resultString = ''

      const aiMessage: ChatMessage = {
        role: ChatMessageRole.AI,
        content: '',
        id: crypto.randomUUID(),
      }

      let previousChunk = ''

      // Add AI message to chat
      setMessages(prev => [...prev, aiMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const messageChunk = decoder.decode(value, { stream: true })
        const cleanedMessages = messageChunk.split('')

        cleanedMessages.forEach(chunk => {
          if (
            previousChunk &&
            (previousChunk.match(/[a-zA-Z0-9]$/) || chunk.match(/^[a-zA-Z0-9]/))
          ) {
            resultString += '' + chunk
          } else {
            resultString += chunk
          }
          previousChunk = chunk
        })

        // Update AI message content **incrementally**
        setMessages((prevMessages: ChatMessage[]) =>
          prevMessages.map(msg =>
            msg.id === aiMessage.id
              ? {
                  ...msg,
                  content: resultString,
                  chunks: [...(msg.chunks || []), ...cleanedMessages],
                }
              : msg
          )
        )
      }
      setIsBotTyping(false)
      return response
    } catch (error) {
      setIsBotTyping(false)

      if (error instanceof Error) {
        if (error.message.includes('ThrottlerException')) {
          return
        }
        console.error('Error while send message: ', error.message)
      }
    }
  }

  const handleKeypress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(textareaRef.current?.value || '', ChatMessageRole.USER)
    }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = '24px'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  return (
    <div className="flex max-w-full flex-1 flex-col">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="react-scroll-to-bottom--css-ikyem-79elbk h-full">
              <div className="react-scroll-to-bottom--css-ikyem-1n7m0yu">
                {messages && messages.length > 0 ? (
                  <div className="flex flex-col items-center text-sm">
                    {messages.map((msg: ChatMessage) => (
                      <Message key={msg.id} message={msg} />
                    ))}
                    <div className="w-full h-32 md:h-48 flex-shrink-0"></div>
                    <div ref={bottomOfChatRef}></div>
                  </div>
                ) : null}
              </div>
            </div>
          </ScrollArea>
        </div>
        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
          <div className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            <div className="relative flex h-full flex-1 flex-col">
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                {isBotTyping && (
                  <div className="animate-pulse text-sm text-gray-200 italic px-4 py-2 absolute -top-10 left-0 right-0 bg-transparent">
                    Assistant is typing...
                  </div>
                )}
                <textarea
                  disabled={isBotTyping}
                  ref={textareaRef}
                  tabIndex={0}
                  rows={1}
                  placeholder="Send a message..."
                  className="m-0 w-full outline-none resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600"
                  style={{
                    maxHeight: '200px',
                    minHeight: '24px',
                    overflowY: 'auto',
                  }}
                  onKeyDown={handleKeypress}
                  onInput={handleTextareaInput}
                />
                <Button
                  disabled={isBotTyping}
                  onClick={() =>
                    sendMessage(
                      textareaRef.current?.value || '',
                      ChatMessageRole.USER
                    )
                  }
                  className="absolute p-1 rounded-md bottom-0 md:bottom-2 bg-neutral-500 dark:bg-white disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                >
                  <p className="p-1">{'>'}</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat

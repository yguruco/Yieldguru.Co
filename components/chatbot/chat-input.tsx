"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-end gap-2 border-t border-gray-200 bg-white p-4"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className={cn(
          "min-h-[40px] max-h-[200px] resize-none rounded-lg border-gray-300 focus-visible:ring-[#4f1964]",
          isLoading && "opacity-50"
        )}
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon" 
        className={cn(
          "h-10 w-10 rounded-full bg-[#4f1964] hover:bg-[#4f1964]/90",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        disabled={isLoading || !message.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}

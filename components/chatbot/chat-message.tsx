"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/gemini-api"

interface ChatMessageProps {
  message: ChatMessage
  index: number
}

export default function ChatMessageItem({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "flex w-full gap-3 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 bg-[#4f1964]">
          <AvatarFallback className="bg-[#4f1964] text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser 
            ? "bg-[#4f1964] text-white" 
            : "bg-gray-100 text-gray-800 shadow-[5px_5px_10px_#d9d9d9,-5px_-5px_10px_#ffffff]"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-gray-300">
          <AvatarFallback className="bg-gray-300 text-gray-700">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  )
}

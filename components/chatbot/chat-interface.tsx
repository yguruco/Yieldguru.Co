"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Minimize, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatMessageItem from "./chat-message"
import ChatInput from "./chat-input"
import { sendMessageToGemini, type ChatMessage } from "@/lib/gemini-api"

export default function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm YieldGuru's AI assistant. How can I help you with your EV investment questions today?"
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = { role: "user", content }
    setMessages(prev => [...prev, userMessage])
    
    // Set loading state
    setIsLoading(true)
    
    try {
      // Send message to Gemini API
      const response = await sendMessageToGemini([...messages, userMessage])
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = { role: "assistant", content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Add error message
      const errorMessage: ChatMessage = { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again later." 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#4f1964] text-white shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "500px",
              width: isMinimized ? "300px" : "400px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between bg-[#4f1964] p-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-medium">YieldGuru Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-2">
                {messages.map((message, index) => (
                  <ChatMessageItem key={index} message={message} index={index} />
                ))}
                {isLoading && (
                  <div className="flex w-full justify-start p-4">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Chat input */}
            {!isMinimized && <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

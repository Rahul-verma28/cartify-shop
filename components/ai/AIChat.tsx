"use client"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI shopping assistant. How can I help you find the perfect product today?",
      },
    ],
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickQuestion = (question: string) => {
    append({ role: "user", content: question })
  }

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary-600" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-600 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      m.role === "user"
                        ? "bg-primary-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{m.content}</p>
                  </div>
                  {m.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-600 text-white">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-lg bg-gray-100 dark:bg-gray-800 rounded-bl-none">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickQuestion("What are your best selling products?")}
          >
            Best Sellers
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickQuestion("Do you have any discounts today?")}>
            Discounts
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickQuestion("Help me find a gift for my friend.")}>
            Gift Ideas
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            placeholder="Ask me anything about products?..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

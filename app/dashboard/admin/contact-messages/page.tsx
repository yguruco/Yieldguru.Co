"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  User,
  RefreshCw,
  ChevronDown,
  Eye,
  MailCheck
} from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ContactMessage {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'New' | 'Read' | 'Responded'
  createdAt: string
  updatedAt: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/contact/get-all')
        if (!response.ok) {
          throw new Error('Failed to fetch contact messages')
        }
        const data = await response.json()
        setMessages(data)
        setFilteredMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [refreshTrigger])

  // Filter messages based on search query and status filter
  useEffect(() => {
    let filtered = messages

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        message =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(message => message.status === statusFilter)
    }

    setFilteredMessages(filtered)
  }, [messages, searchQuery, statusFilter])

  // Update message status
  const updateMessageStatus = async (id: string, status: 'New' | 'Read' | 'Responded') => {
    setIsUpdating(true)
    try {
      const response = await fetch('/api/contact/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update message status')
      }

      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message._id === id ? { ...message, status } : message
        )
      )

      // Update selected message if it's the one being updated
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status })
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // View message details
  const viewMessageDetails = (message: ContactMessage) => {
    // If message is new, mark it as read
    if (message.status === 'New') {
      updateMessageStatus(message._id, 'Read')
    }
    setSelectedMessage(message)
    setIsDialogOpen(true)
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Read':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Responded':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <Clock className="h-3.5 w-3.5" />
      case 'Read':
        return <Eye className="h-3.5 w-3.5" />
      case 'Responded':
        return <MailCheck className="h-3.5 w-3.5" />
      default:
        return null
    }
  }

  // Refresh messages
  const refreshMessages = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">Manage and respond to user inquiries</p>
        </div>
        <Button
          onClick={refreshMessages}
          variant="outline"
          className="gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter by Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Read">Read</SelectItem>
              <SelectItem value="Responded">Responded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.status === 'New').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.length > 0
                ? `${Math.round((messages.filter(m => m.status === 'Responded').length / messages.length) * 100)}%`
                : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>
            {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Loading skeletons
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'When users submit contact forms, they will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col gap-4 p-4 border rounded-lg transition-colors ${
                    message.status === 'New' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f1964]/10">
                        <User className="h-5 w-5 text-[#4f1964]" />
                      </div>
                      <div>
                        <h3 className="font-medium">{message.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{message.email}</span>
                          </div>
                          <div className="hidden sm:block text-gray-300">•</div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{message.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(message.status)} flex items-center gap-1`}>
                        {getStatusIcon(message.status)}
                        {message.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewMessageDetails(message)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateMessageStatus(message._id, 'Read')}
                            disabled={message.status === 'Read' || isUpdating}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateMessageStatus(message._id, 'Responded')}
                            disabled={message.status === 'Responded' || isUpdating}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Responded
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewMessageDetails(message)}
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Contact message from {selectedMessage?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p>{selectedMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <Badge className={`mt-1 ${getStatusColor(selectedMessage.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedMessage.status)}
                    {selectedMessage.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="break-all">{selectedMessage.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p>{selectedMessage.phone}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Date Submitted</h4>
                  <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <div className="mt-2 rounded-md border bg-gray-50">
                    <ScrollArea className="h-[200px]">
                      <div className="p-4">
                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              {selectedMessage && selectedMessage.status !== 'Responded' && (
                <Button
                  onClick={() => updateMessageStatus(selectedMessage._id, 'Responded')}
                  disabled={isUpdating}
                  className="bg-[#4f1964] hover:bg-[#4f1964]/90"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Responded
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = `mailto:${selectedMessage?.email}?subject=Re: Your message to Yield Guru&body=Dear ${selectedMessage?.name},%0D%0A%0D%0AThank you for contacting Yield Guru.%0D%0A%0D%0A`
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Reply via Email
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

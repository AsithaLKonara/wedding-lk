'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Filter,
  // Online,
  // Offline,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  _id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    type: 'user' | 'vendor' | 'admin';
  };
  content: string;
  type: 'text' | 'image' | 'file' | 'booking' | 'payment';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    bookingId?: string;
    paymentId?: string;
  };
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
}

interface Conversation {
  _id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    type: 'user' | 'vendor' | 'admin';
    isOnline: boolean;
    lastSeen?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DirectMessagingProps {
  currentUserId: string;
  onMessageSent?: (message: Message) => void;
}

export function DirectMessaging({ currentUserId, onMessageSent }: DirectMessagingProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      markAsRead(activeConversation._id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const messageData = {
      conversationId: activeConversation._id,
      content: newMessage.trim(),
      type: 'text',
      senderId: currentUserId,
    };

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const data = await response.json();
        const newMsg = data.data;
        
        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        // Update conversation list
        setConversations(prev => 
          prev.map(conv => 
            conv._id === activeConversation._id 
              ? { ...conv, lastMessage: newMsg, updatedAt: new Date().toISOString() }
              : conv
          )
        );

        if (onMessageSent) {
          onMessageSent(newMsg);
        }

        // Send typing indicator
        sendTypingIndicator(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendTypingIndicator = async (isTyping: boolean) => {
    if (!activeConversation) return;

    try {
      await fetch('/api/messages/typing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: activeConversation._id,
          isTyping,
          userId: currentUserId,
        }),
      });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(participant => 
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Messages</h3>
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversation?._id === conversation._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setActiveConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.participants[0]?.avatar} />
                    <AvatarFallback>
                      {getInitials(conversation.participants[0]?.name || '')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.participants[0]?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.participants[0]?.name}
                    </h4>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activeConversation.participants[0]?.avatar} />
                  <AvatarFallback>
                    {getInitials(activeConversation.participants[0]?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {activeConversation.participants[0]?.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {activeConversation.participants[0]?.isOnline ? (
                      <span className="flex items-center text-green-600">
                        <div className="h-3 w-3 mr-1 bg-green-500 rounded-full" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500">
                        <div className="h-3 w-3 mr-1 bg-gray-400 rounded-full" />
                        Last seen {formatTime(activeConversation.participants[0]?.lastSeen || '')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Block User</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender.id === currentUserId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender.id === currentUserId
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.replyTo && (
                      <div className="text-xs opacity-75 mb-1 p-2 bg-black bg-opacity-10 rounded">
                        Replying to {message.replyTo.senderName}: {message.replyTo.content}
                      </div>
                    )}
                    
                    <p className="text-sm">{message.content}</p>
                    
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs opacity-75">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.sender.id === currentUserId && (
                        <div className="flex items-center">
                          {message.status === 'read' ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : message.status === 'delivered' ? (
                            <CheckCheck className="h-3 w-3 opacity-50" />
                          ) : (
                            <Check className="h-3 w-3 opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      if (e.target.value && !isTyping) {
                        setIsTyping(true);
                        sendTypingIndicator(true);
                      } else if (!e.target.value && isTyping) {
                        setIsTyping(false);
                        sendTypingIndicator(false);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    onBlur={() => {
                      if (isTyping) {
                        setIsTyping(false);
                        sendTypingIndicator(false);
                      }
                    }}
                  />
                </div>
                
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  File, 
  Smile,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  senderName?: string;
  senderAvatar?: string;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface RealTimeChatProps {
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  onClose?: () => void;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({
  receiverId,
  receiverName,
  receiverAvatar,
  onClose
}) => {
  const { data: session } = useSession();
  const {
    isConnected,
    isAuthenticated,
    messages,
    typingUsers,
    sendMessage,
    sendTypingIndicator,
    markMessageAsRead,
    joinVendorRoom,
    joinVenueRoom
  } = useSocket();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingTimeout, setIsTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentUserId = session?.user?.id || session?.user?.email;

  // Filter messages for this chat
  useEffect(() => {
    const filteredMessages = messages.filter(
      msg => 
        (msg.senderId === currentUserId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === currentUserId)
    );
    setChatMessages(filteredMessages);
  }, [messages, currentUserId, receiverId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Join appropriate room based on receiver type
  useEffect(() => {
    if (isAuthenticated && receiverId) {
      // Determine if receiver is vendor or venue (you might need to adjust this logic)
      if (receiverId.startsWith('vendor_')) {
        joinVendorRoom(receiverId);
      } else if (receiverId.startsWith('venue_')) {
        joinVenueRoom(receiverId);
      }
    }
  }, [isAuthenticated, receiverId, joinVendorRoom, joinVenueRoom]);

  // Handle typing indicator
  useEffect(() => {
    if (isTypingTimeout) {
      clearTimeout(isTypingTimeout);
    }

    const timeout = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(receiverId, false);
    }, 1000);

    setIsTypingTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [newMessage, sendTypingIndicator, receiverId]);

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(receiverId, true);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isAuthenticated) return;

    const messageData = {
      senderId: currentUserId!,
      receiverId,
      content: newMessage.trim(),
      type: 'text' as const,
    };

    const sentMessage = sendMessage(messageData);
    if (sentMessage) {
      setChatMessages(prev => [...prev, sentMessage]);
    }

    setNewMessage('');
    setIsTyping(false);
    sendTypingIndicator(receiverId, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'image' | 'file') => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const messageData = {
        senderId: currentUserId!,
        receiverId,
        content: file.name,
        type,
      };

      const sentMessage = sendMessage(messageData);
      if (sentMessage) {
        setChatMessages(prev => [...prev, sentMessage]);
      }
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isReceiverTyping = typingUsers.has(receiverId);

  if (!isConnected || !isAuthenticated) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            {!isConnected ? 'Connecting to chat...' : 'Authenticating...'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      {/* Chat Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={receiverAvatar} />
              <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{receiverName}</CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isReceiverTyping ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm text-gray-500">
                  {isReceiverTyping ? 'typing...' : 'online'}
                </span>
              </div>
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
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onClose}>
                  Close Chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!isOwnMessage && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={message.senderAvatar} />
                        <AvatarFallback>{message.senderName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">{message.senderName}</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type === 'text' && (
                      <p className="text-sm">{message.content}</p>
                    )}
                    {message.type === 'image' && (
                      <div className="text-sm">
                        <ImageIcon className="h-4 w-4 inline mr-1" />
                        {message.content}
                      </div>
                    )}
                    {message.type === 'file' && (
                      <div className="text-sm">
                        <File className="h-4 w-4 inline mr-1" />
                        {message.content}
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isReceiverTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Message Input */}
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-20"
            />
            
            {/* Attachment and Emoji buttons */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-6 w-6 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                className="h-6 w-6 p-0"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-6 w-6 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileUpload(e.target.files, 'file')}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files, 'image')}
          className="hidden"
        />

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-2 p-2 bg-gray-50 rounded border">
            <div className="text-sm text-gray-500">Emoji picker placeholder</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeChat; 
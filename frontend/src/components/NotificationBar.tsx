import React, { useState, useEffect, useRef } from 'react';
import { messagingService, Message } from '../services/messagingService';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface NotificationBarProps {
  className?: string;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    setupMessageListeners();
    return () => {
      messagingService.cleanup();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const fetchedMessages = await messagingService.getMessages();
      setMessages(fetchedMessages);
      setUnreadCount(fetchedMessages.filter(m => !m.read).length);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const setupMessageListeners = () => {
    messagingService.onNewMessage((message) => {
      setMessages(prev => [message, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    messagingService.onMessageRead((messageId) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messagingService.markAsRead(messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleScreenshotClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !message.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(message.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {message.senderName[0]}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {message.senderName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">{message.content}</p>
                      {message.type === 'screenshot' && message.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={message.imageUrl}
                            alt="Screenshot"
                            className="max-w-full h-auto rounded cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScreenshotClick(message.imageUrl!);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}; 
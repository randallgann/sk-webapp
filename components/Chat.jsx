import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatBody from "./ChatBody";
import SuggestedQuestions from "./SuggestedQuestions";
import { chatService } from '../utils/chatService';
import {
    PlusCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Avatar from "./Avatar";

export default function Chat({ thread, isVisible, onClick }) {
    const [currentThread, setCurrentThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [botStatus, setBotStatus] = useState('');
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!thread) {
      setCurrentThread(null);
      setMessages([]);
      setMessage('');
      setIsSending(false);
      setIsTyping(false);
      setIsLoading(false);
      setBotStatus('');
      setError(null);
      return;
    }

        const setupThread = async () => {
            try {
                // Leave previous thread if exists
                if (currentThread && currentThread.id !== thread.id) {
                    await chatService.leaveThread(currentThread.id);
                }

                // Join new thread and get its details
                const threadDetails = await chatService.joinThread(thread.id, thread);

                // Load thread messages
                const threadMessages = await chatService.getThreadMessages(thread.id);

                setCurrentThread(threadDetails);
                setMessages(threadMessages || []);
            } catch (error) {
                console.error('Error setting up thread:', error);
                setError('Failed to load messages. Please try again.');
                setMessages([]);
            } finally {
                setIsLoading(false);
            }
        };

        setupThread();

        // Clean up when component unmounts or thread changes
        return () => {
            if (thread?.id) {
                chatService.leaveThread(thread.id);
            }
        };
    }, [thread]);

    // Subscribe to messages
    useEffect(() => {
    if (!currentThread) return;

    const unsubscribe = chatService.subscribeToMessages((message) => {
        if (message.chatId === currentThread.id) {
            if (message.type === 'status') {
                // Update bot status for typing indicator
                setBotStatus(message.status);
                console.log('Bot status:', message.status);
            } else if (message.type === 'message') {
                setMessages(prevMessages => {
                        // Check if message already exists to prevent duplicates
                        const messageExists = prevMessages.some(m => m.id === message.id);
                        if (messageExists) return prevMessages;
                        
                        return [...prevMessages, {
                            id: message.id || Date.now().toString(),
                            content: message.content,
                            timestamp: message.timestamp || new Date().toISOString(),
                            isCurrentUser: message.isCurrentUser || false,
                            userName: message.userName
                        }];
                    });
                    setIsTyping(false);
            }
        }
    });

    return () => {
        unsubscribe();
        setBotStatus('');
        setIsTyping(false);
    }
}, [currentThread?.id]);

    const handleMessageSubmit = async () => {
    if (!message.trim() || !currentThread || isSending) return;

    setIsSending(true);
    setIsTyping(true);

    // Create and display user message immediately
    const userMessage = {
        id: Date.now().toString(),
        content: message.trim(),
        timestamp: new Date().toISOString(),
        authorRole: "User",
        userName: "User",
        isCurrentUser: true
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Clear the input early
    const sentMessage = message.trim();
    setMessage('');
    if (inputRef.current) {
        inputRef.current.textContent = '';
    }

    try {
        // Send message to server and get bot response
        const response = await chatService.sendMessage(currentThread.id, sentMessage);
        
        if (response && response.variables) {
            const botResponseVar = response.variables.find(v => v.key === 'input');
            const botResponse = botResponseVar ? botResponseVar.value : '';

            const botMessage = {
                id: (Date.now() + 1).toString(),
                content: botResponse,
                timestamp: new Date().toISOString(),
                authorRole: "Bot",
                userName: "Bot",
                isCurrentUser: false
            };

            // Update both messages state and currentThread
            setMessages(prevMessages => [...prevMessages, botMessage]);
        }

    } catch (error) {
        console.error('Failed to send message:', error);
        // Optionally show an error to the user
    } finally {
        setIsSending(false);
        setIsTyping(false);
    }
};

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleMessageSubmit();
        }
    };

    const handleInput = (e) => {
        setMessage(e.currentTarget.textContent || '');
    };

    // Memoize the question click handler
    const handleQuestionClick = useCallback((questionText) => {
        // Set the message in state
        setMessage(questionText);
        
        // Update the contentEditable div
        if (inputRef.current) {
            inputRef.current.textContent = questionText;
        }

        // Automatically send the message
        handleMessageSubmit();
    }, []);  

    // If no thread is selected or thread was deleted, show empty state
    if (!thread || !currentThread) {
        return (
        <div className="flex flex-col h-full">
        {/* Our suggested questions at the top */}
        <div className="flex-none h-20">
        <SuggestedQuestions onQuestionClick={handleQuestionClick} />
        </div>
        
            <div className={`${isVisible ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 fixed inset-0 h-full lg:relative lg:inset-auto flex flex-col grow w-full border-x border-gray-100 bg-white z-10 transition`}>
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Select a thread or create a new one to start chatting</p>
                </div>
            </div>
        </div>
        );
    }

    return (
        
        <div className={`${isVisible ? "translate-x-0" : "translate-x-full"} 
        lg:translate-x-0 relative z-10 w-full lg:static lg:w-auto transition border-x border-gray-100 bg-white flex flex-col`} style={{ height: '100%' }}>
            {/* Header */}
            <div className="flex-none flex items-center h-24 p-6 border-b border-gray-100">
                <button
                    onClick={onClick}
                    className="flex items-center justify-center mr-6 lg:hidden"
                    type="button"
                    aria-label="Back"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                {/* <Avatar
                    textImage={currentThread.shortName}
                    isOnline={currentThread.isOnline}
                    srcImage={currentThread.avatar}
                />
                <div className="flex flex-col ml-4">
                    <span className="font-bold text-xl">{currentThread.name}</span>
                    <span className="text-xs text-gray-400">New conversation</span>
                </div> */}
                <SuggestedQuestions onQuestionClick={handleQuestionClick} />
            </div>

            <div className="flex flex-col h-[calc(100%-6rem)] overflow-hidden">
            {/* Chat Body with status */}
            <div className="flex-1 overflow-y-auto">
                <ChatBody 
                    thread={currentThread}
                    messages={messages}
                    isTyping={isTyping}
                    botStatus={botStatus}
                    isLoading={isLoading}
                    error={error}
                />
            </div>

            {/* Message Input */}
            <div className="flex-none flex items-center gap-3 p-4 border-t border-gray-100">
                <button
                    className="shrink-0 text-gray-400"
                    type="button"
                    aria-label="Add media to message"
                >
                    <PlusCircleIcon className="w-6 h-6" />
                </button>
                <div className="relative flex w-full max-h-24 overflow-hidden">
                    <div
                        ref={inputRef}
                        className="w-full outline-0 text-gray-500 px-4 py-2 rounded-lg bg-gray-50"
                        contentEditable="true"
                        onInput={handleInput}
                        onKeyDown={handleKeyPress}
                        role="textbox"
                        aria-label="Message input"
                        data-placeholder="Type your message here..."
                        spellCheck="true"
                    />
                </div>
                <button
                    className={`flex items-center justify-center shrink-0 w-12 h-12 ${
                        isSending ? 'bg-gray-400' : 'bg-nav'
                    } rounded-full overflow-hidden`}
                    type="button"
                    aria-label="Submit"
                    onClick={handleMessageSubmit}
                    disabled={isSending}
                >
                    <ArrowRightIcon className="w-6 h-6 text-white" />
                </button>
            </div>
            </div>
        </div>
    );
}
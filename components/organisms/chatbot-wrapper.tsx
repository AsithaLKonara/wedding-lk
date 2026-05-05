"use client"

import dynamic from 'next/dynamic'

const Chatbot = dynamic(() => import('./ai-chatbot'), {
  ssr: false,
  loading: () => null
});

export default function ChatbotWrapper() {
  return <Chatbot />;
}

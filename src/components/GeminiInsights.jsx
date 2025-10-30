import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeminiInsights = ({ earthquakes }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your Earthquake Analysis Assistant. I can help you analyze seismic data, identify patterns, and answer questions about recent earthquake activity. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getEarthquakeStats = () => {
    if (!earthquakes.length) return null;

    return {
      total: earthquakes.length,
      maxMagnitude: Math.max(...earthquakes.map(eq => eq.properties.mag)),
      minMagnitude: Math.min(...earthquakes.map(eq => eq.properties.mag)),
      averageMagnitude: earthquakes.reduce((sum, eq) => sum + eq.properties.mag, 0) / earthquakes.length,
      significantCount: earthquakes.filter(eq => eq.properties.mag >= 4.5).length,
      recentCount: earthquakes.filter(eq => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return new Date(eq.properties.time) > oneHourAgo;
      }).length,
      topEarthquakes: earthquakes
        .sort((a, b) => b.properties.mag - a.properties.mag)
        .slice(0, 5)
        .map(eq => ({
          magnitude: eq.properties.mag,
          location: eq.properties.place,
          time: new Date(eq.properties.time).toISOString(),
          depth: eq.geometry.coordinates[2],
          coordinates: {
            latitude: eq.geometry.coordinates[1],
            longitude: eq.geometry.coordinates[0]
          }
        }))
    };
  };

  // Function to clean and format the AI response
  const formatAIResponse = (text) => {
    // Remove markdown formatting
    let cleaned = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
      .replace(/`(.*?)`/g, '$1')       // Remove `code`
      .replace(/#{1,6}\s?/g, '')       // Remove headers
      .replace(/\-\s/g, '• ')          // Convert dashes to bullets
      .replace(/\n{3,}/g, '\n\n');     // Limit consecutive newlines

    // Ensure proper spacing after bullets and numbers
    cleaned = cleaned.replace(/(•|\d+\.)\s*/g, '$1 ');

    return cleaned.trim();
  };

  const sendMessage = async (userMessage = input) => {
    if (!userMessage.trim() || loading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'ai',
        content: '🔐 Gemini AI integration requires an API key. Please add VITE_GEMINI_API_KEY to your environment variables.',
        timestamp: new Date()
      }]);
      return;
    }

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const stats = getEarthquakeStats();
      if (!stats) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          content: 'No earthquake data available for analysis. Please wait for data to load.',
          timestamp: new Date()
        }]);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
      });

      const prompt = `
        You are an earthquake analysis assistant. Analyze the following seismic data and provide a helpful response to the user's question.

        USER QUESTION: "${userMessage}"

        EARTHQUAKE DATA SUMMARY:
        - Total earthquakes in last 24h: ${stats.total}
        - Magnitude range: ${stats.minMagnitude.toFixed(1)} to ${stats.maxMagnitude.toFixed(1)}
        - Significant earthquakes (M4.5+): ${stats.significantCount}
        - Recent activity (last hour): ${stats.recentCount} events
        - Top 5 strongest earthquakes:
        ${stats.topEarthquakes.map((eq, i) => 
          `${i+1}. M${eq.magnitude} at ${eq.location}`
        ).join('\n')}

        IMPORTANT FORMATTING INSTRUCTIONS:
        - Use ONLY plain text, no markdown formatting
        - Do NOT use **bold**, *italic*, or any special formatting
        - Use simple bullet points with • instead of asterisks
        - Keep paragraphs concise and well-spaced
        - Use clear, conversational language
        - Use emojis very sparingly (1-2 at most if relevant)
        - Structure your response with clear line breaks between ideas

        Please provide:
        1. A direct answer to the user's question
        2. Relevant insights from the data
        3. Any patterns or notable observations
        4. Keep it conversational but informative

        Be concise but helpful. If the question can't be answered with available data, suggest what information would be needed.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Format the response to remove markdown
      const formattedText = formatAIResponse(text);

      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'ai',
        content: formattedText,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Where was the strongest earthquake?",
    "Show me recent significant activity",
    "What regions are most active?",
    "Analyze today's seismic trends",
    "Any tsunami threats?"
  ];

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const stats = getEarthquakeStats();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">🌋</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Earthquake AI Assistant</h3>
              <p className="text-blue-100 text-sm">Powered by Gemini 2.0 Flash</p>
            </div>
          </div>
          {/* <button
            onClick={() => setShowDataPanel(!showDataPanel)}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
          >
            {showDataPanel ? 'Hide Data' : 'Show Data'}
          </button> */}
        </div>
      </div>

      <div className="flex flex-col h-[500px]">
        {/* Data Panel */}
        {showDataPanel && stats && (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="p-4 max-h-48 overflow-y-auto">
              <h4 className="font-semibold text-gray-900 mb-2">📊 Current Data Stats</h4>
              <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                {formatJSON({
                  summary: {
                    totalEarthquakes: stats.total,
                    magnitudeRange: {
                      min: stats.minMagnitude.toFixed(1),
                      max: stats.maxMagnitude.toFixed(1)
                    },
                    significantEvents: stats.significantCount,
                    recentActivity: stats.recentCount
                  },
                  topEvents: stats.topEarthquakes
                })}
              </pre>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Analyzing seismic data...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={loading || !earthquakes.length}
                className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about earthquake patterns, regions, or trends..."
                disabled={loading || !earthquakes.length}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed pr-12"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading || !earthquakes.length}
                className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {earthquakes.length ? `Analyzing ${earthquakes.length} earthquakes` : 'Waiting for earthquake data...'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GeminiInsights;
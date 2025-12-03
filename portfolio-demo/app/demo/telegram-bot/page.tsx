'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link' // Добавляем импорт Link

interface Message {
  id: number
  type: 'user' | 'bot'
  text: string
  timestamp: string
  aiModel?: string
}

export default function TelegramBotDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'bot', text: 'Привет! Я AI-ассистент. Я могу помочь с генерацией текстов, идей и креативных решений. Что вас интересует?', timestamp: '10:00' },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiMode, setAiMode] = useState<'creative' | 'business' | 'technical'>('creative')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [botStats, setBotStats] = useState({
    totalUsers: 42,
    activeToday: 7,
    messagesProcessed: 156,
    averageResponseTime: '1.2s'
  })

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Генерация ответа в зависимости от режима
      const responses = {
        creative: [
          "🎨 Креативный подход требует смелости! ",
          "✨ Вдохновение пришло! ",
          "🌟 Давайте создадим что-то уникальное! "
        ],
        business: [
          "📊 С точки зрения бизнеса: ",
          "💼 Оптимальное решение для роста: ",
          "📈 Стратегический подход предполагает: "
        ],
        technical: [
          "🔧 Техническая реализация: ",
          "⚙️ С архитектурной точки зрения: ",
          "💻 Оптимальный код для решения: "
        ]
      }

      const prefixes = responses[aiMode]
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      
      const creativeWords = [
        "инновационный", "эффективный", "масштабируемый", "интуитивный", 
        "современный", "оптимизированный", "адаптивный", "уникальный"
      ]
      const randomWord = creativeWords[Math.floor(Math.random() * creativeWords.length)]
      
      const aiResponse = `${randomPrefix}${inputMessage.toLowerCase().includes('привет') ? ' Рад вас видеть! ' : ''}Это будет ${randomWord} проект, который привлечет внимание вашей аудитории и обеспечит устойчивый рост.`

      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        aiModel: aiMode === 'creative' ? 'gpt-4' : 'gpt-3.5-turbo'
      }

      setMessages(prev => [...prev, botMessage])

      // Обновляем статистику
      setBotStats(prev => ({
        ...prev,
        messagesProcessed: prev.messagesProcessed + 1
      }))

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      { id: 1, type: 'bot', text: 'Привет! Я AI-ассистент. Я могу помочь с генерацией текстов, идей и креативных решений. Что вас интересует?', timestamp: '10:00' },
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок с кнопкой возврата */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>На главную</span>
              </Link>
              <div className="hidden md:block">
                <span className="px-3 py-1 bg-teal-900/50 text-teal-300 text-sm rounded-full">
                  🤖 Демо Telegram Bot
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Telegram Bot Demo с AI-интеграцией</h1>
            <p className="text-gray-400">
              Интерактивная демонстрация Telegram бота с интеграцией OpenAI GPT. Отправьте сообщение и получите AI-ответ!
            </p>
          </div>
          
          {/* Кнопка возврата для мобильных */}
          <div className="md:hidden">
            <Link 
              href="/"
              className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              ←
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Чат */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl overflow-hidden">
              {/* Заголовок чата */}
              <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-teal-900/30 to-blue-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Assistant Bot</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400">Online</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">{botStats.activeToday} активных пользователей</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={clearChat}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Очистить чат
                    </button>
                  </div>
                </div>
              </div>

              {/* Окно сообщений */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 rounded-br-none' 
                        : 'bg-gray-700/50 rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      <div className={`flex items-center justify-between mt-2 text-sm ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        <span>{message.timestamp}</span>
                        {message.type === 'bot' && message.aiModel && (
                          <span className="px-2 py-1 bg-gray-800/50 rounded-full text-xs">
                            {message.aiModel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700/50 rounded-2xl rounded-bl-none p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Панель ввода */}
              <div className="p-4 border-t border-gray-700">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-gray-400">Режим AI:</span>
                    <div className="flex space-x-2">
                      {(['creative', 'business', 'technical'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setAiMode(mode)}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            aiMode === mode
                              ? 'bg-gradient-to-r from-teal-600 to-blue-500'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {mode === 'creative' && '🎨 Креатив'}
                          {mode === 'business' && '💼 Бизнес'}
                          {mode === 'technical' && '🔧 Технический'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите ваше сообщение..."
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-4 focus:outline-none focus:border-teal-500 resize-none"
                        rows={2}
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="self-end px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-500 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isLoading ? '⏳' : '📤'}
                    </button>
                  </div>
                </div>
                
                {/* Кнопка возврата внизу для мобильных */}
                <div className="md:hidden pt-4 border-t border-gray-700">
                  <Link 
                    href="/"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <span>←</span>
                    <span>Вернуться на главную</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Статистика бота */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Всего пользователей</p>
                    <p className="text-2xl font-bold">{botStats.totalUsers}</p>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Сообщений обработано</p>
                    <p className="text-2xl font-bold">{botStats.messagesProcessed}</p>
                  </div>
                  <div className="text-2xl">💬</div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Среднее время ответа</p>
                    <p className="text-2xl font-bold">{botStats.averageResponseTime}</p>
                  </div>
                  <div className="text-2xl">⚡</div>
                </div>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Активных сегодня</p>
                    <p className="text-2xl font-bold">{botStats.activeToday}</p>
                  </div>
                  <div className="text-2xl">🔥</div>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Информация */}
          <div className="space-y-6">
            {/* Информация о боте */}
            <div className="bg-gradient-to-br from-teal-900/20 to-blue-900/20 border border-teal-700/30 rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-4">ℹ️ О боте</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Версия бота</span>
                  <span className="font-medium">v2.1.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Подключенные AI</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">GPT-4</span>
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">GPT-3.5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Запуск</span>
                  <span className="font-medium">{new Date().toLocaleString('ru-RU')}</span>
                </div>
                <div className="pt-3 border-t border-teal-800/50">
                  <p className="text-sm text-gray-400">
                    Бот использует современные AI модели для генерации креативного контента, бизнес-решений и технических советов.
                  </p>
                </div>
              </div>
            </div>

            {/* Быстрые команды */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-4">⚡ Быстрые команды</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInputMessage('Напиши креативное приветствие')}
                  className="p-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg text-sm transition-colors text-left"
                >
                  🎨 Креативное приветствие
                </button>
                <button
                  onClick={() => setInputMessage('Идея для бизнес-поста')}
                  className="p-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg text-sm transition-colors text-left"
                >
                  💼 Бизнес-идея
                </button>
                <button
                  onClick={() => setInputMessage('Сгенерируй хештеги для фото')}
                  className="p-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg text-sm transition-colors text-left"
                >
                  # Хештеги
                </button>
                <button
                  onClick={() => setInputMessage('Техническое решение для...')}
                  className="p-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg text-sm transition-colors text-left"
                >
                  🔧 Технический совет
                </button>
              </div>
            </div>

            {/* Кнопка возврата для десктопа */}
            <div className="hidden md:block">
              <Link 
                href="/"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <span>←</span>
                <span>Вернуться на главную</span>
              </Link>
            </div>

            {/* Кодовая вставка */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-4">💻 Пример кода</h3>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`// Отправка сообщения боту
async function sendToBot(message) {
  const response = await fetch('/api/telegram-bot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message, 
      userId: 'user123',
      mode: 'creative' 
    })
  });
  
  return await response.json();
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
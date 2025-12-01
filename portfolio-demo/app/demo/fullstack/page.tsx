'use client'

import { useState, useEffect, useRef } from 'react'

interface DataCard {
  id: number
  title: string
  description: string
  value: number
  icon: string
}

export default function FullstackDemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiData, setApiData] = useState<any>(null)
  const [dataCards, setDataCards] = useState<DataCard[]>([
    { id: 1, title: 'Активные пользователи', description: 'Онлайн сейчас', value: 142, icon: '👥' },
    { id: 2, title: 'Среднее время ответа', description: 'За последние 24 часа', value: 245, icon: '⚡' },
    { id: 3, title: 'Успешных запросов', description: 'API запросы', value: 98, icon: '✅' },
    { id: 4, title: 'Загрузка сервера', description: 'Текущая нагрузка', value: 65, icon: '📊' },
  ])
  
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<DataCard | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [studyTime, setStudyTime] = useState(0)
  const [showStudyProgress, setShowStudyProgress] = useState(false)
  
  const cardRefs = useRef<Record<number, HTMLDivElement>>({})

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Автоматический сброс состояния
  useEffect(() => {
    let resetTimer: NodeJS.Timeout
    
    if (isSuccess) {
      resetTimer = setTimeout(() => {
        setIsSuccess(false)
        setApiData(null)
        setShowStudyProgress(false)
        setStudyTime(0)
      }, 8000)
    }
    
    return () => clearTimeout(resetTimer)
  }, [isSuccess])

  // Имитация загрузки API
  const simulateApiCall = async () => {
    setIsLoading(true)
    
    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Моковые данные
      const mockData = {
        timestamp: new Date().toISOString(),
        status: 'success',
        data: {
          users: { active: 142, total: 254 },
          performance: { responseTime: '245ms', uptime: '99.8%' },
          api: { requests: 1245, successRate: '98.2%' },
          server: { cpu: '65%', memory: '78%' }
        }
      }
      
      setApiData(mockData)
      setIsLoading(false)
      setIsSuccess(true)
      
      // Обновляем карточки данными из API
      setDataCards([
        { id: 1, title: 'Активные пользователи', description: 'Онлайн сейчас', value: mockData.data.users.active, icon: '👥' },
        { id: 2, title: 'Среднее время ответа', description: 'За последние 24 часа', value: parseInt(mockData.data.performance.responseTime), icon: '⚡' },
        { id: 3, title: 'Успешных запросов', description: 'API запросы', value: mockData.data.api.requests, icon: '✅' },
        { id: 4, title: 'Загрузка сервера', description: 'Текущая нагрузка', value: parseInt(mockData.data.server.cpu), icon: '📊' },
      ])
      
    } catch (error) {
      console.error('API Error:', error)
      setIsLoading(false)
    }
  }

  const handleCardClick = (card: DataCard) => {
    setSelectedCard(card)
    setShowCodeModal(true)
    setShowStudyProgress(true)
    setStudyTime(0)
  }

  // Имитация изучения кода
  useEffect(() => {
    let studyInterval: NodeJS.Timeout
    
    if (showStudyProgress && studyTime < 30) {
      studyInterval = setInterval(() => {
        setStudyTime(prev => {
          if (prev >= 30) {
            clearInterval(studyInterval)
            return 30
          }
          return prev + 1
        })
      }, 1000)
    }
    
    return () => clearInterval(studyInterval)
  }, [showStudyProgress, studyTime])

  const getApiCode = () => {
    return `// Пример кода API маршрута (Next.js 14 App Router)
export async function GET(request: Request) {
  try {
    // Имитация получения данных из базы данных
    const data = await fetchDataFromDatabase();
    
    // Возвращаем данные в формате JSON
    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        users: { active: ${apiData?.data.users.active || 142}, total: ${apiData?.data.users.total || 254} },
        performance: { 
          responseTime: "${apiData?.data.performance.responseTime || '245ms'}", 
          uptime: "${apiData?.data.performance.uptime || '99.8%'}" 
        },
        api: { 
          requests: ${apiData?.data.api.requests || 1245}, 
          successRate: "${apiData?.data.api.successRate || '98.2%'}" 
        },
        server: { 
          cpu: "${apiData?.data.server.cpu || '65%'}", 
          memory: "${apiData?.data.server.memory || '78%'}" 
        }
      }
    });
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🚀 Full-Stack Демонстрация</h1>
          <p className="text-gray-600">
            Интерактивная демонстрация полного цикла разработки от фронтенда до бэкенда
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка - Интерфейс */}
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">🎯 Взаимодействие с API</h2>
              
              <button
                onClick={simulateApiCall}
                disabled={isLoading || isSuccess}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                  isLoading 
                    ? 'bg-blue-100 text-blue-700 cursor-wait' 
                    : isSuccess
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Загрузка данных...
                  </div>
                ) : isSuccess ? (
                  '✅ Данные успешно загружены!'
                ) : (
                  '🔄 Загрузить данные с сервера'
                )}
              </button>
              
              {isSuccess && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-700 font-medium">Соединение установлено!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Данные автоматически обновятся через {8 - Math.floor((Date.now() - (apiData?.timestamp ? new Date(apiData.timestamp).getTime() : Date.now())) / 1000)} секунд
                  </p>
                </div>
              )}
            </div>

            {/* Карточки данных */}
            <div className="bg-white border rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">📊 Визуализация данных</h2>
              <p className="text-gray-600 mb-4">
                {isMobile 
                  ? 'Нажмите на карточку для изучения кода' 
                  : 'Наведите курсор на карточку, затем кликните для изучения кода'}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {dataCards.map(card => (
                  <div
                    key={card.id}
                    ref={el => {
                      if (el) {
                        cardRefs.current[card.id] = el;
                      }
                    }}
                    className={`data-card p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                      isMobile 
                        ? 'bg-white active:scale-95 active:shadow-inner' 
                        : 'bg-gray-50 hover:shadow-lg hover:border-blue-300'
                    }`}
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl">{card.icon}</div>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {card.id}
                      </div>
                    </div>
                    <h3 className="font-bold mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                    <div className="text-2xl font-bold text-blue-600">{card.value}</div>
                  </div>
                ))}
              </div>
              
              {showStudyProgress && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Изучение кода...</span>
                    <span>{studyTime}/30 сек</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${(studyTime / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка - Результаты и код */}
          <div className="space-y-6">
            {/* JSON данные */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">📦 JSON Ответ от API</h2>
              <div className="bg-gray-950 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm">
                  {JSON.stringify(apiData || {
                    status: 'idle',
                    message: 'Нажмите кнопку для загрузки данных',
                    timestamp: new Date().toISOString()
                  }, null, 2)}
                </pre>
              </div>
            </div>

            {/* Информация */}
            <div className="bg-white border rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">ℹ️ О демонстрации</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Полный цикл разработки</h3>
                    <p className="text-sm text-gray-600">От клиента к серверу и обратно</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Интерактивные компоненты</h3>
                    <p className="text-sm text-gray-600">Нажмите на элементы для изучения кода</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Автоматический сброс</h3>
                    <p className="text-sm text-gray-600">Через 8 секунд система вернется в исходное состояние</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно с кодом */}
      {showCodeModal && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">💻 Код бэкенда для: {selectedCard.title}</h3>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-gray-900 overflow-auto max-h-[60vh]">
              <pre className="text-green-400 text-sm">{getApiCode()}</pre>
            </div>
            
            <div className="p-6 border-t">
              <div className="flex justify-between">
                <div className="text-sm text-gray-600">
                  Изучено: {studyTime} из 30 секунд
                </div>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Продолжить изучение
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
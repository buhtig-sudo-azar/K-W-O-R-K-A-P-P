'use client'

// Импортируем необходимые хуки и компоненты React
import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'

// Определяем тип для пропсов компонента
interface AdminLayoutProps {
  children: ReactNode
}

// Главный лэйаут админки
export default function AdminLayout({ children }: AdminLayoutProps) {
  // Используем хук useRouter для навигации
  const router = useRouter()
  
  // Состояние для отслеживания активного раздела
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Функция для перехода на главную страницу
  const handleGoHome = () => {
    router.push('/')
  }
  
  // Функция для выхода из админки
  const handleLogout = () => {
    // В реальном проекте здесь была бы очистка токена
    alert('Выход из админки выполнен (демо режим)')
    router.push('/')
  }
  
  // Массив разделов админки
  const sections = [
    { id: 'dashboard', name: 'Дашборд', icon: '📊' },
    { id: 'users', name: 'Пользователи', icon: '👥' },
    { id: 'roles', name: 'Роли', icon: '🛡️' },
    { id: 'audit', name: 'Аудит', icon: '📝' },
    { id: 'settings', name: 'Настройки', icon: '⚙️' },
    { id: 'security', name: 'Безопасность', icon: '🔐' },
    { id: 'reports', name: 'Отчеты', icon: '📈' }
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Верхняя панель навигации */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Логотип и название */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Административная панель</h1>
                <p className="text-sm text-gray-400">Демо-версия с RBAC системой</p>
              </div>
            </div>
            
            {/* Информация о пользователе */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="font-medium">Администратор</p>
                <p className="text-sm text-gray-400">admin@example.com</p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center cursor-pointer">
                  <span className="font-bold">A</span>
                </div>
                
                {/* Выпадающее меню пользователя */}
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-700">
                    <p className="font-medium">Главный Администратор</p>
                    <p className="text-sm text-gray-400">Роль: Админ</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => setActiveSection('settings')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      ⚙️ Мои настройки
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-900/50 rounded-md transition-colors text-red-300"
                    >
                      🚪 Выйти
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковая панель навигации */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-300">Навигация</h2>
              
              {/* Кнопки разделов */}
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span>{section.name}</span>
                  </button>
                ))}
              </nav>
              
              {/* Разделитель */}
              <div className="my-6 border-t border-gray-700"></div>
              
              {/* Быстрые действия */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-400 text-sm">Быстрые действия</h3>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-green-900/30 hover:bg-green-800/40 rounded-lg transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>➕</span>
                    <span>Добавить пользователя</span>
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-blue-900/30 hover:bg-blue-800/40 rounded-lg transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Создать отчет</span>
                  </span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-purple-900/30 hover:bg-purple-800/40 rounded-lg transition-colors">
                  <span className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span>Обновить систему</span>
                  </span>
                </button>
              </div>
              
              {/* Информация о системе */}
              <div className="mt-8 p-3 bg-gray-900/50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Статус системы</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Пользователей:</span>
                    <span className="text-green-400 font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Активных сессий:</span>
                    <span className="text-blue-400 font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Записей аудита:</span>
                    <span className="text-yellow-400 font-medium">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Статус:</span>
                    <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">
                      Активна
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Кнопка возврата на главную */}
              <button
                onClick={handleGoHome}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>🏠</span>
                <span>На главную</span>
              </button>
            </div>
          </aside>
          
          {/* Основной контент */}
          <main className="flex-1">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              {/* Индикаторы системы */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-blue-300">Всего пользователей</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <div className="text-2xl">👥</div>
                  </div>
                  <div className="mt-2 text-xs text-blue-400">
                    <span className="text-green-400">↑ 2</span> за месяц
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-green-300">Активные сессии</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <div className="text-2xl">🔐</div>
                  </div>
                  <div className="mt-2 text-xs text-green-400">
                    Безопасно
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-purple-300">Записей аудита</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <div className="text-2xl">📝</div>
                  </div>
                  <div className="mt-2 text-xs text-purple-400">
                    За 30 дней
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-yellow-300">Ошибок системы</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <div className="text-2xl">⚠️</div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-400">
                    Требуют внимания
                  </div>
                </div>
              </div>
              
              {/* Заголовок раздела */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {sections.find(s => s.id === activeSection)?.icon}
                      {' '}
                      {sections.find(s => s.id === activeSection)?.name}
                    </h2>
                    <p className="text-gray-400">
                      {activeSection === 'dashboard' && 'Обзор системы и ключевые метрики'}
                      {activeSection === 'users' && 'Управление пользователями и их правами'}
                      {activeSection === 'roles' && 'Управление ролями и разрешениями'}
                      {activeSection === 'audit' && 'Просмотр логов безопасности и действий'}
                      {activeSection === 'settings' && 'Настройки системы и параметров'}
                      {activeSection === 'security' && 'Настройки безопасности и доступа'}
                      {activeSection === 'reports' && 'Аналитические отчеты и статистика'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm">
                      Обновить
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 text-sm">
                      Экспорт
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Контент раздела */}
              <div className="min-h-[400px]">
                {children}
              </div>
              
              {/* Информация о системе в футере */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                  <div>
                    <span className="text-gray-400">Система:</span>
                    <span className="ml-2 text-green-400">Демо-админка v1.0</span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="text-gray-400">Последнее обновление:</span>
                    <span className="ml-2">Сегодня, 14:30</span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="text-gray-400">Режим:</span>
                    <span className="ml-2 px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">
                      Демонстрационный
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
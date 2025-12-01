'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Навигация */}
      <nav className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Kwork Портфолио</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="https://kwork.ru" target="_blank" rel="noopener noreferrer" 
               className="text-gray-600 hover:text-gray-900 transition-colors">
              Перейти на Kwork
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
               className="text-gray-600 hover:text-gray-900 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Герой-секция */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Демонстрация Full-Stack навыков
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Интерактивные демо-проекты, показывающие мои навыки в веб-разработке,
          безопасности и создании современных веб-приложений
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/demo/admin-dashboard" 
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg">
            🔐 НОВОЕ: Админка с RBAC
          </Link>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
             className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            🚀 Деплой на Vercel
          </a>
        </div>
      </div>

      {/* Карточки демо-проектов */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">🎯 Демо-проекты</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Карточка админки */}
          <Link href="/demo/admin-dashboard">
            <div 
              className={`bg-white border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer ${
                hoveredCard === 'admin' ? 'ring-2 ring-red-500' : ''
              }`}
              onMouseEnter={() => setHoveredCard('admin')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <span className="text-2xl text-white">🔐</span>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  НОВОЕ
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">Административная панель</h3>
              <p className="text-gray-600 mb-4">
                Полноценная админка с системой RBAC, аудитом, управлением пользователями и настройками безопасности
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">JWT</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">RBAC</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Audit Logs</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">TypeScript</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm text-gray-500">
                  <span className="text-green-600 font-medium">●</span> Активно
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200">
                  Открыть демо →
                </button>
              </div>
            </div>
          </Link>

          {/* Карточка Full-Stack */}
          <Link href="/demo/fullstack">
            <div 
              className={`bg-white border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer ${
                hoveredCard === 'fullstack' ? 'ring-2 ring-blue-500' : ''
              }`}
              onMouseEnter={() => setHoveredCard('fullstack')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-2xl text-white">🌐</span>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  ПОПУЛЯРНОЕ
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">Full-Stack демо</h3>
              <p className="text-gray-600 mb-4">
                Интерактивная демонстрация полного цикла разработки от фронтенда до бэкенда с реальным API
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">React</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Next.js</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">API Routes</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Tailwind</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm text-gray-500">
                  <span className="text-green-600 font-medium">●</span> Активно
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                  Открыть демо →
                </button>
              </div>
            </div>
          </Link>

          {/* Карточка Telegram бота */}
          <Link href="/demo/telegram-bot">
            <div 
              className={`bg-white border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer ${
                hoveredCard === 'telegram' ? 'ring-2 ring-green-500' : ''
              }`}
              onMouseEnter={() => setHoveredCard('telegram')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <span className="text-2xl text-white">🤖</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  В РАЗРАБОТКЕ
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">Telegram Bot демо</h3>
              <p className="text-gray-600 mb-4">
                Демонстрация создания Telegram ботов с AI-интеграцией, вебхуками и базой данных
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Python</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">aiogram</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Webhook</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">PostgreSQL</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm text-gray-500">
                  <span className="text-yellow-600 font-medium">●</span> Скоро
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200">
                  Скоро будет →
                </button>
              </div>
            </div>
          </Link>

          {/* Карточка OSINT */}
          <Link href="/demo/osint-parser">
            <div 
              className={`bg-white border rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer ${
                hoveredCard === 'osint' ? 'ring-2 ring-orange-500' : ''
              }`}
              onMouseEnter={() => setHoveredCard('osint')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                  В РАЗРАБОТКЕ
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">OSINT & Парсинг</h3>
              <p className="text-gray-600 mb-4">
                Инструменты для сбора и анализа открытых данных с использованием Python и современных библиотек
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Python</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">BeautifulSoup</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Selenium</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Data Analysis</span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm text-gray-500">
                  <span className="text-yellow-600 font-medium">●</span> Скоро
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200">
                  Скоро будет →
                </button>
              </div>
            </div>
          </Link>

          {/* Карточка для будущих проектов */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="text-4xl mb-4 text-gray-400">✨</div>
            <h3 className="text-xl font-bold text-gray-500 mb-2">Ваш проект здесь</h3>
            <p className="text-gray-500 text-center mb-6">
              Есть идея для проекта? Свяжитесь со мной на Kwork для обсуждения!
            </p>
            <a href="https://kwork.ru" target="_blank" rel="noopener noreferrer"
               className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200">
              Написать на Kwork
            </a>
          </div>

          {/* Карточка технологий */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-indigo-800">🛠️ Технологический стек</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Frontend</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Next.js 14</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">TypeScript</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Tailwind CSS</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Backend</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Node.js</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Python</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">PostgreSQL</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Redis</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Инфраструктура</h4>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Docker</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Vercel</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">CI/CD</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">AWS</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-indigo-100">
                <p className="text-sm text-gray-600">
                  Все проекты полностью адаптивны, оптимизированы для SEO и готовы к продакшн деплою
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Блок преимуществ */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">✅ Мои преимущества</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Выгодная цена</h3>
            <p className="text-gray-600">
              Как новичок на Kwork, предлагаю стоимость на 30-40% ниже рыночной
            </p>
          </div>
          
          <div className="bg-white border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Быстрый старт</h3>
            <p className="text-gray-600">
              Приступаю к работе в течение 1-2 часов после получения предоплаты
            </p>
          </div>
          
          <div className="bg-white border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Фокус на качестве</h3>
            <p className="text-gray-600">
              Работаю только над вашим проектом, уделяя максимум внимания деталям
            </p>
          </div>
        </div>
      </div>

      {/* Футер */}
      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2025 Full-Stack Портфолио для Kwork. Все демо-проекты интерактивны.</p>
          <p className="text-sm mt-2 text-gray-500">
            Технологии: Next.js, React, TypeScript, Tailwind CSS, Node.js, Python
          </p>
          <div className="mt-4">
            <a href="/demo/admin-dashboard" className="inline-block px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              🔐 Админка (новое)
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
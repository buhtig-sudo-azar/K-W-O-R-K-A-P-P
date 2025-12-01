'use client'

import { useState } from 'react'

export default function UsersTable() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity">
          + Добавить пользователя
        </button>
      </div>

      <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-gray-400">
              Всего пользователей: 5
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Поиск пользователей..."
                  className="bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 pl-10 w-64 focus:outline-none focus:border-blue-500"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-left">Имя</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Роль</th>
                <th className="py-3 px-4 text-left">Статус</th>
                <th className="py-3 px-4 text-left">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-800/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="font-bold">A</span>
                    </div>
                    <span className="font-medium">Александр Иванов</span>
                  </div>
                </td>
                <td className="py-3 px-4">admin@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs">
                    Администратор
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs">
                    Активен
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                    Редактировать
                  </button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-800/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="font-bold">M</span>
                    </div>
                    <span className="font-medium">Мария Петрова</span>
                  </div>
                </td>
                <td className="py-3 px-4">editor@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">
                    Редактор
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs">
                    Активен
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                    Редактировать
                  </button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-800/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="font-bold">D</span>
                    </div>
                    <span className="font-medium">Дмитрий Сидоров</span>
                  </div>
                </td>
                <td className="py-3 px-4">viewer@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs">
                    Наблюдатель
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-xs">
                    Активен
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                    Редактировать
                  </button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-800/30">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="font-bold">A</span>
                    </div>
                    <span className="font-medium">Анна Козлова</span>
                  </div>
                </td>
                <td className="py-3 px-4">user@example.com</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                    Пользователь
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-xs">
                    Неактивен
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
                    Редактировать
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'

export default function UsersTable() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление пользователями</h2>
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
        <p className="text-gray-400 mb-4">Демонстрационная таблица пользователей</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <div className="font-medium">Александр Иванов</div>
            <div className="text-sm text-gray-400">admin@example.com</div>
            <div className="mt-2">
              <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded mr-2">Админ</span>
              <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">Активен</span>
            </div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-lg">
            <div className="font-medium">Мария Петрова</div>
            <div className="text-sm text-gray-400">editor@example.com</div>
            <div className="mt-2">
              <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded mr-2">Редактор</span>
              <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">Активен</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
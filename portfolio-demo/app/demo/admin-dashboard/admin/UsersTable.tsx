'use client'

import { useState } from 'react'

// Определяем полный интерфейс User
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  createdAt?: string // Делаем опциональным, чтобы совместимо с текущими данными
  lastLogin: string
  permissions?: string[] // Делаем опциональным
}

export default function UsersTable() {
  // Начальные данные, совместимые с интерфейсом
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: 'Александр Иванов', 
      email: 'admin@example.com', 
      role: 'admin', 
      status: 'active', 
      createdAt: '2024-01-15',
      lastLogin: '2 минуты назад',
      permissions: ['full_access']
    },
    { 
      id: 2, 
      name: 'Мария Петрова', 
      email: 'editor@example.com', 
      role: 'editor', 
      status: 'active', 
      createdAt: '2024-02-20',
      lastLogin: '1 час назад',
      permissions: ['content:read', 'content:write']
    },
    { 
      id: 3, 
      name: 'Дмитрий Сидоров', 
      email: 'viewer@example.com', 
      role: 'viewer', 
      status: 'active', 
      createdAt: '2024-03-05',
      lastLogin: '3 часа назад',
      permissions: ['content:read']
    },
    { 
      id: 4, 
      name: 'Анна Козлова', 
      email: 'user@example.com', 
      role: 'user', 
      status: 'inactive', 
      createdAt: '2024-03-10',
      lastLogin: '2 дня назад',
      permissions: []
    },
    { 
      id: 5, 
      name: 'Игорь Николаев', 
      email: 'igor@example.com', 
      role: 'user', 
      status: 'suspended', 
      createdAt: '2024-03-12',
      lastLogin: 'никогда',
      permissions: []
    },
  ])

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-purple-900/50 text-purple-300'
      case 'editor': return 'bg-blue-900/50 text-blue-300'
      case 'viewer': return 'bg-green-900/50 text-green-300'
      default: return 'bg-gray-800 text-gray-300'
    }
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-900/50 text-green-300'
      case 'inactive': return 'bg-red-900/50 text-red-300'
      case 'suspended': return 'bg-yellow-900/50 text-yellow-300'
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  // Функция для обновления статуса пользователя
  const updateUserStatus = (userId: number, newStatus: User['status']) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: newStatus,
            // Обеспечиваем, что все обязательные поля сохраняются
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin
          } 
        : user
    )
    setUsers(updatedUsers)
    alert(`Статус пользователя изменен на: ${
      newStatus === 'active' ? 'Активен' : 
      newStatus === 'inactive' ? 'Неактивен' : 'Приостановлен'
    }`)
  }

  // Функция для удаления пользователя
  const deleteUser = (userId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
      setSelectedUsers(prev => prev.filter(id => id !== userId))
      alert('Пользователь удален')
    }
  }

  // Функция для изменения роли пользователя
  const changeUserRole = (userId: number, newRole: User['role']) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole } 
        : user
    )
    setUsers(updatedUsers)
    alert(`Роль пользователя изменена на: ${
      newRole === 'admin' ? 'Администратор' : 
      newRole === 'editor' ? 'Редактор' :
      newRole === 'viewer' ? 'Наблюдатель' : 'Пользователь'
    }`)
  }

  // Функция для удаления выбранных пользователей
  const deleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return
    
    if (confirm(`Вы уверены, что хотите удалить ${selectedUsers.length} пользователей?`)) {
      const updatedUsers = users.filter(user => !selectedUsers.includes(user.id))
      setUsers(updatedUsers)
      setSelectedUsers([])
      alert(`Удалено ${selectedUsers.length} пользователей`)
    }
  }

  // Роли для изменения
  const availableRoles: User['role'][] = ['admin', 'editor', 'viewer', 'user']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление пользователями</h2>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity">
          + Добавить пользователя
        </button>
      </div>

      <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="rounded"
                checked={selectedUsers.length === users.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>Выбрать все</span>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">{selectedUsers.length} выбрано</span>
                <button 
                  onClick={deleteSelectedUsers}
                  className="px-3 py-1 bg-red-900/50 text-red-300 rounded-lg text-sm hover:bg-red-800/50 transition-colors"
                >
                  Удалить выбранных
                </button>
                <div className="relative group">
                  <button className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-lg text-sm hover:bg-blue-800/50 transition-colors">
                    Изменить роль
                  </button>
                  <div className="absolute hidden group-hover:block bg-gray-900 border border-gray-700 rounded-lg p-2 mt-1 z-10">
                    {availableRoles.map(role => (
                      <button
                        key={role}
                        className="block w-full text-left px-2 py-1 hover:bg-gray-800 rounded text-sm"
                        onClick={() => {
                          selectedUsers.forEach(userId => {
                            const user = users.find(u => u.id === userId)
                            if (user) changeUserRole(userId, role)
                          })
                        }}
                      >
                        {role === 'admin' ? 'Администратор' :
                         role === 'editor' ? 'Редактор' :
                         role === 'viewer' ? 'Наблюдатель' : 'Пользователь'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="py-3 px-4 text-left">Имя</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Роль</th>
                <th className="py-3 px-4 text-left">Статус</th>
                <th className="py-3 px-4 text-left">Последний вход</th>
                <th className="py-3 px-4 text-left">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="font-bold">{user.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' ? 'Администратор' :
                       user.role === 'editor' ? 'Редактор' :
                       user.role === 'viewer' ? 'Наблюдатель' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Активен' :
                       user.status === 'inactive' ? 'Неактивен' : 'Приостановлен'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateUserStatus(user.id, 'active')}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Активировать"
                      >
                        ✅
                      </button>
                      <button 
                        onClick={() => updateUserStatus(user.id, 'suspended')}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Приостановить"
                      >
                        ⏸️
                      </button>
                      <button 
                        onClick={() => {
                          const currentIndex = availableRoles.indexOf(user.role)
                          const nextIndex = (currentIndex + 1) % availableRoles.length
                          changeUserRole(user.id, availableRoles[nextIndex])
                        }}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Сменить роль"
                      >
                        🔄
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-1 hover:bg-red-900/50 rounded transition-colors"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Показано {users.length} из {users.length} пользователей
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors">
              ← Назад
            </button>
            <span className="text-sm">Страница 1 из 1</span>
            <button className="px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors">
              Вперед →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
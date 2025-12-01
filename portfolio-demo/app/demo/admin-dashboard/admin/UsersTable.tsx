'use client'

import { useState, useEffect } from 'react'

// Интерфейс для пользователя
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
  permissions: string[]
}

// Компонент таблицы пользователей
export default function UsersTable() {
  // Состояние для списка пользователей
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Состояние для поиска и фильтров
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  
  // Состояние для модальных окон
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditUser, setShowEditUser] = useState<User | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  // Форма для добавления/редактирования пользователя
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    role: 'user' as User['role'],
    status: 'active' as User['status']
  })
  
  // Загружаем пользователей при монтировании компонента
  useEffect(() => {
    fetchUsers()
  }, [])
  
  // Функция загрузки пользователей с API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Имитация запроса к API
      // В реальном проекте здесь был бы fetch с реальным API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Моковые данные (в реальном проекте получали бы с сервера)
      const mockData: User[] = [
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Главный Администратор',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-03-20T14:45:00Z',
          permissions: ['users:read', 'users:write', 'roles:manage', 'audit:view', 'settings:manage']
        },
        {
          id: '2',
          email: 'editor@example.com',
          name: 'Редактор Контента',
          role: 'editor',
          status: 'active',
          createdAt: '2024-02-01T09:15:00Z',
          lastLogin: '2024-03-19T11:20:00Z',
          permissions: ['content:read', 'content:write', 'media:upload', 'comments:moderate']
        },
        {
          id: '3',
          email: 'viewer@example.com',
          name: 'Наблюдатель Системы',
          role: 'viewer',
          status: 'active',
          createdAt: '2024-02-10T14:20:00Z',
          lastLogin: '2024-03-18T16:30:00Z',
          permissions: ['dashboard:view', 'reports:view', 'analytics:view']
        },
        {
          id: '4',
          email: 'user@example.com',
          name: 'Обычный Пользователь',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-03-01T08:45:00Z',
          lastLogin: '2024-03-15T10:00:00Z',
          permissions: ['profile:read', 'profile:write']
        },
        {
          id: '5',
          email: 'suspended@example.com',
          name: 'Заблокированный Аккаунт',
          role: 'user',
          status: 'suspended',
          createdAt: '2024-01-20T11:10:00Z',
          lastLogin: '2024-02-28T09:30:00Z',
          permissions: []
        }
      ]
      
      setUsers(mockData)
      
    } catch (err) {
      setError('Ошибка при загрузке пользователей')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    // Поиск по имени и email
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Фильтр по роли
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    // Фильтр по статусу
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })
  
  // Функция для добавления пользователя
  const handleAddUser = async () => {
    if (!userForm.email || !userForm.name) {
      alert('Заполните все обязательные поля')
      return
    }
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newUser: User = {
        id: (users.length + 1).toString(),
        email: userForm.email,
        name: userForm.name,
        role: userForm.role,
        status: userForm.status,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        permissions: []
      }
      
      setUsers([...users, newUser])
      setShowAddUser(false)
      setUserForm({ email: '', name: '', role: 'user', status: 'active' })
      
      alert('Пользователь успешно добавлен!')
      
    } catch (err) {
      alert('Ошибка при добавлении пользователя')
      console.error(err)
    }
  }
  
  // Функция для редактирования пользователя
  const handleEditUser = async () => {
    if (!showEditUser) return
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUsers = users.map(user => 
        user.id === showEditUser.id 
          ? { ...user, ...userForm }
          : user
      )
      
      setUsers(updatedUsers)
      setShowEditUser(null)
      setUserForm({ email: '', name: '', role: 'user', status: 'active' })
      
      alert('Пользователь успешно обновлен!')
      
    } catch (err) {
      alert('Ошибка при обновлении пользователя')
      console.error(err)
    }
  }
  
  // Функция для изменения статуса пользователя
  const handleToggleStatus = async (userId: string, currentStatus: User['status']) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      )
      
      setUsers(updatedUsers)
      
      alert(`Статус пользователя изменен на: ${newStatus === 'active' ? 'Активен' : 'Неактивен'}`)
      
    } catch (err) {
      alert('Ошибка при изменении статуса')
      console.error(err)
    }
  }
  
  // Функция для удаления пользователя
  const handleDeleteUser = async (userId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUsers = users.filter(user => user.id !== userId)
      setUsers(updatedUsers)
      setShowDeleteConfirm(null)
      
      alert('Пользователь успешно удален!')
      
    } catch (err) {
      alert('Ошибка при удалении пользователя')
      console.error(err)
    }
  }
  
  // Статистика по пользователям
  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    byRole: {
      admin: users.filter(u => u.role === 'admin').length,
      editor: users.filter(u => u.role === 'editor').length,
      viewer: users.filter(u => u.role === 'viewer').length,
      user: users.filter(u => u.role === 'user').length
    }
  }
  
  // Если загрузка
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка пользователей...</p>
        </div>
      </div>
    )
  }
  
  // Если ошибка
  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-xl font-bold mb-2">Ошибка</h3>
        <p className="text-gray-300 mb-4">{error}</p>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Панель управления */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Поиск и фильтры */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Поиск</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Имя или email..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Роль</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все роли</option>
                <option value="admin">Администратор</option>
                <option value="editor">Редактор</option>
                <option value="viewer">Наблюдатель</option>
                <option value="user">Пользователь</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Статус</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
                <option value="suspended">Заблокирован</option>
              </select>
            </div>
          </div>
          
          {/* Кнопки действий */}
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Добавить</span>
            </button>
            <button 
              onClick={fetchUsers}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Обновить</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-4">
          <p className="text-sm text-blue-300">Всего</p>
          <p className="text-2xl font-bold">{userStats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-4">
          <p className="text-sm text-green-300">Активных</p>
          <p className="text-2xl font-bold">{userStats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-700/30 rounded-xl p-4">
          <p className="text-sm text-yellow-300">Неактивных</p>
          <p className="text-2xl font-bold">{userStats.inactive}</p>
        </div>
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-700/30 rounded-xl p-4">
          <p className="text-sm text-red-300">Заблокированных</p>
          <p className="text-2xl font-bold">{userStats.suspended}</p>
        </div>
      </div>
      
      {/* Таблица пользователей */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Пользователь</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Роль</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Статус</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Дата создания</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Последний вход</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-900/50 text-purple-300' 
                        : user.role === 'editor'
                        ? 'bg-blue-900/50 text-blue-300'
                        : user.role === 'viewer'
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {user.role === 'admin' ? 'Админ' :
                       user.role === 'editor' ? 'Редактор' :
                       user.role === 'viewer' ? 'Наблюдатель' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-500 animate-pulse' 
                          : user.status === 'suspended'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}></div>
                      <span className={`${
                        user.status === 'active' 
                          ? 'text-green-400' 
                          : user.status === 'suspended'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }`}>
                        {user.status === 'active' ? 'Активен' :
                         user.status === 'suspended' ? 'Заблокирован' : 'Неактивен'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {new Date(user.lastLogin).toLocaleString('ru-RU')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setShowEditUser(user)
                          setUserForm({
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            status: user.status
                          })
                        }}
                        className="p-2 bg-blue-900/30 hover:bg-blue-800/50 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'active'
                            ? 'bg-yellow-900/30 hover:bg-yellow-800/50'
                            : 'bg-green-900/30 hover:bg-green-800/50'
                        }`}
                        title={user.status === 'active' ? 'Деактивировать' : 'Активировать'}
                      >
                        {user.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="p-2 bg-red-900/30 hover:bg-red-800/50 rounded-lg transition-colors"
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
        
        {/* Если пользователей нет */}
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-gray-400">Пользователи не найдены</p>
            <p className="text-sm text-gray-500 mt-1">Измените фильтры или добавьте нового пользователя</p>
          </div>
        )}
      </div>
      
      {/* Модальное окно добавления пользователя */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Добавить пользователя</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Имя *</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Имя пользователя"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Роль</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value as User['role']})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                    <option value="editor">Редактор</option>
                    <option value="viewer">Наблюдатель</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Статус</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value as User['status']})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                    <option value="suspended">Заблокирован</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-lg transition-all duration-200"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно редактирования пользователя */}
      {showEditUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Редактировать пользователя</h3>
              <p className="text-sm text-gray-400 mb-4">{showEditUser.email}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Имя *</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Роль</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value as User['role']})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                    <option value="editor">Редактор</option>
                    <option value="viewer">Наблюдатель</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Статус</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value as User['status']})}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                    <option value="suspended">Заблокирован</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditUser(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleEditUser}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="text-4xl text-red-500 mb-4 text-center">⚠️</div>
              <h3 className="text-xl font-bold mb-2 text-center">Подтвердите удаление</h3>
              <p className="text-gray-400 text-center mb-6">
                Вы уверены, что хотите удалить этого пользователя? 
                Это действие нельзя отменить.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg transition-all duration-200"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
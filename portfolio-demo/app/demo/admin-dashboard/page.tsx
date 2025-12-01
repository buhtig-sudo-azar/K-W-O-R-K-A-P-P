
'use client'

// Импортируем React хуки для состояния и эффектов
import { useState, useEffect } from 'react'
// Исправляем импорты - используем относительные пути
import AdminLayout from './admin/AdminLayout'
import UsersTable from './admin/UsersTable'

// Главный компонент страницы админки
export default function AdminDashboardPage() {
  // Состояния для отслеживания активного раздела и статистики
  const [activeSection, setActiveSection] = useState('dashboard')
  const [systemStats, setSystemStats] = useState({
    uptime: '99.8%',
    memoryUsage: '65%',
    cpuLoad: '42%',
    activeSessions: 3,
    pendingTasks: 2,
    securityAlerts: 1
  })
  
  // Состояние для логов безопасности
  const [securityLogs, setSecurityLogs] = useState([
    { id: 1, type: 'warning', message: 'Неудачная попытка входа с IP: 192.168.1.105', time: '10 минут назад' },
    { id: 2, type: 'info', message: 'Пользователь admin изменил настройки безопасности', time: '1 час назад' },
    { id: 3, type: 'success', message: 'Резервное копирование завершено успешно', time: '3 часа назад' },
    { id: 4, type: 'warning', message: 'Высокая нагрузка на сервер БД', time: '5 часов назад' }
  ])
  
  // Имитация загрузки данных при монтировании компонента
  useEffect(() => {
    // В реальном проекте здесь был бы запрос к API
    console.log('Admin dashboard mounted - loading data...')
    
    // Обновляем статистику каждые 10 секунд (в демо)
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpuLoad: (Math.random() * 30 + 30).toFixed(0) + '%'
      }))
    }, 10000)
    
    // Очистка интервала при размонтировании
    return () => clearInterval(interval)
  }, [])
  
  // Функция для рендеринга активного раздела
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Статистика системы */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-blue-300">Аптайм системы</p>
                    <p className="text-3xl font-bold mt-2">{systemStats.uptime}</p>
                  </div>
                  <div className="text-3xl">📈</div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: '99.8%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-700/30 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-green-300">Активных сессий</p>
                    <p className="text-3xl font-bold mt-2">{systemStats.activeSessions}</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-700/30 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-purple-300">Загрузка CPU</p>
                    <p className="text-3xl font-bold mt-2">{systemStats.cpuLoad}</p>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: systemStats.cpuLoad }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Графики и диаграммы */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-4">Распределение пользователей по ролям</h3>
                <div className="space-y-4">
                  {[
                    { role: 'Администраторы', count: 1, color: 'bg-purple-500' },
                    { role: 'Редакторы', count: 2, color: 'bg-blue-500' },
                    { role: 'Наблюдатели', count: 1, color: 'bg-green-500' },
                    { role: 'Пользователи', count: 2, color: 'bg-gray-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span>{item.role}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color}`}
                            style={{ width: `${(item.count / 6) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                <h3 className="font-bold text-lg mb-4">Активность системы</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">HTTP запросы</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">1,245</span>
                      <span className="text-xs text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                        +12%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Запросы к API</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">892</span>
                      <span className="text-xs text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                        +8%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Ошибки сервера</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">3</span>
                      <span className="text-xs text-red-400 bg-red-900/50 px-2 py-1 rounded-full">
                        -50%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Среднее время ответа</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">245ms</span>
                      <span className="text-xs text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded-full">
                        -15ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Логи безопасности */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Логи безопасности</h3>
                <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                  Показать все
                </button>
              </div>
              
              <div className="space-y-3">
                {securityLogs.map(log => (
                  <div 
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'warning' ? 'bg-yellow-500' :
                        log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <span>{log.message}</span>
                    </div>
                    <span className="text-sm text-gray-500">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'users':
        return <UsersTable />
      
      case 'roles':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/30 rounded-xl p-5">
              <h3 className="text-xl font-bold mb-3">Управление ролями (RBAC)</h3>
              <p className="text-gray-400 mb-4">
                Role-Based Access Control (RBAC) - система контроля доступа на основе ролей.
                Каждой роли назначаются разрешения, а пользователям назначаются роли.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h4 className="font-medium mb-2">📋 Основные роли</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span>Администратор</span>
                      <span className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full">
                        Полный доступ
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Редактор</span>
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full">
                        Контент + Медиа
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Наблюдатель</span>
                      <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded-full">
                        Только чтение
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Пользователь</span>
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                        Базовая
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <h4 className="font-medium mb-2">🔐 Разрешения</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">users:read</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">users:write</span>
                      <span className="text-red-400">✗</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">content:read</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">content:write</span>
                      <span className="text-green-400">✓</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">audit:read</span>
                      <span className="text-red-400">✗</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4">Матрица разрешений</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="py-2 px-3 text-left">Разрешение</th>
                      <th className="py-2 px-3 text-center">Админ</th>
                      <th className="py-2 px-3 text-center">Редактор</th>
                      <th className="py-2 px-3 text-center">Наблюдатель</th>
                      <th className="py-2 px-3 text-center">Пользователь</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {[
                      { permission: 'users:read', admin: '✓', editor: '✓', viewer: '✗', user: '✗' },
                      { permission: 'users:write', admin: '✓', editor: '✗', viewer: '✗', user: '✗' },
                      { permission: 'content:read', admin: '✓', editor: '✓', viewer: '✓', user: '✗' },
                      { permission: 'content:write', admin: '✓', editor: '✓', viewer: '✗', user: '✗' },
                      { permission: 'audit:read', admin: '✓', editor: '✓', viewer: '✗', user: '✗' },
                      { permission: 'settings:write', admin: '✓', editor: '✗', viewer: '✗', user: '✗' }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-700/30">
                        <td className="py-2 px-3">{row.permission}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-1 rounded ${row.admin === '✓' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {row.admin}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-1 rounded ${row.editor === '✓' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {row.editor}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-1 rounded ${row.viewer === '✓' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {row.viewer}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-1 rounded ${row.user === '✓' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {row.user}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      
      case 'audit':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-700/30 rounded-xl p-5">
              <h3 className="text-xl font-bold mb-3">Система аудита и логирования</h3>
              <p className="text-gray-400">
                Все действия пользователей, попытки доступа и изменения в системе логируются
                для обеспечения безопасности и отслеживаемости.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Всего записей</h4>
                  <span className="text-2xl font-bold">156</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">За последние 30 дней</div>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Успешных действий</h4>
                  <span className="text-2xl font-bold text-green-400">142</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">91% успешных операций</div>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Предупреждений</h4>
                  <span className="text-2xl font-bold text-yellow-400">14</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">Требуют внимания</div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4">Последние записи аудита</h3>
              <div className="space-y-3">
                {[
                  { action: 'user_login', user: 'admin@example.com', ip: '192.168.1.100', time: '2 минуты назад', status: 'success' },
                  { action: 'user_create', user: 'admin@example.com', ip: '192.168.1.100', time: '1 час назад', status: 'success' },
                  { action: 'permission_denied', user: 'viewer@example.com', ip: '192.168.1.102', time: '3 часа назад', status: 'failed' },
                  { action: 'role_update', user: 'admin@example.com', ip: '192.168.1.100', time: '5 часов назад', status: 'success' },
                  { action: 'failed_login', user: 'unknown', ip: '203.0.113.45', time: '1 день назад', status: 'failed' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-500">{log.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{log.time}</p>
                      <p className="text-xs text-gray-500">{log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-700/30 rounded-xl p-5">
              <h3 className="text-xl font-bold mb-3">Настройки безопасности</h3>
              <p className="text-gray-400 mb-4">
                Конфигурация параметров безопасности системы, включая аутентификацию, авторизацию и мониторинг.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                <h4 className="font-bold text-lg mb-4">🔐 Параметры аутентификации</h4>
                <div className="space-y-4">
                  {[
                    { setting: 'Двухфакторная аутентификация', value: 'Включена', enabled: true },
                    { setting: 'Минимальная длина пароля', value: '12 символов', enabled: true },
                    { setting: 'Блокировка при 5 ошибках', value: '15 минут', enabled: true },
                    { setting: 'Срок действия сессии', value: '24 часа', enabled: true },
                    { setting: 'HTTPS принудительно', value: 'Включено', enabled: true }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{item.setting}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{item.value}</span>
                        <div className={`w-3 h-3 rounded-full ${item.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
                <h4 className="font-bold text-lg mb-4">🛡️ Мониторинг безопасности</h4>
                <div className="space-y-4">
                  {[
                    { setting: 'Мониторинг необычной активности', status: 'Активен', level: 'high' },
                    { setting: 'Сканирование уязвимостей', status: 'Ежедневно', level: 'medium' },
                    { setting: 'Резервное копирование', status: 'Каждые 6 часов', level: 'high' },
                    { setting: 'Антивирусная проверка', status: 'Включена', level: 'high' },
                    { setting: 'Firewall', status: 'Активен', level: 'critical' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{item.setting}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.level === 'critical' ? 'bg-red-900/50 text-red-300' :
                          item.level === 'high' ? 'bg-orange-900/50 text-orange-300' :
                          'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-5">
              <h4 className="font-bold text-lg mb-4">⚠️ Активные предупреждения</h4>
              <div className="space-y-3">
                {[
                  { type: 'critical', message: 'Обнаружена попытка брутфорса с IP 203.0.113.45', time: '10 минут назад' },
                  { type: 'warning', message: 'Срок действия SSL сертификата истекает через 7 дней', time: '1 день назад' },
                  { type: 'info', message: 'Требуется обновление системы безопасности', time: '3 дня назад' }
                ].map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    alert.type === 'critical' ? 'bg-red-900/30 border border-red-700/50' :
                    alert.type === 'warning' ? 'bg-yellow-900/30 border border-yellow-700/50' :
                    'bg-blue-900/30 border border-blue-700/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`text-xl ${
                          alert.type === 'critical' ? 'text-red-400' :
                          alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                        }`}>
                          {alert.type === 'critical' ? '🚨' :
                           alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </div>
                        <span>{alert.message}</span>
                      </div>
                      <span className="text-sm text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">Добро пожаловать в админку</h3>
            <p className="text-gray-400">
              Выберите раздел в боковой панели для начала работы
            </p>
          </div>
        )
    }
  }
  
  // Рендерим лэйаут админки и активный раздел
  return (
    <AdminLayout>
      {renderActiveSection()}
    </AdminLayout>
  )
}
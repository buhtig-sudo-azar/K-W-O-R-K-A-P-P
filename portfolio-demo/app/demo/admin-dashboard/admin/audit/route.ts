// Импортируем Next.js типы
import { NextRequest, NextResponse } from 'next/server'

// Интерфейс для записи аудита
interface AuditLog {
  id: string
  action: string
  userId: string
  userEmail: string
  userRole: string
  resourceType: string
  resourceId: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: string
  status: 'success' | 'failed'
}

// Моковые данные аудита
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'user_login',
    userId: '1',
    userEmail: 'admin@example.com',
    userRole: 'admin',
    resourceType: 'auth',
    resourceId: 'session_123',
    details: { method: 'jwt', provider: 'credentials' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-20T14:45:00Z',
    status: 'success'
  },
  {
    id: '2',
    action: 'user_create',
    userId: '1',
    userEmail: 'admin@example.com',
    userRole: 'admin',
    resourceType: 'user',
    resourceId: '4',
    details: { email: 'user@example.com', role: 'user' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-01T08:45:00Z',
    status: 'success'
  },
  {
    id: '3',
    action: 'user_update',
    userId: '2',
    userEmail: 'editor@example.com',
    userRole: 'editor',
    resourceType: 'user',
    resourceId: '3',
    details: { field: 'name', oldValue: 'John', newValue: 'John Doe' },
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    timestamp: '2024-03-19T11:20:00Z',
    status: 'success'
  },
  {
    id: '4',
    action: 'permission_denied',
    userId: '3',
    userEmail: 'viewer@example.com',
    userRole: 'viewer',
    resourceType: 'user',
    resourceId: '2',
    details: { requiredPermission: 'users:write' },
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
    timestamp: '2024-03-18T16:30:00Z',
    status: 'failed'
  },
  {
    id: '5',
    action: 'role_assign',
    userId: '1',
    userEmail: 'admin@example.com',
    userRole: 'admin',
    resourceType: 'role',
    resourceId: 'editor',
    details: { userId: '5', oldRole: 'user', newRole: 'editor' },
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-03-20T09:15:00Z',
    status: 'success'
  }
]

// Middleware для проверки токена
function verifyToken(token: string | null): boolean {
  if (!token) return false
  return token.startsWith('demo_token_')
}

// Middleware для проверки прав доступа к аудиту
function checkAuditPermission(userRole: string): boolean {
  // Только администраторы и некоторые редакторы могут смотреть аудит
  const allowedRoles = ['admin', 'editor']
  return allowedRoles.includes(userRole)
}

// GET запрос для получения логов аудита
export async function GET(request: NextRequest) {
  // Проверяем авторизацию
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  // Проверяем права доступа (в демо используем роль admin)
  if (!checkAuditPermission('admin')) {
    return NextResponse.json(
      { error: 'Forbidden: Audit logs access denied' },
      { status: 403 }
    )
  }
  
  // Получаем параметры запроса
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Фильтрация логов
  let filteredLogs = [...mockAuditLogs]
  
  if (action) {
    filteredLogs = filteredLogs.filter(log => 
      log.action.toLowerCase().includes(action.toLowerCase())
    )
  }
  
  if (userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === userId)
  }
  
  if (status) {
    filteredLogs = filteredLogs.filter(log => log.status === status)
  }
  
  // Фильтрация по дате
  if (startDate) {
    const start = new Date(startDate)
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) >= start
    )
  }
  
  if (endDate) {
    const end = new Date(endDate)
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.timestamp) <= end
    )
  }
  
  // Сортировка по времени (новые сверху)
  filteredLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  
  // Пагинация
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex)
  
  // Агрегированные статистики
  const totalLogs = filteredLogs.length
  const successCount = filteredLogs.filter(log => log.status === 'success').length
  const failedCount = totalLogs - successCount
  
  const actionsCount: Record<string, number> = {}
  filteredLogs.forEach(log => {
    actionsCount[log.action] = (actionsCount[log.action] || 0) + 1
  })
  
  // Возвращаем ответ
  return NextResponse.json({
    success: true,
    data: {
      logs: paginatedLogs,
      statistics: {
        total: totalLogs,
        success: successCount,
        failed: failedCount,
        successRate: totalLogs > 0 ? (successCount / totalLogs * 100).toFixed(1) : 0,
        actionsCount
      },
      pagination: {
        page,
        limit,
        total: totalLogs,
        totalPages: Math.ceil(totalLogs / limit)
      }
    },
    message: 'Audit logs retrieved successfully'
  })
}
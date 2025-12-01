// Импортируем необходимые модули из Next.js
import { NextRequest, NextResponse } from 'next/server'

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

// Моковые данные пользователей (имитация базы данных)
// В реальном проекте здесь был бы запрос к реальной БД
const mockUsers: User[] = [
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

// Middleware для проверки JWT токена
// В реальном проекте здесь была бы проверка подписи и сроков действия токена
function verifyToken(token: string | null): boolean {
  // Имитация проверки токена
  if (!token) return false
  // В демо-режиме считаем все токены валидными
  return token.startsWith('demo_token_')
}

// Middleware для проверки прав доступа
function checkPermission(userRole: string, requiredPermission: string): boolean {
  // Матрица прав доступа
  const rolePermissions: Record<string, string[]> = {
    'admin': ['users:read', 'users:write', 'roles:manage', 'audit:view', 'settings:manage'],
    'editor': ['content:read', 'content:write', 'media:upload', 'comments:moderate'],
    'viewer': ['dashboard:view', 'reports:view', 'analytics:view'],
    'user': ['profile:read', 'profile:write']
  }
  
  return rolePermissions[userRole]?.includes(requiredPermission) || false
}

// Основной обработчик API маршрута
// Этот файл обрабатывает все HTTP методы для /api/admin/users
export async function GET(request: NextRequest) {
  // Получаем заголовок авторизации
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  // Проверяем токен
  if (!verifyToken(token)) {
    // Если токен невалиден, возвращаем 401 Unauthorized
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  // Проверяем права доступа
  if (!checkPermission('admin', 'users:read')) {
    // Если недостаточно прав, возвращаем 403 Forbidden
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    )
  }
  
  // Получаем query параметры из URL
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  
  // Фильтрация пользователей по параметрам
  let filteredUsers = [...mockUsers]
  
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role)
  }
  
  if (status) {
    filteredUsers = filteredUsers.filter(user => user.status === status)
  }
  
  // Пагинация
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  
  // Возвращаем успешный ответ с данными
  return NextResponse.json({
    success: true,
    data: {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      },
      filters: {
        role,
        status
      }
    },
    message: 'Users retrieved successfully'
  })
}

// Обработчик для создания нового пользователя (POST запрос)
export async function POST(request: NextRequest) {
  // Проверяем токен
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  // Проверяем права на создание пользователей
  if (!checkPermission('admin', 'users:write')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    )
  }
  
  try {
    // Парсим тело запроса (данные нового пользователя)
    const body = await request.json()
    
    // Валидация обязательных полей
    if (!body.email || !body.name || !body.role) {
      return NextResponse.json(
        { error: 'Validation failed: email, name, and role are required' },
        { status: 400 }
      )
    }
    
    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Validation failed: invalid email format' },
        { status: 400 }
      )
    }
    
    // Проверка, что email уникален
    const emailExists = mockUsers.some(user => user.email === body.email)
    if (emailExists) {
      return NextResponse.json(
        { error: 'Validation failed: email already exists' },
        { status: 409 }
      )
    }
    
    // Создаем нового пользователя
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: body.email,
      name: body.name,
      role: body.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      permissions: []
    }
    
    // В реальном проекте здесь был бы INSERT в базу данных
    mockUsers.push(newUser)
    
    // Логируем действие (в реальном проекте сохраняли бы в таблицу аудита)
    console.log(`User created: ${newUser.email} by admin`)
    
    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    }, { status: 201 })
    
  } catch (error) {
    // Обработка ошибок парсинга JSON
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    )
  }
}

// Обработчик для обновления пользователя (PUT запрос)
export async function PUT(request: NextRequest) {
  // Проверяем токен и права доступа
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  if (!checkPermission('admin', 'users:write')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    // Находим пользователя по ID
    const userIndex = mockUsers.findIndex(user => user.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Обновляем пользователя
    const updatedUser = {
      ...mockUsers[userIndex],
      ...body,
      id: mockUsers[userIndex].id, // ID нельзя менять
      email: mockUsers[userIndex].email // Email тоже нельзя менять
    }
    
    // В реальном проекте был бы UPDATE в базе данных
    mockUsers[userIndex] = updatedUser
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

// Обработчик для удаления пользователя (DELETE запрос)
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  if (!checkPermission('admin', 'users:write')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403 }
    )
  }
  
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')
  
  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    )
  }
  
  // Находим пользователя
  const userIndex = mockUsers.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  // Вместо удаления меняем статус (мягкое удаление)
  mockUsers[userIndex].status = 'inactive'
  
  return NextResponse.json({
    success: true,
    message: 'User deactivated successfully'
  })
}
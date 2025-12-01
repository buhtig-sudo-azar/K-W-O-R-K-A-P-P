import { NextRequest, NextResponse } from 'next/server'

// Интерфейс для роли
interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
  isDefault: boolean
  userCount: number
}

// Моковые данные ролей
const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Администратор',
    description: 'Полный доступ ко всем функциям системы',
    permissions: [
      'users:read', 'users:write', 'users:delete',
      'roles:read', 'roles:write', 'roles:delete',
      'audit:read', 'settings:read', 'settings:write',
      'content:read', 'content:write', 'content:delete',
      'media:upload', 'media:delete', 'comments:moderate'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z',
    isDefault: false,
    userCount: 1
  },
  {
    id: 'editor',
    name: 'Редактор',
    description: 'Может создавать и редактировать контент, управлять медиа',
    permissions: [
      'content:read', 'content:write', 'content:delete',
      'media:upload', 'comments:moderate'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
    isDefault: false,
    userCount: 2
  },
  {
    id: 'viewer',
    name: 'Наблюдатель',
    description: 'Может только просматривать контент и отчеты',
    permissions: [
      'dashboard:view', 'reports:view', 'analytics:view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-28T09:15:00Z',
    isDefault: false,
    userCount: 1
  },
  {
    id: 'user',
    name: 'Пользователь',
    description: 'Базовая роль с ограниченными правами',
    permissions: [
      'profile:read', 'profile:write'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-10T11:45:00Z',
    isDefault: true,
    userCount: 2
  }
]

// Список всех доступных разрешений в системе
const allPermissions = [
  // Пользователи
  'users:read', 'users:write', 'users:delete',
  // Роли
  'roles:read', 'roles:write', 'roles:delete',
  // Аудит
  'audit:read',
  // Настройки
  'settings:read', 'settings:write',
  // Контент
  'content:read', 'content:write', 'content:delete',
  // Медиа
  'media:upload', 'media:delete',
  // Комментарии
  'comments:moderate',
  // Дашборд
  'dashboard:view',
  // Отчеты
  'reports:view',
  // Аналитика
  'analytics:view',
  // Профиль
  'profile:read', 'profile:write'
]

// Проверка токена
function verifyToken(token: string | null): boolean {
  if (!token) return false
  return token.startsWith('demo_token_')
}

// Проверка прав доступа к управлению ролями
function checkRolesPermission(userRole: string): boolean {
  const allowedRoles = ['admin']
  return allowedRoles.includes(userRole)
}

// GET запрос - получение всех ролей
export async function GET(request: NextRequest) {
  // Проверка авторизации
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  // Проверка прав доступа
  if (!checkRolesPermission('admin')) {
    return NextResponse.json(
      { error: 'Forbidden: Role management access denied' },
      { status: 403 }
    )
  }
  
  // Возвращаем список ролей и всех доступных разрешений
  return NextResponse.json({
    success: true,
    data: {
      roles: mockRoles,
      allPermissions,
      statistics: {
        totalRoles: mockRoles.length,
        totalPermissions: allPermissions.length,
        permissionsByCategory: {
          users: allPermissions.filter(p => p.startsWith('users:')).length,
          roles: allPermissions.filter(p => p.startsWith('roles:')).length,
          content: allPermissions.filter(p => p.startsWith('content:')).length,
          media: allPermissions.filter(p => p.startsWith('media:')).length,
          settings: allPermissions.filter(p => p.startsWith('settings:')).length
        }
      }
    },
    message: 'Roles retrieved successfully'
  })
}

// POST запрос - создание новой роли
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  if (!checkRolesPermission('admin')) {
    return NextResponse.json(
      { error: 'Forbidden: Role creation denied' },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json()
    
    // Валидация входных данных
    if (!body.name || !body.description || !body.permissions) {
      return NextResponse.json(
        { error: 'Name, description, and permissions are required' },
        { status: 400 }
      )
    }
    
    // Проверка, что роль с таким именем не существует
    const roleExists = mockRoles.some(role => 
      role.name.toLowerCase() === body.name.toLowerCase()
    )
    
    if (roleExists) {
      return NextResponse.json(
        { error: 'Role with this name already exists' },
        { status: 409 }
      )
    }
    
    // Проверка, что все разрешения валидны
    const invalidPermissions = body.permissions.filter(
      (permission: string) => !allPermissions.includes(permission)
    )
    
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Создаем новую роль
    const newRole: Role = {
      id: body.name.toLowerCase().replace(/\s+/g, '_'),
      name: body.name,
      description: body.description,
      permissions: body.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false,
      userCount: 0
    }
    
    // В реальном проекте сохраняли бы в БД
    mockRoles.push(newRole)
    
    return NextResponse.json({
      success: true,
      data: newRole,
      message: 'Role created successfully'
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

// PUT запрос - обновление роли
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  if (!checkRolesPermission('admin')) {
    return NextResponse.json(
      { error: 'Forbidden: Role update denied' },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const roleId = searchParams.get('id')
    
    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      )
    }
    
    // Находим роль
    const roleIndex = mockRoles.findIndex(role => role.id === roleId)
    
    if (roleIndex === -1) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }
    
    // Нельзя обновлять дефолтную роль 'user'
    if (mockRoles[roleIndex].isDefault && roleId === 'user') {
      return NextResponse.json(
        { error: 'Cannot modify default user role' },
        { status: 400 }
      )
    }
    
    // Обновляем роль
    const updatedRole = {
      ...mockRoles[roleIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    // Проверка разрешений, если они предоставлены
    if (body.permissions) {
      const invalidPermissions = body.permissions.filter(
        (permission: string) => !allPermissions.includes(permission)
      )
      
      if (invalidPermissions.length > 0) {
        return NextResponse.json(
          { error: `Invalid permissions: ${invalidPermissions.join(', ')}` },
          { status: 400 }
        )
      }
      
      updatedRole.permissions = body.permissions
    }
    
    mockRoles[roleIndex] = updatedRole
    
    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully'
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

// DELETE запрос - удаление роли
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!verifyToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing token' },
      { status: 401 }
    )
  }
  
  if (!checkRolesPermission('admin')) {
    return NextResponse.json(
      { error: 'Forbidden: Role deletion denied' },
      { status: 403 }
    )
  }
  
  const { searchParams } = new URL(request.url)
  const roleId = searchParams.get('id')
  
  if (!roleId) {
    return NextResponse.json(
      { error: 'Role ID is required' },
      { status: 400 }
    )
  }
  
  // Находим роль
  const roleIndex = mockRoles.findIndex(role => role.id === roleId)
  
  if (roleIndex === -1) {
    return NextResponse.json(
      { error: 'Role not found' },
      { status: 404 }
    )
  }
  
  // Нельзя удалить дефолтную роль
  if (mockRoles[roleIndex].isDefault) {
    return NextResponse.json(
      { error: 'Cannot delete default role' },
      { status: 400 }
    )
  }
  
  // Нельзя удалить роль, если есть пользователи с этой ролью
  if (mockRoles[roleIndex].userCount > 0) {
    return NextResponse.json(
      { error: 'Cannot delete role with assigned users' },
      { status: 400 }
    )
  }
  
  // Удаляем роль
  const deletedRole = mockRoles.splice(roleIndex, 1)[0]
  
  return NextResponse.json({
    success: true,
    data: deletedRole,
    message: 'Role deleted successfully'
  })
}
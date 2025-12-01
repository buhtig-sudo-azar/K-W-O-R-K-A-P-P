'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function FullstackDemo() {
  const router = useRouter()
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [activeBackendCode, setActiveBackendCode] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [timerPaused, setTimerPaused] = useState(false)
  const [extendedTime, setExtendedTime] = useState(0)
  const [showHomeButton, setShowHomeButton] = useState(false)
  const [scrolledDown, setScrolledDown] = useState(false)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [footerInView, setFooterInView] = useState(false)
  const [showRoundHomeButton, setShowRoundHomeButton] = useState(false)
  
  const cardRefs = useRef<{[key: string]: HTMLDivElement | null}>({})
  const codeModalRef = useRef<HTMLDivElement>(null)
  const touchStartTime = useRef<number>(0)
  const hoverStartTime = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const extensionRef = useRef<NodeJS.Timeout | null>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const requestButtonRef = useRef<HTMLButtonElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  // Функция для перехода на главную страницу
  const handleGoHome = () => {
    router.push('/')
  }

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (extensionRef.current) clearTimeout(extensionRef.current)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [])

  // Обработка скролла для управления видимостью кнопок
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContainerRef.current) return
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Сохраняем позицию скролла
      setScrollPosition(scrollTop)
      lastScrollY.current = scrollTop
      
      // Определяем, проскроллили ли мы достаточно далеко вниз
      setScrolledDown(scrollTop > 100)
      
      // Определяем, показывать ли кнопку "Наверх" (разные пороги для мобильных и десктопа)
      const mobileThreshold = windowHeight * 0.5
      const desktopThreshold = 300
      const threshold = isMobile ? mobileThreshold : desktopThreshold
      setShowScrollToTop(scrollTop > threshold)
      
      // Показывать круглую кнопку возврата на главную после небольшого скролла
      // На мобильных показываем всегда
      if (isMobile) {
        setShowRoundHomeButton(true)
      } else {
        setShowRoundHomeButton(scrollTop > 100)
      }
      
      // Вычисляем прозрачность для фиксированной кнопки (только для мобильных)
      let opacity = 1
      if (isMobile && scrollTop > 50) {
        opacity = Math.max(0.3, 1 - (scrollTop - 50) / 200)
      }
      setScrollOpacity(opacity)
      
      // Проверяем, виден ли футер (для десктопной версии)
      if (footerRef.current && !isMobile) {
        const footerRect = footerRef.current.getBoundingClientRect()
        const footerInViewport = footerRect.top <= windowHeight && footerRect.bottom >= 0
        setFooterInView(footerInViewport)
      }
      
      // Дебаунсинг для оптимизации
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        // Только обновляем состояние после остановки скролла
      }, 100)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Вызываем сразу для инициализации
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Фокус на модальное окно при открытии
  useEffect(() => {
    if (activeTooltip && codeModalRef.current) {
      codeModalRef.current.focus()
    }
  }, [activeTooltip])

  // Основной таймер для автоматического сброса
  useEffect(() => {
    if (!success || timerPaused) return
    
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else {
      resetToInitialState()
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [success, countdown, timerPaused])

  // Показываем кнопку возврата когда осталось мало времени
  useEffect(() => {
    if (success && countdown <= 10) {
      setShowHomeButton(true)
    }
  }, [success, countdown])

  // Функция сброса в начальное состояние
  const resetToInitialState = () => {
    setSuccess(false)
    setResponse(null)
    setCountdown(30)
    setActiveTooltip(null)
    setActiveBackendCode(null)
    setHoveredCard(null)
    setTimerPaused(false)
    setExtendedTime(0)
    setShowHomeButton(false)
    setScrolledDown(false)
    setScrollOpacity(1)
    setShowScrollToTop(false)
    setScrollPosition(0)
    setFooterInView(false)
    setShowRoundHomeButton(false)
  }

  // Функция для продления времени при взаимодействии
  const extendTimer = (seconds: number) => {
    if (!success) return
    
    // Останавливаем текущий таймер
    setTimerPaused(true)
    
    // Показываем сообщение о продлении
    setExtendedTime(seconds)
    
    // Через 2 секунды возобновляем таймер
    setTimeout(() => {
      setTimerPaused(false)
      setExtendedTime(0)
    }, 2000)
    
    // Обновляем счетчик
    setCountdown(prev => Math.min(30, prev + seconds))
  }

  // Обработчик для разных платформ
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Element
      if (!target.closest('.backend-tooltip') && !target.closest('.data-card') && activeTooltip) {
        setActiveTooltip(null)
        setActiveBackendCode(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('touchend', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [activeTooltip])

  const handleApiCall = async () => {
    if (success) return
    
    setLoading(true)
    setSuccess(false)
    setActiveTooltip(null)
    setActiveBackendCode(null)
    setHoveredCard(null)
    setTimerPaused(false)
    setExtendedTime(0)
    setShowHomeButton(false)
    setScrolledDown(false)
    setScrollOpacity(1)
    setShowScrollToTop(false)
    setScrollPosition(0)
    setFooterInView(false)
    setShowRoundHomeButton(isMobile) // На мобильных показываем круглую кнопку
    
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'demo', 
          timestamp: new Date().toISOString(),
          client: 'React Demo App',
          platform: isMobile ? 'mobile' : 'desktop',
          demoData: {
            projectName: 'FullStack Портфолио',
            technologies: ['React', 'Node.js', 'TypeScript', 'Tailwind'],
            status: 'active',
            performanceScore: 95,
            features: ['API интеграции', 'Real-time обновления', 'Адаптивный дизайн']
          }
        })
      })
      
      if (!res.ok) {
        throw new Error(`Ошибка сервера: ${res.status}`)
      }
      
      const data = await res.json()
      setResponse(data)
      setSuccess(true)
      setLoading(false)
      
    } catch (error) {
      console.error('Ошибка:', error)
      // Демо-данные для отображения
      setResponse({
        success: true,
        message: 'Демо-режим: данные успешно обработаны',
        data: {
          action: 'demo',
          timestamp: new Date().toISOString(),
          client: 'React Demo App',
          serverProcessed: true,
          processingTime: '350ms',
          server: 'Vercel Serverless Function',
          demoMode: true,
          projectInfo: {
            name: 'Демо Проект',
            stack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js API', 'Node.js'],
            status: 'В разработке',
            progress: 85
          },
          analytics: {
            requests: 128,
            uptime: '99.8%',
            responseTime: '45ms avg',
            performanceScore: 95
          }
        },
        architecture: {
          frontend: 'React + TypeScript',
          backend: 'Next.js API Routes',
          database: 'Mock Data',
          deployment: 'Vercel'
        }
      })
      setSuccess(true)
      setLoading(false)
    }
  }

  // Функция для прокрутки в начало
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setScrolledDown(false)
    setScrollOpacity(1)
    setShowScrollToTop(false)
    setShowRoundHomeButton(isMobile ? true : false)
  }

  // Обработчик для десктопа (наведение с задержкой)
  const handleDesktopInteraction = (field: string, e: React.MouseEvent) => {
    if (e.type === 'mouseenter') {
      hoverStartTime.current = Date.now()
      setHoveredCard(field)
      
      // Через 2 секунды наведения продлеваем время
      extensionRef.current = setTimeout(() => {
        extendTimer(10) // Продлеваем на 10 секунд
      }, 2000)
      
    } else if (e.type === 'mouseleave') {
      setHoveredCard(null)
      if (extensionRef.current) clearTimeout(extensionRef.current)
      
    } else if (e.type === 'click') {
      e.preventDefault()
      e.stopPropagation()
      
      setActiveTooltip(field)
      setActiveBackendCode(field)
      extendTimer(15) // Продлеваем на 15 секунд при клике
    }
  }

  // Обработчик для мобильных (тап с длительным нажатием)
  const handleMobileInteraction = (field: string, e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const now = Date.now()
    
    if (e.type === 'touchstart') {
      touchStartTime.current = now
      
      // Для мобильных сразу показываем тултип
      setActiveTooltip(field)
      setActiveBackendCode(field)
      extendTimer(15) // Продлеваем на 15 секунд при тапе
      
    } else if (e.type === 'touchend') {
      const duration = now - touchStartTime.current
      
      if (duration > 1000) { // Долгое нажатие
        extendTimer(20) // Дополнительное время за долгое нажатие
      }
    }
  }

  // Бэкенд код для каждого поля
  const backendCodeSnippets: {[key: string]: {code: string, description: string}} = {
    projectName: {
      code: `// app/api/project/route.ts - Создание нового проекта
export async function POST(request: Request) {
  try {
    const { projectName, technologies, description } = await request.json();
    
    // Валидация входных данных
    if (!projectName || !technologies?.length) {
      return Response.json(
        { error: 'Название проекта и технологии обязательны' },
        { status: 400 }
      );
    }
    
    // Санитизация данных
    const sanitizedName = sanitizeHtml(projectName);
    const validTechnologies = technologies
      .filter((tech: string) => ALLOWED_TECHNOLOGIES.includes(tech))
      .slice(0, 10); // Ограничиваем количество технологий
    
    // Создание проекта в базе данных
    const project = await db.project.create({
      data: {
        name: sanitizedName,
        technologies: validTechnologies,
        description: description || '',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Логирование события
    await logAction('project_created', { projectId: project.id });
    
    // Возвращаем созданный проект
    return Response.json({
      success: true,
      data: {
        id: project.id,
        name: project.name,
        technologies: project.technologies,
        createdAt: project.createdAt
      },
      message: 'Проект успешно создан'
    });
    
  } catch (error) {
    console.error('Ошибка создания проекта:', error);
    return Response.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}`,
      description: 'Код API для создания нового проекта с валидацией и сохранением в БД'
    },

    status: {
      code: `// app/api/project/[id]/status/route.ts - Обновление статуса проекта
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const projectId = params.id;
    
    // Проверка валидности статуса
    const validStatuses = ['draft', 'active', 'paused', 'completed', 'archived'];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { error: 'Недопустимый статус проекта' },
        { status: 400 }
      );
    }
    
    // Проверка существования проекта
    const existingProject = await db.project.findUnique({
      where: { id: projectId }
    });
    
    if (!existingProject) {
      return Response.json(
        { error: 'Проект не найден' },
        { status: 404 }
      );
    }
    
    // Обновление статуса
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: { 
        status,
        updatedAt: new Date()
      }
    });
    
    // Отправка уведомлений
    if (status === 'completed') {
      await sendEmailNotification({
        to: existingProject.ownerEmail,
        subject: 'Проект завершен',
        body: \`Проект "\${existingProject.name}" был помечен как завершенный.\`
      });
      
      await sendSlackNotification({
        channel: '#project-updates',
        message: \`Проект "\${existingProject.name}" завершен!\`
      });
    }
    
    // Обновление кэша
    await cache.del(\`project:\${projectId}\`);
    
    return Response.json({
      success: true,
      data: {
        id: updatedProject.id,
        name: updatedProject.name,
        status: updatedProject.status,
        updatedAt: updatedProject.updatedAt
      },
      message: 'Статус проекта обновлен'
    });
    
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    return Response.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}`,
      description: 'Код API для обновления статуса проекта с уведомлениями и кэшированием'
    },

    performanceScore: {
      code: `// app/api/analytics/performance/route.ts - Расчет метрик производительности
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    // Определение периода для анализа
    let startDate: Date;
    switch (period) {
      case '24h':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Получение метрик из базы данных
    const metrics = await db.metric.findMany({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    
    // Расчет основных метрик
    const totalRequests = metrics.length;
    const successfulRequests = metrics.filter(m => m.statusCode < 400).length;
    const errorRate = totalRequests > 0 
      ? ((totalRequests - successfulRequests) / totalRequests * 100).toFixed(2)
      : 0;
    
    const responseTimes = metrics.map(m => m.responseTime);
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b) / responseTimes.length
      : 0;
    
    const p95ResponseTime = calculatePercentile(responseTimes, 95);
    const p99ResponseTime = calculatePercentile(responseTimes, 99);
    
    // Расчет общего скора производительности (0-100)
    const performanceScore = calculatePerformanceScore({
      errorRate: parseFloat(errorRate.toString()),
      avgResponseTime,
      p95ResponseTime,
      successfulRate: (successfulRequests / totalRequests) * 100
    });
    
    // Кэширование результата на 5 минут
    const cacheKey = \`performance:\${period}:\${startDate.toISOString()}\`;
    await cache.set(cacheKey, {
      score: performanceScore,
      metrics: {
        totalRequests,
        successfulRequests,
        errorRate,
        avgResponseTime,
        p95ResponseTime,
        p99ResponseTime
      }
    }, 300); // 5 минут
    
    return Response.json({
      success: true,
      data: {
        score: performanceScore,
        period,
        metrics: {
          totalRequests,
          successfulRequests,
          errorRate: parseFloat(errorRate.toString()),
          avgResponseTime: Math.round(avgResponseTime),
          p95ResponseTime: Math.round(p95ResponseTime),
          p99ResponseTime: Math.round(p99ResponseTime)
        },
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Ошибка расчета производительности:', error);
    return Response.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}`,
      description: 'Алгоритм расчета производительности с перцентилями и кэшированием'
    },

    analytics: {
      code: `// app/api/analytics/collector.ts - Middleware для сбора аналитики
import { NextRequest, NextResponse } from 'next/server';

// Интерфейс для метрик
interface AnalyticsData {
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Конфигурация аналитики
const ANALYTICS_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: 1.0, // 100% запросов
  excludedEndpoints: ['/_next', '/api/health', '/favicon.ico'],
  maxBatchSize: 100,
  flushInterval: 5000, // 5 секунд
};

// Глобальный буфер для батчинга
let analyticsBuffer: AnalyticsData[] = [];
let flushTimer: NodeJS.Timeout | null = null;

// Функция для проверки исключений
function shouldSkipAnalytics(endpoint: string): boolean {
  return ANALYTICS_CONFIG.excludedEndpoints.some(excluded => 
    endpoint.startsWith(excluded)
  );
}

// Функция для отправки батча в базу данных
async function flushAnalyticsBuffer() {
  if (analyticsBuffer.length === 0) return;
  
  const batch = [...analyticsBuffer];
  analyticsBuffer = [];
  
  try {
    // Используем bulk insert для эффективности
    await db.$transaction(async (tx) => {
      for (const data of batch) {
        await tx.analytics.create({
          data: {
            endpoint: data.endpoint,
            method: data.method,
            statusCode: data.statusCode,
            responseTime: data.responseTime,
            userAgent: data.userAgent?.substring(0, 500),
            ipAddress: data.ipAddress,
            timestamp: data.timestamp,
            metadata: data.metadata || {}
          }
        });
      }
    });
    
    console.log(\`Аналитика: отправлено \${batch.length} записей\`);
    
  } catch (error) {
    console.error('Ошибка сохранения аналитики:', error);
    // Возвращаем данные в буфер при ошибке
    analyticsBuffer = [...batch, ...analyticsBuffer];
  }
}

// Основная middleware функция
export async function analyticsCollector(
  request: NextRequest,
  response: NextResponse
) {
  // Пропускаем если аналитика отключена или случай не попадает в sample rate
  if (!ANALYTICS_CONFIG.enabled || Math.random() > ANALYTICS_CONFIG.sampleRate) {
    return;
  }
  
  const startTime = Date.now();
  const endpoint = request.nextUrl.pathname;
  
  // Пропускаем исключенные endpoint'ы
  if (shouldSkipAnalytics(endpoint)) {
    return;
  }
  
  // Перехватываем завершение запроса
  const originalResponse = response.clone();
  
  response.headers.set('X-Analytics-Enabled', 'true');
  
  // Обработка завершения запроса
  response.headers.set('X-Response-Time', \`\${Date.now() - startTime}ms\`);
  
  // Собираем данные
  const analyticsData: AnalyticsData = {
    endpoint,
    method: request.method,
    statusCode: response.status,
    responseTime: Date.now() - startTime,
    userAgent: request.headers.get('user-agent') || undefined,
    ipAddress: request.ip || request.headers.get('x-forwarded-for')?.split(',')[0],
    timestamp: new Date(),
    metadata: {
      referer: request.headers.get('referer'),
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    }
  };
  
  // Добавляем в буфер
  analyticsBuffer.push(analyticsData);
  
  // Проверяем размер буфера
  if (analyticsBuffer.length >= ANALYTICS_CONFIG.maxBatchSize) {
    await flushAnalyticsBuffer();
  }
  
  // Запускаем таймер для flush если он еще не запущен
  if (!flushTimer && ANALYTICS_CONFIG.flushInterval > 0) {
    flushTimer = setTimeout(async () => {
      await flushAnalyticsBuffer();
      flushTimer = null;
    }, ANALYTICS_CONFIG.flushInterval);
  }
}`,
      description: 'Система сбора аналитики с батчингом и middleware'
    }
  }

  const getButtonText = () => {
    if (loading) return '⏳ Отправляю запрос на сервер...'
    if (success) return `✅ Данные получены (${countdown}с)`
    return '🚀 Выполнить Full-Stack запрос'
  }

  const getButtonStyle = () => {
    if (loading) return 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
    if (success) return 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
    return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  }

  // Функция для отображения прогресс-бара
  const renderProgressBar = () => {
    const percentage = 100 - (countdown / 30 * 100)
    return (
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Время на изучение:</span>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">{countdown}</span>
            <span className="text-gray-500">секунд</span>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Начало</span>
          <span>{percentage.toFixed(0)}%</span>
          <span>Автосброс</span>
        </div>
      </div>
    )
  }

  // Рендер карточек данных
  const renderDataCards = () => {
    if (!success || !response) return null

    const cards = [
      {
        id: 'projectName',
        title: '📊 Проект',
        color: 'blue',
        data: {
          name: response.data?.projectInfo?.name || 'Демо Проект',
          stack: response.data?.projectInfo?.stack || ['React', 'Node.js'],
          mode: response.data?.demoMode ? 'Демо' : 'Продакшн'
        }
      },
      {
        id: 'status',
        title: '📈 Статус',
        color: 'green',
        data: {
          status: response.data?.projectInfo?.status || 'В разработке',
          progress: response.data?.projectInfo?.progress || 85
        }
      },
      {
        id: 'performanceScore',
        title: '⚡ Производительность',
        color: 'purple',
        data: {
          score: response.data?.analytics?.performanceScore || 95,
          responseTime: response.data?.analytics?.responseTime || '45ms'
        }
      },
      {
        id: 'analytics',
        title: '📊 Аналитика',
        color: 'orange',
        data: {
          requests: response.data?.analytics?.requests || 128,
          uptime: response.data?.analytics?.uptime || '99.8%'
        }
      }
    ]

    return (
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {cards.map(card => (
          <div
            key={card.id}
            ref={el => cardRefs.current[card.id] = el}
            className={`data-card p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
              isMobile 
                ? 'bg-white active:scale-95 active:shadow-inner' 
                : `bg-gradient-to-br from-white to-${card.color}-50 border-${card.color}-100 hover:border-${card.color}-300 hover:shadow-lg hover:scale-[1.02]`
            } ${hoveredCard === card.id ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
            {...(isMobile 
              ? {
                  onTouchStart: (e) => handleMobileInteraction(card.id, e),
                  onTouchEnd: (e) => handleMobileInteraction(card.id, e)
                }
              : {
                  onMouseEnter: (e) => handleDesktopInteraction(card.id, e),
                  onMouseLeave: (e) => handleDesktopInteraction(card.id, e),
                  onClick: (e) => handleDesktopInteraction(card.id, e)
                }
            )}
          >
            {/* Заголовок карточки */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-800">{card.title}</h3>
              {!isMobile && hoveredCard === card.id && (
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full animate-pulse">
                  <div className="flex items-center">
                    <span className="mr-1">⏱️</span>
                    <span>Время продлено!</span>
                  </div>
                </div>
              )}
              {isMobile && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  👆 Держите для продления
                </span>
              )}
            </div>

            {/* Содержимое карточки */}
            <div className="space-y-3">
              {card.id === 'projectName' && (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Название</div>
                    <div className="font-medium text-lg">{card.data.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Стек технологий</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {card.data.stack.map((tech: string, i: number) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {card.id === 'status' && (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Состояние</div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        card.data.status === 'active' ? 'bg-green-500 animate-pulse' : 
                        card.data.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <span className="font-medium">{card.data.status}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Прогресс</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600"
                          style={{ width: `${card.data.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{card.data.progress}%</span>
                    </div>
                  </div>
                </>
              )}

              {card.id === 'performanceScore' && (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Скор производительности</div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {card.data.score}
                      </div>
                      <div className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        +2.5%
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Среднее время ответа</div>
                    <div className="font-medium">{card.data.responseTime}</div>
                  </div>
                </>
              )}

              {card.id === 'analytics' && (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Всего запросов</div>
                    <div className="font-medium text-xl">{card.data.requests.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Аптайм системы</div>
                    <div className="font-medium">{card.data.uptime}</div>
                  </div>
                </>
              )}
            </div>

            {/* Подсказка для десктопа при наведении */}
            {!isMobile && hoveredCard === card.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600 animate-fade-in">
                  <span className="font-medium">💡 Подсказка:</span> Наведите на 2 секунды или кликните для продления времени изучения
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={mainContainerRef} className="p-4 md:p-8 max-w-7xl mx-auto relative">
      {/* Круглая кнопка возврата на главную страницу */}
      {showRoundHomeButton && !activeTooltip && (
        <button
          onClick={handleGoHome}
          className={`fixed z-30 p-3 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 ${
            isMobile 
              ? 'top-4 left-4 bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm'
              : 'top-6 left-6 bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Вернуться на главную"
          title="Вернуться на главную"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      )}

      {/* Фиксированная кнопка запроса для мобильных */}
      {isMobile && (
        <div className="fixed bottom-4 left-0 right-0 z-30 px-4">
          <button
            ref={requestButtonRef}
            onClick={handleApiCall}
            disabled={loading || success}
            className={`px-6 py-3 text-white rounded-lg transition-all duration-300 ${getButtonStyle()} disabled:opacity-80 w-full font-medium shadow-lg`}
            style={{
              opacity: scrollOpacity,
              transition: 'opacity 0.3s ease'
            }}
          >
            <span className="flex items-center justify-center space-x-2">
              {loading && <span className="animate-spin">⟳</span>}
              <span className="text-base">
                {success ? `✅ ${countdown}с` : loading ? '⏳ Запрос...' : '🚀 Запрос'}
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Единая фиксированная круглая кнопка возврата в начало */}
      {showScrollToTop && !activeTooltip && (
        <button
          onClick={scrollToTop}
          className={`fixed z-30 p-3 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 ${
            isMobile 
              ? 'bottom-20 right-4 bg-blue-600/80 hover:bg-blue-700/90 backdrop-blur-sm'
              : 'bottom-6 right-6 bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Вернуться в начало"
          title="Вернуться в начало"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Основной контент с отступом для фиксированной кнопки на мобильных */}
      <div className={isMobile ? "pb-20" : ""}>
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">🌐 Full-Stack демонстрация</h1>
          <p className="text-gray-600">
            {isMobile 
              ? 'Тапайте карточки для просмотра кода. Держите для продления времени.' 
              : 'Наводите на 2 секунды или кликайте по карточкам для продления времени и просмотра кода.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Левая колонка - управление запросом (скрыта на мобильных в фиксированной кнопке) */}
          {!isMobile && (
            <div className="space-y-6">
              <div className="p-4 md:p-6 border rounded-lg shadow-sm bg-white">
                <h2 className="text-lg md:text-xl font-semibold mb-4">🎮 Панель управления</h2>
                <p className="mb-6 text-gray-600">
                  Выполните запрос, чтобы получить данные с сервера. Изначально дается 30 секунд на изучение.
                  Время можно продлевать взаимодействуя с карточками.
                </p>
                
                <div className="space-y-6">
                  <button
                    onClick={handleApiCall}
                    disabled={loading || success}
                    className={`px-6 py-4 text-white rounded-lg transition-all duration-300 ${getButtonStyle()} disabled:opacity-80 w-full font-medium shadow-lg hover:shadow-xl active:scale-95`}
                  >
                    <span className="flex items-center justify-center space-x-3">
                      {loading && <span className="animate-spin">⟳</span>}
                      <span className="text-lg">{getButtonText()}</span>
                    </span>
                  </button>
                  
                  {success && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <span className="text-green-600 text-xl">✅</span>
                          </div>
                          <div>
                            <div className="font-bold text-green-800">Данные получены!</div>
                            <div className="text-sm text-green-600">
                              {timerPaused ? 'Таймер приостановлен' : 'Изучайте функционал'}
                            </div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-700 bg-green-100 px-4 py-2 rounded-full">
                          {countdown}с
                        </div>
                      </div>
                      
                      {renderProgressBar()}
                      
                      {/* Уведомление о продлении времени */}
                      {extendedTime > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
                          <div className="flex items-center justify-center">
                            <span className="text-blue-600 font-medium mr-2">⏱️</span>
                            <span className="text-blue-700">
                              Время продлено на {extendedTime} секунд!
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Кнопки управления таймером - ПРЯМОУГОЛЬНАЯ КНОПКА ВОЗВРАТА НА ГЛАВНУЮ УБРАНА */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {showHomeButton && (
                          <button
                            onClick={resetToInitialState}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-1 min-w-[150px]"
                          >
                            🏠 Вернуться сейчас
                          </button>
                        )}
                        
                        <button
                          onClick={() => extendTimer(15)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-1 min-w-[150px]"
                        >
                          ⏱️ Продлить на 15с
                        </button>
                        
                        <button
                          onClick={() => setTimerPaused(!timerPaused)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex-1 min-w-[150px]"
                        >
                          {timerPaused ? '▶️ Продолжить' : '⏸️ Приостановить'}
                        </button>
                      </div>
                    </div>
                  )}

                  {response && success && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 border rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <span className="mr-2">📦</span> Сырой JSON ответ:
                        </h3>
                        <div className="relative">
                          <div className="overflow-auto max-h-60 p-3 bg-white border rounded">
                            <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap">
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </div>
                          <div className="absolute top-2 right-2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-75">
                            Скролл для просмотра
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-3">📡 Трассировка запроса:</h4>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                              <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <div>
                              <div className="font-medium">Клиентский код (React)</div>
                              <div className="text-sm text-gray-600">Отправка POST запроса с данными</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                              <span className="text-green-600 font-bold">2</span>
                            </div>
                            <div>
                              <div className="font-medium">Серверный код (API Route)</div>
                              <div className="text-sm text-gray-600">Обработка, валидация, логика</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                              <span className="text-purple-600 font-bold">3</span>
                            </div>
                            <div>
                              <div className="font-medium">Формирование ответа</div>
                              <div className="text-sm text-gray-600">Структурирование JSON данных</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                              <span className="text-yellow-600 font-bold">4</span>
                            </div>
                            <div>
                              <div className="font-medium">Клиентский рендеринг</div>
                              <div className="text-sm text-gray-600">Отображение данных в интерфейсе</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Правая колонка - визуализация данных */}
          <div className="space-y-6">
            <div className="p-4 md:p-6 border rounded-lg shadow-sm bg-white">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                🎨 {isMobile ? 'Данные (тапайте для продления)' : 'Визуализация данных (наводите/кликайте)'}
              </h2>
              
              {success && response ? (
                <div className="space-y-6">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {isMobile 
                        ? '📱 Тапните карточку для просмотра кода. Держите дольше для продления времени.'
                        : '💻 Наведите на 2 секунды или кликните по карточке для продления времени и просмотра кода.'
                      }
                    </p>
                  </div>
                  
                  {renderDataCards()}

                  {/* Архитектура */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">🏗️ Архитектура проекта</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {response.architecture && Object.entries(response.architecture).map(([key, value]) => (
                        <div key={key} className="p-3 bg-white border rounded-lg hover:shadow-md transition-shadow">
                          <div className="text-xs text-gray-500 uppercase">{key}</div>
                          <div className="font-medium truncate">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ПРЯМОУГОЛЬНАЯ КНОПКА ВОЗВРАТА НА ГЛАВНУЮ В МОБИЛЬНОЙ ВЕРСИИ УБРАНА */}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
                    <div className="text-4xl text-gray-300 mb-3">📊</div>
                    <p className="text-gray-500 font-medium">Данные появятся здесь</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Нажмите кнопку "Выполнить Full-Stack запрос" {isMobile ? 'внизу экрана' : 'в левой панели'}
                    </p>
                    
                    {/* ПРЯМОУГОЛЬНАЯ КНОПКА ВОЗВРАТА НА ГЛАВНУЮ В СОСТОЯНИИ ОЖИДАНИЯ УБРАНА */}
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">🎯 Что будет показано:</h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• Реальные данные с сервера в интерактивных карточках</li>
                      <li>• Код бэкенда для каждой операции</li>
                      <li>• {isMobile ? 'Тап и удержание для продления времени' : 'Наведение и клик для продления времени'}</li>
                      <li>• Автоматический сброс через 30 секунд (можно продлить)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Модальное окно с кодом бэкенда */}
            {activeTooltip && activeBackendCode && backendCodeSnippets[activeBackendCode] && (
              <div className="fixed inset-0 z-50 backend-tooltip">
                <div className="fixed inset-0 bg-black bg-opacity-60 z-40" />
                
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                  <div 
                    ref={codeModalRef}
                    tabIndex={-1}
                    className="bg-gray-900 text-gray-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Заголовок модального окна */}
                    <div className="p-4 md:p-6 border-b border-gray-700 flex-shrink-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl text-white mb-1">👨‍💻 Код бэкенда</h3>
                          <p className="text-gray-400 text-sm">
                            {backendCodeSnippets[activeBackendCode].description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => extendTimer(20)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            ⏱️ +20 сек
                          </button>
                          <button 
                            onClick={() => {
                              setActiveTooltip(null)
                              setActiveBackendCode(null)
                            }}
                            className="text-gray-400 hover:text-white text-2xl p-2 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400 mt-3 flex justify-between">
                        <span>
                          Технология: <span className="text-yellow-300">Node.js + Next.js API + TypeScript</span>
                        </span>
                        <span className="text-blue-300">
                          Время изучения: {countdown} сек
                        </span>
                      </div>
                    </div>
                    
                    {/* Контейнер для кода с прокруткой */}
                    <div className="flex-grow overflow-auto">
                      <div className="p-4 md:p-6">
                        <div className="relative">
                          <pre className="text-xs md:text-sm font-mono bg-gray-800 p-4 rounded-lg border border-gray-700 whitespace-pre-wrap leading-relaxed overflow-auto max-h-[50vh]">
                            {backendCodeSnippets[activeBackendCode].code}
                          </pre>
                          <div className="absolute bottom-2 right-2 text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded opacity-75">
                            {isMobile ? 'Скролл пальцем 👆👇' : 'Используйте колесо мыши для прокрутки'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Нижняя часть модального окна */}
                    <div className="p-4 md:p-6 border-t border-gray-700 flex-shrink-0">
                      <div className="text-sm text-gray-400">
                        <div className="font-medium mb-2">📝 Как это работает:</div>
                        <ul className="space-y-1">
                          <li>• Код с обработкой ошибок и валидацией</li>
                          <li>• Взаимодействие с базой данных и внешними сервисами</li>
                          <li>• Кэширование для производительности</li>
                          <li>• Логирование и мониторинг</li>
                          <li>• Обработка и санитизация данных</li>
                        </ul>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setActiveTooltip(null)
                            setActiveBackendCode(null)
                          }}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex-1 min-w-[120px]"
                        >
                          Закрыть
                        </button>
                        <button
                          onClick={() => extendTimer(15)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 min-w-[120px]"
                        >
                          Продлить ещё
                        </button>
                        {/* ПРЯМОУГОЛЬНАЯ КНОПКА ВОЗВРАТА В МОДАЛЬНОМ ОКНЕ ОСТАВЛЕНА, ТАК КАК КРУГЛАЯ КНОПКА НЕ ВИДНА */}
                        <button
                          onClick={handleGoHome}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-1 min-w-[120px]"
                        >
                          🏠 На главную
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Футер с информацией - ПРЯМОУГОЛЬНАЯ КНОПКА ВОЗВРАТА В ФУТЕРЕ УБРАНА */}
      <div 
        ref={footerRef} 
        className="mt-8 p-4 md:p-6 border border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg shadow-sm"
      >
        <h3 className="text-lg md:text-xl font-semibold text-yellow-800 mb-4">📋 Основные возможности:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white bg-opacity-50 rounded-lg">
            <h4 className="font-medium text-yellow-700 mb-2">🕒 Управление временем</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Изначально 30 секунд на изучение</li>
              <li>• Наведение/клик продлевает время</li>
              <li>• Долгое удержание = больше времени</li>
              <li>• Кнопки для ручного управления</li>
            </ul>
          </div>
          
          <div className="p-3 bg-white bg-opacity-50 rounded-lg">
            <h4 className="font-medium text-yellow-700 mb-2">📱 Поддержка платформ</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Разная логика для мобильных и ПК</li>
              <li>• Тап vs наведение + клик</li>
              <li>• Автоопределение устройства</li>
              <li>• Адаптивные интерфейсы</li>
            </ul>
          </div>
          
          <div className="p-3 bg-white bg-opacity-50 rounded-lg">
            <h4 className="font-medium text-yellow-700 mb-2">💻 Код и архитектура</h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• Примеры бэкенд кода</li>
              <li>• Обработка ошибок и валидация</li>
              <li>• Базы данных и кэширование</li>
              <li>• Полный цикл разработки</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white bg-opacity-70 rounded border border-yellow-300">
          <div className="text-sm text-yellow-800">
            <div className="font-bold mb-2">🔄 Механики продления времени:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">💻 На десктопе:</span>
                <ul className="text-xs mt-1">
                  <li>• Наведите на 2 секунды = +10 секунд</li>
                  <li>• Кликните по карточке = +15 секунд</li>
                  <li>• Кнопка продления = +15 секунд</li>
                </ul>
              </div>
              <div>
                <span className="font-medium">📱 На мобильном:</span>
                <ul className="text-xs mt-1">
                  <li>• Тап по карточке = +15 секунд</li>
                  <li>• Держите тап = +20 секунд</li>
                  <li>• Кнопка продления = +15 секунд</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Блок с информацией о портфолио - БЕЗ КНОПКИ */}
        <div className="mt-6 pt-4 border-t border-yellow-300">
          <div className="text-center">
            <div className="text-sm text-yellow-700">
              <span className="font-medium">📍 Эта демонстрация - часть портфолио для Kwork</span>
              <p className="text-xs mt-1">Используйте круглую кнопку в верхнем левом углу для возврата на главную страницу</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
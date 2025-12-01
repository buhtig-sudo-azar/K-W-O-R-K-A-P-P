import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId, mode = 'creative' } = body

    // Имитация обработки AI
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Моковые ответы
    const responses = {
      creative: [
        "🎨 Креативный подход требует смелости! ",
        "✨ Вдохновение пришло! ",
        "🌟 Давайте создадим что-то уникальное! "
      ],
      business: [
        "📊 С точки зрения бизнеса: ",
        "💼 Оптимальное решение для роста: ",
        "📈 Стратегический подход предполагает: "
      ],
      technical: [
        "🔧 Техническая реализация: ",
        "⚙️ С архитектурной точки зрения: "
      ]
    }

    const prefixes = responses[mode as keyof typeof responses] || responses.creative
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    
    const creativeWords = [
      "инновационный", "эффективный", "масштабируемый", "интуитивный", 
      "современный", "оптимизированный", "адаптивный", "уникальный"
    ]
    const randomWord = creativeWords[Math.floor(Math.random() * creativeWords.length)]
    
    const aiResponse = `${randomPrefix}${message.toLowerCase().includes('привет') ? ' Рад вас видеть! ' : ''}Это будет ${randomWord} проект, который привлечет внимание вашей аудитории и обеспечит устойчивый рост.`

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        model: mode === 'creative' ? 'gpt-4' : 'gpt-3.5-turbo'
      }
    })

  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
// app/api/demo/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Простая логика для демо
    const processedData = {
      ...body,
      serverProcessed: true,
      processingTime: `${Math.random() * 100}ms`,
      additionalInfo: 'Данные успешно обработаны на сервере'
    };
    
    // Небольшая задержка для реалистичности
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return Response.json({
      success: true,
      message: 'Данные успешно получены и обработаны',
      data: processedData,
      server: 'Vercel Serverless Function',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Ошибка обработки запроса' },
      { status: 500 }
    );
  }
}

// Дополнительно можно добавить GET для тестирования
export async function GET() {
  return Response.json({
    message: 'API работает! Используйте POST метод для отправки данных',
    timestamp: new Date().toISOString()
  });
}
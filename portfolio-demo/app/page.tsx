export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">🚀 Демо-портфолио Full-Stack разработчика</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Карточка Full-Stack */}
        <a href="/demo/fullstack" className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-4">🌐 Full-Stack демо</h2>
          {/* ... остальной код без изменений */}
        </a>

        {/* Карточка Telegram бота */}
        <a href="/demo/telegram-bot" className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-4">🤖 Telegram Bot демо</h2>
          {/* ... */}
        </a>

        {/* Карточка OSINT */}
        <a href="/demo/osint-parser" className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-bold mb-4">🔍 OSINT & Парсинг</h2>
          {/* ... */}
        </a>
      </div>
    </div>
  )
}
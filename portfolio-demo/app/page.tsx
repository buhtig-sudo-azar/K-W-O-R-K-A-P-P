export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Tailwind работает!
      </h1>
      <p className="text-gray-700">
        Next.js успешно запущен с поддержкой Tailwind CSS
      </p>
      <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Тестовая кнопка
      </button>
    </div>
  );
}
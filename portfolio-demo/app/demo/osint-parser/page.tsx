'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface GeoData {
  lat: number
  lng: number
  city: string
  country: string
  isp: string
  organization: string
}

interface Device {
  id: number
  type: 'router' | 'server' | 'camera' | 'phone' | 'laptop'
  ip: string
  mac: string
  vendor: string
  os: string
  signal: number
}

interface NetworkNode {
  id: number
  name: string
  type: 'target' | 'router' | 'server' | 'device'
  connections: number[]
  status: 'active' | 'inactive' | 'compromised'
}

export default function OsintParserDemo() {
  const [input, setInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [networkMap, setNetworkMap] = useState<NetworkNode[]>([
    { id: 1, name: 'ЦЕЛЬ', type: 'target', connections: [2, 3, 4], status: 'active' },
    { id: 2, name: 'ROUTER-01', type: 'router', connections: [1, 5, 6], status: 'active' },
    { id: 3, name: 'SERVER-01', type: 'server', connections: [1, 7], status: 'active' },
    { id: 4, name: 'NAS-01', type: 'server', connections: [1, 8], status: 'compromised' },
    { id: 5, name: 'DEVICE-01', type: 'device', connections: [2], status: 'active' },
    { id: 6, name: 'DEVICE-02', type: 'device', connections: [2], status: 'inactive' },
    { id: 7, name: 'CAM-01', type: 'device', connections: [3], status: 'active' },
    { id: 8, name: 'PHONE-01', type: 'device', connections: [4], status: 'active' },
  ])
  const [activeTab, setActiveTab] = useState<'geo' | 'devices' | 'network' | 'social'>('geo')
  const [satelliteView, setSatelliteView] = useState(true)
  const [isTracking, setIsTracking] = useState(false)
  const [logs, setLogs] = useState<string[]>([
    '[12:34:56] Система инициализирована',
    '[12:35:01] GPS: Сигнал получен (5 спутников)',
    '[12:35:02] Сканер портов: Готов',
    '[12:35:03] Анализатор трафика: Активирован',
  ])
  
  const mapRef = useRef<HTMLDivElement>(null)
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Функция для добавления логов
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ru-RU', { hour12: false })
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)])
  }

  // Автопрокрутка логов
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0
    }
  }, [logs])

  // Имитация GPS-трекинга
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      if (geoData) {
        // Случайное изменение координат для имитации движения
        setGeoData(prev => prev ? {
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        } : null)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isTracking, geoData])

  const startScan = () => {
    if (!input.trim()) return
    
    setIsScanning(true)
    setScanProgress(0)
    setDevices([])
    setGeoData(null)
    addLog(`Начинаем сканирование цели: ${input}`)
    
    // Имитация прогресса сканирования
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          
          // Генерация моковых данных после завершения сканирования
          setTimeout(() => {
            generateMockData()
            addLog('Сканирование завершено. Цель идентифицирована.')
            addLog('Координаты установлены. Сеть проанализирована.')
          }, 500)
          
          return 100
        }
        return prev + 1
      })
    }, 30)
  }

  const generateMockData = () => {
    // Моковые геоданные
    const mockGeoData: GeoData = {
      lat: 55.7558 + (Math.random() - 0.5) * 0.1,
      lng: 37.6173 + (Math.random() - 0.5) * 0.1,
      city: 'Москва',
      country: 'Россия',
      isp: 'Ростелеком',
      organization: 'Целевая организация'
    }
    setGeoData(mockGeoData)

    // Моковые устройства
    const deviceTypes: Device['type'][] = ['router', 'server', 'camera', 'phone', 'laptop']
    const vendors = ['Cisco', 'Huawei', 'D-Link', 'TP-Link', 'Apple', 'Samsung']
    const osList = ['iOS 16', 'Android 14', 'Windows 11', 'Ubuntu 22.04', 'RouterOS']
    
    const mockDevices: Device[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
      ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
      mac: `00:${Array.from({ length: 5 }, () => 
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
      ).join(':')}`,
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      os: osList[Math.floor(Math.random() * osList.length)],
      signal: Math.floor(Math.random() * 100)
    }))
    
    setDevices(mockDevices)
  }

  const getStatusColor = (status: NetworkNode['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'inactive': return 'bg-gray-500/20 text-gray-400'
      case 'compromised': return 'bg-red-500/20 text-red-400'
    }
  }

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'router': return '🛰️'
      case 'server': return '💾'
      case 'camera': return '📹'
      case 'phone': return '📱'
      case 'laptop': return '💻'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-green-400 font-mono">
      {/* Топ-бар с системной информацией */}
      <div className="border-b border-green-900/50 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 px-3 py-1.5 bg-green-900/20 hover:bg-green-800/30 rounded border border-green-800/50 transition-colors"
            >
              <span className="text-green-400">←</span>
              <span className="hidden sm:inline">EXIT</span>
            </Link>
            <div className="text-xs text-green-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>SYSTEM: ACTIVE</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-green-300">
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span className="text-green-500">●</span> GPS: {geoData ? 'LOCKED' : 'SEARCHING'}
              </div>
              <div>
                <span className="text-green-500">●</span> ENCRYPTION: AES-256
              </div>
              <div>
                <span className="text-green-500">●</span> MODE: {isTracking ? 'TRACKING' : 'SCAN'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Панель управления */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Карта/радар */}
            <div className="bg-black/50 border border-green-900/50 rounded-xl overflow-hidden">
              <div className="border-b border-green-900/50 p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h2 className="text-lg font-bold">SATELLITE OVERLAY</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setSatelliteView(!satelliteView)}
                    className="px-3 py-1 bg-green-900/20 hover:bg-green-800/30 rounded text-sm border border-green-800/50 transition-colors"
                  >
                    {satelliteView ? '📡 RADAR' : '🛰️ SAT'}
                  </button>
                  <button 
                    onClick={() => setIsTracking(!isTracking)}
                    className={`px-3 py-1 rounded text-sm border transition-colors ${
                      isTracking 
                        ? 'bg-red-900/20 hover:bg-red-800/30 border-red-800/50 text-red-400'
                        : 'bg-green-900/20 hover:bg-green-800/30 border-green-800/50'
                    }`}
                  >
                    {isTracking ? 'STOP TRACK' : 'START TRACK'}
                  </button>
                </div>
              </div>
              
              <div 
                ref={mapRef}
                className="h-96 relative bg-gradient-to-br from-gray-900 to-black overflow-hidden"
              >
                {/* Сетка радара */}
                {!satelliteView && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-green-500/30 rounded-full"></div>
                      <div className="w-40 h-40 border-2 border-green-500/20 rounded-full absolute"></div>
                      <div className="w-20 h-20 border-2 border-green-500/10 rounded-full absolute"></div>
                    </div>
                    
                    {/* Линия сканирования */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"
                      style={{
                        transform: `rotate(${scanProgress * 3.6}deg)`,
                        transformOrigin: 'left center'
                      }}
                    ></div>
                  </>
                )}
                
                {/* Точки на карте */}
                {geoData && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Целевая точка */}
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white animate-pulse">
                        <div className="w-full h-full rounded-full bg-red-600 animate-ping opacity-75"></div>
                      </div>
                      
                      {/* Окружение */}
                      {devices.slice(0, 5).map((device, i) => {
                        const angle = (i / 5) * 2 * Math.PI
                        const distance = 80 + Math.random() * 40
                        return (
                          <div
                            key={device.id}
                            className="absolute w-4 h-4 bg-blue-500 rounded-full border border-white"
                            style={{
                              left: Math.cos(angle) * distance + 'px',
                              top: Math.sin(angle) * distance + 'px',
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div className="text-xs absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                              {device.ip}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* Координаты */}
                {geoData && (
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm p-3 rounded border border-green-800/50">
                    <div className="text-xs text-green-300">
                      <div>COORD: {geoData.lat.toFixed(6)}, {geoData.lng.toFixed(6)}</div>
                      <div>CITY: {geoData.city}</div>
                      <div>ISP: {geoData.isp}</div>
                      <div>ORG: {geoData.organization}</div>
                    </div>
                  </div>
                )}
                
                {/* Прогресс сканирования */}
                {isScanning && (
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm p-3 rounded border border-green-800/50">
                    <div className="text-xs text-green-300 mb-1">SCANNING... {scanProgress}%</div>
                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Сетевые узлы */}
            <div className="bg-black/50 border border-green-900/50 rounded-xl p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <span className="text-green-500">🔗</span>
                <span>NETWORK TOPOLOGY</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {networkMap.map(node => (
                  <div
                    key={node.id}
                    className={`p-3 rounded border ${getStatusColor(node.status)} border-current`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium truncate">{node.name}</div>
                      <div className={`w-2 h-2 rounded-full ${
                        node.status === 'active' ? 'bg-green-500' :
                        node.status === 'inactive' ? 'bg-gray-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="text-xs text-gray-400">ID: {node.type.toUpperCase()}-{node.id}</div>
                    <div className="text-xs text-gray-500 mt-1">Connections: {node.connections.length}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Панель ввода */}
            <div className="bg-black/50 border border-green-900/50 rounded-xl p-4">
              <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
                <span className="text-green-500">🎯</span>
                <span>TARGET ACQUISITION</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-green-300 mb-2">
                    Введите IP/домен/координаты:
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="192.168.1.1 или example.com"
                    className="w-full bg-gray-900/50 border border-green-800/50 rounded-lg p-3 text-green-300 focus:outline-none focus:border-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={startScan}
                    disabled={isScanning || !input.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 disabled:opacity-50 rounded border border-green-800 transition-all"
                  >
                    {isScanning ? 'SCANNING...' : '🚀 START SCAN'}
                  </button>
                  <button
                    onClick={() => {
                      setInput('')
                      setGeoData(null)
                      setDevices([])
                      setScanProgress(0)
                      addLog('Система сброшена. Готов к новой цели.')
                    }}
                    className="px-4 py-3 bg-gray-900 hover:bg-gray-800 rounded border border-gray-700 transition-colors"
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>

            {/* Табы информации */}
            <div className="bg-black/50 border border-green-900/50 rounded-xl overflow-hidden">
              <div className="border-b border-green-900/50">
                <div className="flex">
                  {(['geo', 'devices', 'network', 'social'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-2 text-sm border-r border-green-900/50 last:border-r-0 transition-colors ${
                        activeTab === tab 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'hover:bg-green-900/10'
                      }`}
                    >
                      {tab === 'geo' && '🌍 GEO'}
                      {tab === 'devices' && '📱 DEVICES'}
                      {tab === 'network' && '🔗 NET'}
                      {tab === 'social' && '👥 SOC'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 max-h-80 overflow-y-auto">
                {activeTab === 'geo' && geoData && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Location</span>
                      <span className="text-green-300">{geoData.city}, {geoData.country}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Coordinates</span>
                      <span className="text-green-300">{geoData.lat.toFixed(4)}, {geoData.lng.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">ISP</span>
                      <span className="text-green-300">{geoData.isp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Organization</span>
                      <span className="text-green-300">{geoData.organization}</span>
                    </div>
                  </div>
                )}
                
                {activeTab === 'devices' && (
                  <div className="space-y-2">
                    {devices.map(device => (
                      <div key={device.id} className="p-2 bg-gray-900/30 rounded border border-gray-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{getDeviceIcon(device.type)}</span>
                            <div>
                              <div className="text-sm font-medium">{device.ip}</div>
                              <div className="text-xs text-gray-400">{device.vendor} • {device.os}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs">{device.mac}</div>
                            <div className="text-xs text-gray-400">Signal: {device.signal}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'social' && (
                  <div className="space-y-3">
                    <div className="p-2 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex items-center space-x-2">
                        <span>👤</span>
                        <div>
                          <div className="text-sm font-medium">John Doe</div>
                          <div className="text-xs text-gray-400">LinkedIn • Twitter • GitHub</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex items-center space-x-2">
                        <span>🏢</span>
                        <div>
                          <div className="text-sm font-medium">Target Corp</div>
                          <div className="text-xs text-gray-400">Employees: 245 • Founded: 2015</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Логи системы */}
            <div className="bg-black/50 border border-green-900/50 rounded-xl overflow-hidden">
              <div className="border-b border-green-900/50 p-3">
                <h2 className="text-lg font-bold flex items-center space-x-2">
                  <span className="text-green-500">📝</span>
                  <span>SYSTEM LOGS</span>
                </h2>
              </div>
              
              <div 
                ref={logContainerRef}
                className="h-48 overflow-y-auto p-3 space-y-1 font-mono text-xs"
              >
                {logs.map((log, index) => (
                  <div 
                    key={index}
                    className="text-green-400/80 hover:text-green-300 transition-colors cursor-pointer"
                  >
                    &gt; {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Системная информация */}
        <div className="bg-black/50 border border-green-900/50 rounded-xl p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-900/30 rounded border border-gray-800">
              <div className="text-2xl font-bold text-green-400">5</div>
              <div className="text-xs text-gray-400">СПУТНИКОВ GPS</div>
            </div>
            <div className="text-center p-3 bg-gray-900/30 rounded border border-gray-800">
              <div className="text-2xl font-bold text-blue-400">{devices.length}</div>
              <div className="text-xs text-gray-400">УСТРОЙСТВ В СЕТИ</div>
            </div>
            <div className="text-center p-3 bg-gray-900/30 rounded border border-gray-800">
              <div className="text-2xl font-bold text-cyan-400">93%</div>
              <div className="text-xs text-gray-400">СКОРОСТЬ СКАНИРОВАНИЯ</div>
            </div>
            <div className="text-center p-3 bg-gray-900/30 rounded border border-gray-800">
              <div className="text-2xl font-bold text-purple-400">AES-256</div>
              <div className="text-xs text-gray-400">ШИФРОВАНИЕ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Футер с предупреждением */}
      <div className="border-t border-green-900/50 mt-6 p-4 text-center text-xs text-green-500/50">
        <div className="max-w-7xl mx-auto">
          ⚠️ ЭТО ДЕМОНСТРАЦИОННЫЙ ИНСТРУМЕНТ. НЕ ДОЛБИТЕ ПО КНОПКАМ. ВСЕРАВНО НЕ ЗАРАБОТАЕТ)) .
        </div>
      </div>
    </div>
  )
}
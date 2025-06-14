'use client'

import { useRef, useState, useEffect } from 'react'

/**
 * UseRefExample - Component demo useRef hook
 * 
 * useRef trả về một mutable ref object có .current property.
 * Ref không trigger re-render khi value thay đổi.
 * 
 * Use cases:
 * 1. Truy cập DOM elements
 * 2. Lưu trữ mutable values
 * 3. Lưu trữ previous values
 * 4. Timers và intervals
 */

const UseRefExample = () => {
  // 1. DOM Refs - Truy cập DOM elements
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // 2. Mutable Values - Không trigger re-render
  const renderCount = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const previousValueRef = useRef<string>('')
  
  // 3. State để test re-render
  const [inputValue, setInputValue] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  
  // Tăng render count mỗi khi component render
  renderCount.current += 1
  
  // Lưu previous value
  useEffect(() => {
    previousValueRef.current = inputValue
  })
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    
    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning])
  
  // DOM manipulation handlers
  const handleFocusInput = () => {
    // Truy cập DOM element qua ref
    inputRef.current?.focus()
  }
  
  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
      setInputValue('')
    }
  }
  
  const handlePlayVideo = () => {
    videoRef.current?.play()
  }
  
  const handlePauseVideo = () => {
    videoRef.current?.pause()
  }
  
  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleScrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ 
        top: scrollRef.current.scrollHeight, 
        behavior: 'smooth' 
      })
    }
  }
  
  // Timer handlers
  const handleStartTimer = () => {
    setIsRunning(true)
  }
  
  const handleStopTimer = () => {
    setIsRunning(false)
  }
  
  const handleResetTimer = () => {
    setSeconds(0)
    setIsRunning(false)
  }
  
  // Scroll event handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop)
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🎯 useRef Hook Examples
      </h2>
      
      {/* Render Count Display */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
        <p className="text-purple-800">
          <strong>Render Count:</strong> {renderCount.current}
          <span className="text-sm text-purple-600 ml-2">
            (Ref không trigger re-render)
          </span>
        </p>
      </div>
      
      {/* 1. DOM Refs Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">
          1. DOM Element Access
        </h3>
        
        <div className="space-y-4">
          {/* Input manipulation */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Input Control:</h4>
            <div className="flex space-x-2 mb-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Click buttons to control this input..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleFocusInput}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Focus Input
              </button>
              <button
                onClick={handleClearInput}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Clear & Focus
              </button>
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Current Value:</strong> {inputValue || '(empty)'}</p>
              <p><strong>Previous Value:</strong> {previousValueRef.current || '(none)'}</p>
            </div>
          </div>
          
          {/* Video control */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Video Control:</h4>
            <video
              ref={videoRef}
              width="300"
              height="200"
              controls
              className="rounded-lg mb-3"
              poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TYW1wbGUgVmlkZW88L3RleHQ+PC9zdmc+"
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePlayVideo}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                ▶️ Play
              </button>
              <button
                onClick={handlePauseVideo}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
              >
                ⏸️ Pause
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. Mutable Values Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-green-600">
          2. Timer với Mutable Ref
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}
          </div>
          <p className="text-gray-600">
            Status: {isRunning ? 'Running' : 'Stopped'}
          </p>
        </div>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleStartTimer}
            disabled={isRunning}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded transition-colors"
          >
            Start
          </button>
          <button
            onClick={handleStopTimer}
            disabled={!isRunning}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded transition-colors"
          >
            Stop
          </button>
          <button
            onClick={handleResetTimer}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
          >
            Reset
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-600 text-center">
          Timer ref được lưu trữ để có thể clear interval khi cần
        </div>
      </div>
      
      {/* 3. Scroll Control Example */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-purple-600">
          3. Scroll Control
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Scroll Y: {scrollY}px
          </p>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleScrollToTop}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Scroll to Top
            </button>
            <button
              onClick={handleScrollToBottom}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Scroll to Bottom
            </button>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50"
        >
          <div className="space-y-4">
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i} className="bg-white p-3 rounded shadow-sm">
                <h4 className="font-medium text-gray-800">Item {i + 1}</h4>
                <p className="text-gray-600 text-sm">
                  Đây là content item số {i + 1}. Scroll để test ref functionality.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notes */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <h4 className="font-semibold text-yellow-800 mb-3">📝 useRef Key Points:</h4>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-yellow-700 mb-2">✅ Khi nào dùng useRef:</h5>
            <ul className="text-yellow-600 space-y-1">
              <li>• Truy cập DOM elements (focus, scroll, etc.)</li>
              <li>• Lưu trữ mutable values không trigger re-render</li>
              <li>• Lưu trữ previous values</li>
              <li>• Store timers, intervals, subscriptions</li>
              <li>• Imperative animations</li>
              <li>• Integration với third-party libraries</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-yellow-700 mb-2">⚠️ Lưu ý quan trọng:</h5>
            <ul className="text-yellow-600 space-y-1">
              <li>• Ref.current thay đổi KHÔNG trigger re-render</li>
              <li>• Không read/write ref.current trong render</li>
              <li>• Ref là escape hatch - dùng khi cần thiết</li>
              <li>• Prefer declarative code over imperative</li>
              <li>• Cleanup timers/subscriptions trong useEffect</li>
              <li>• Ref initial value chỉ set lần đầu</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <h5 className="font-medium text-yellow-700 mb-2">🔧 Common Patterns:</h5>
          <div className="grid md:grid-cols-2 gap-4 text-yellow-600 text-sm">
            <div>
              <strong>DOM Manipulation:</strong>
              <code className="block bg-yellow-100 p-2 rounded mt-1">
                const inputRef = useRef(null)<br/>
                inputRef.current?.focus()
              </code>
            </div>
            <div>
              <strong>Mutable Values:</strong>
              <code className="block bg-yellow-100 p-2 rounded mt-1">
                const countRef = useRef(0)<br/>
                countRef.current += 1
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseRefExample 
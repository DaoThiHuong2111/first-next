'use client'

import { useLayoutEffect, useEffect, useState, useRef } from 'react'

/**
 * UseLayoutEffectExample - Component demo useLayoutEffect hook
 * 
 * useLayoutEffect chạy synchronously sau tất cả DOM mutations.
 * Khác với useEffect chạy asynchronously sau khi browser paint.
 * 
 * Use cases:
 * 1. Đo DOM elements
 * 2. Synchronous DOM updates
 * 3. Layout calculations
 * 4. Prevent visual flickering
 */

const UseLayoutEffectExample = () => {
  // States cho examples
  const [showBox, setShowBox] = useState(true)
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' })
  const [logs, setLogs] = useState<string[]>([])
  
  // Refs
  const boxRef = useRef<HTMLDivElement>(null)
  const animatedBoxRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  
  // Helper để add logs
  const addLog = (message: string, type: 'useEffect' | 'useLayoutEffect') => {
    const timestamp = new Date().toLocaleTimeString()
    const color = type === 'useLayoutEffect' ? '🟦' : '🟩'
    setLogs(prev => [...prev.slice(-9), `${color} [${timestamp}] ${type}: ${message}`])
  }
  
  // 1. So sánh useEffect vs useLayoutEffect timing
  useEffect(() => {
    addLog('useEffect chạy (async)', 'useEffect')
  }, [showBox])
  
  useLayoutEffect(() => {
    addLog('useLayoutEffect chạy (sync)', 'useLayoutEffect')
  }, [showBox])
  
  // 2. Đo kích thước DOM element với useLayoutEffect
  useLayoutEffect(() => {
    if (boxRef.current) {
      const { width, height } = boxRef.current.getBoundingClientRect()
      setBoxSize({ width, height })
      addLog(`Measured box: ${Math.round(width)}x${Math.round(height)}`, 'useLayoutEffect')
    }
  }, [showBox])
  
  // 3. Tooltip positioning với useLayoutEffect
  useLayoutEffect(() => {
    if (tooltip.show && tooltipRef.current) {
      const tooltipEl = tooltipRef.current
      const rect = tooltipEl.getBoundingClientRect()
      
      // Adjust position nếu tooltip bị cắt khỏi viewport
      let adjustedX = tooltip.x
      let adjustedY = tooltip.y
      
      if (adjustedX + rect.width > window.innerWidth) {
        adjustedX = window.innerWidth - rect.width - 10
      }
      
      if (adjustedY + rect.height > window.innerHeight) {
        adjustedY = adjustedY - rect.height - 20
      }
      
      tooltipEl.style.left = `${adjustedX}px`
      tooltipEl.style.top = `${adjustedY}px`
      
      addLog(`Tooltip positioned at ${adjustedX}, ${adjustedY}`, 'useLayoutEffect')
    }
  }, [tooltip])
  
  // 4. Animation với layout calculations
  useLayoutEffect(() => {
    if (animatedBoxRef.current) {
      const element = animatedBoxRef.current
      const rect = element.getBoundingClientRect()
      
      // Store initial position for animation
      element.style.transform = `translateX(${position.x}px) translateY(${position.y}px)`
      
      addLog(`Animation box positioned at ${position.x}, ${position.y}`, 'useLayoutEffect')
    }
  }, [position])
  
  // Event handlers
  const handleToggleBox = () => {
    setShowBox(prev => !prev)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setTooltip({
      show: true,
      x: e.clientX + 10,
      y: e.clientY - 30,
      text: `Mouse: (${Math.round(x)}, ${Math.round(y)})`
    })
  }
  
  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }))
  }
  
  const handleMoveBox = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 20
    setPosition(prev => {
      switch (direction) {
        case 'up': return { ...prev, y: prev.y - step }
        case 'down': return { ...prev, y: prev.y + step }
        case 'left': return { ...prev, x: prev.x - step }
        case 'right': return { ...prev, x: prev.x + step }
        default: return prev
      }
    })
  }
  
  const handleResetPosition = () => {
    setPosition({ x: 0, y: 0 })
  }
  
  const handleClearLogs = () => {
    setLogs([])
  }
  
  // Measure component
  const MeasureComponent = () => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
    const [content, setContent] = useState('Short text')
    
    // BAD: Dùng useEffect - có thể gây flickering
    useEffect(() => {
      if (measureRef.current) {
        const { width, height } = measureRef.current.getBoundingClientRect()
        // Simulated flickering với timeout
        setTimeout(() => {
          setDimensions({ width, height })
        }, 1)
      }
    }, [content])
    
    // GOOD: Dùng useLayoutEffect - no flickering
    // useLayoutEffect(() => {
    //   if (measureRef.current) {
    //     const { width, height } = measureRef.current.getBoundingClientRect()
    //     setDimensions({ width, height })
    //   }
    // }, [content])
    
    return (
      <div className="space-y-4">
        <div
          ref={measureRef}
          className="bg-purple-100 border-2 border-purple-300 p-4 rounded-lg transition-all duration-300"
          style={{ fontSize: content.length > 20 ? '14px' : '16px' }}
        >
          {content}
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Dimensions:</strong> {Math.round(dimensions.width)} x {Math.round(dimensions.height)}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setContent('Short text')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Short Text
          </button>
          <button
            onClick={() => setContent('This is a much longer text that will change the dimensions of the container element and demonstrate the measurement behavior.')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Long Text
          </button>
        </div>
        
        <p className="text-xs text-orange-600">
          ⚠️ Currently using useEffect - watch for flickering. 
          Switch to useLayoutEffect in code for smooth experience.
        </p>
      </div>
    )
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📐 useLayoutEffect Hook Examples
      </h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Examples */}
        <div className="space-y-6">
          {/* 1. DOM Measurement Example */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              1. DOM Element Measurement
            </h3>
            
            <button
              onClick={handleToggleBox}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors mb-4"
            >
              {showBox ? 'Hide' : 'Show'} Box
            </button>
            
            {showBox && (
              <div
                ref={boxRef}
                className="bg-blue-100 border-2 border-blue-300 rounded-lg p-8 text-center transition-all duration-500"
                style={{ 
                  width: `${150 + Math.random() * 200}px`,
                  height: `${100 + Math.random() * 100}px`
                }}
              >
                <div className="text-blue-800 font-medium">
                  Measured Box
                </div>
                <div className="text-sm text-blue-600 mt-2">
                  {Math.round(boxSize.width)} x {Math.round(boxSize.height)} px
                </div>
              </div>
            )}
          </div>
          
          {/* 2. Tooltip Positioning */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-green-600">
              2. Smart Tooltip Positioning
            </h3>
            
            <div
              className="bg-green-100 border-2 border-green-300 rounded-lg p-8 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-green-800 text-center">
                Move your mouse over this area
              </p>
              <p className="text-sm text-green-600 text-center mt-2">
                Tooltip uses useLayoutEffect for precise positioning
              </p>
            </div>
          </div>
          
          {/* 3. Animation with Layout */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              3. Animation với Layout Calculations
            </h3>
            
            <div className="relative bg-purple-50 border-2 border-purple-200 rounded-lg p-8 h-48 overflow-hidden">
              <div
                ref={animatedBoxRef}
                className="absolute w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold transition-transform duration-300"
                style={{ left: '50%', top: '50%', marginLeft: '-24px', marginTop: '-24px' }}
              >
                📦
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-4">
              <button
                onClick={() => handleMoveBox('up')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded transition-colors"
              >
                ↑
              </button>
              <button
                onClick={() => handleMoveBox('down')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded transition-colors"
              >
                ↓
              </button>
              <button
                onClick={() => handleMoveBox('left')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => handleMoveBox('right')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded transition-colors"
              >
                →
              </button>
            </div>
            
            <button
              onClick={handleResetPosition}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mt-2 transition-colors"
            >
              Reset Position
            </button>
          </div>
          
          {/* 4. Flickering Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">
              4. Flickering Comparison
            </h3>
            <MeasureComponent />
          </div>
        </div>
        
        {/* Right Column - Logs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Effect Execution Logs
            </h3>
            <button
              onClick={handleClearLogs}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Clear
            </button>
          </div>
          
          <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">
                Interact with examples to see effect execution order...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>🟦 useLayoutEffect (sync)</span>
              <span>🟩 useEffect (async)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tooltip Component */}
      {tooltip.show && (
        <div
          ref={tooltipRef}
          className="fixed bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-50 transition-opacity duration-200"
          style={{
            left: 0,
            top: 0,
            opacity: tooltip.show ? 1 : 0
          }}
        >
          {tooltip.text}
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-black transform rotate-45"></div>
        </div>
      )}
      
      {/* Notes */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
        <h4 className="font-semibold text-blue-800 mb-3">📝 useLayoutEffect vs useEffect:</h4>
        
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-medium text-blue-700 mb-2">📐 useLayoutEffect:</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• Chạy <strong>synchronously</strong> sau DOM mutations</li>
              <li>• Chạy <strong>trước</strong> browser paint</li>
              <li>• Block browser painting</li>
              <li>• Dùng cho DOM measurements</li>
              <li>• Prevent visual flickering</li>
              <li>• Layout calculations</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-blue-700 mb-2">⚡ useEffect:</h5>
            <ul className="text-blue-600 space-y-1">
              <li>• Chạy <strong>asynchronously</strong> sau render</li>
              <li>• Chạy <strong>sau</strong> browser paint</li>
              <li>• Không block browser painting</li>
              <li>• Dùng cho side effects</li>
              <li>• API calls, subscriptions</li>
              <li>• Non-urgent updates</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h5 className="font-medium text-blue-700 mb-2">⚠️ Khi nào dùng useLayoutEffect:</h5>
          <ul className="text-blue-600 space-y-1 text-sm">
            <li>• Measuring DOM elements (getBoundingClientRect)</li>
            <li>• Positioning elements based on other elements</li>
            <li>• Reading layout properties</li>
            <li>• Synchronous DOM updates</li>
            <li>• Preventing visual flickering</li>
            <li>• Critical layout calculations</li>
          </ul>
          
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Performance Note:</strong> useLayoutEffect blocks painting, 
              chỉ dùng khi thật sự cần thiết. Prefer useEffect trong hầu hết cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UseLayoutEffectExample 
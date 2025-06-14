'use client'

import React, { useInsertionEffect, useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'

/**
 * useInsertionEffect Hook Example - CSS-in-JS và DOM Timing
 * 
 * Hook này fires before React makes changes to the DOM, trước cả useLayoutEffect.
 * Primarily dành cho CSS-in-JS libraries để inject styles.
 * 
 * Timing order:
 * 1. useInsertionEffect (earliest)
 * 2. useLayoutEffect (before paint)
 * 3. useEffect (after paint)
 */

interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontSize: string
}

interface StyleRule {
  selector: string
  styles: Record<string, string>
  priority: number
}

// CSS-in-JS utility function
const createStyleSheet = () => {
  const styleElement = document.createElement('style')
  styleElement.setAttribute('data-react-insertion-effect', 'true')
  document.head.appendChild(styleElement)
  return styleElement
}

// Simulate CSS-in-JS library
let globalStyleSheet: HTMLStyleElement | null = null
const injectedStyles = new Set<string>()

const useCSS = (rule: string, styles: Record<string, string>) => {
  const [className] = useState(() => `css-${Math.random().toString(36).substr(2, 9)}`)
  
  // Memoize styles to prevent unnecessary re-renders
  const memoizedStyles = useMemo(() => styles, [JSON.stringify(styles)])
  
  useInsertionEffect(() => {
    // Initialize global stylesheet if needed
    if (!globalStyleSheet) {
      globalStyleSheet = createStyleSheet()
    }
    
    const styleRule = `.${className} { ${Object.entries(memoizedStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ')} }`
    
    if (!injectedStyles.has(styleRule)) {
      injectedStyles.add(styleRule)
      
      if (globalStyleSheet.sheet) {
        try {
          globalStyleSheet.sheet.insertRule(styleRule, globalStyleSheet.sheet.cssRules.length)
          console.log('💅 Injected CSS rule:', styleRule)
        } catch (error) {
          console.error('Failed to inject CSS rule:', error)
        }
      }
    }
    
    return () => {
      // Cleanup is rarely needed for CSS injection
      // but could be implemented if required
    }
  }, [className, memoizedStyles])
  
  return className
}

// Advanced CSS-in-JS hook with theme support
const useThemedCSS = (styles: Record<string, string>, theme: Theme) => {
  const [className] = useState(() => `themed-${Math.random().toString(36).substr(2, 9)}`)
  
  // Memoize processed styles to prevent unnecessary re-renders
  const processedStyles = useMemo(() => {
    return Object.entries(styles).reduce((acc, [key, value]) => {
      let processedValue = value
        .replace(/var\(--primary-color\)/g, theme.primaryColor)
        .replace(/var\(--secondary-color\)/g, theme.secondaryColor)
        .replace(/var\(--background-color\)/g, theme.backgroundColor)
        .replace(/var\(--text-color\)/g, theme.textColor)
        .replace(/var\(--border-radius\)/g, theme.borderRadius)
        .replace(/var\(--font-size\)/g, theme.fontSize)
      
      acc[key] = processedValue
      return acc
    }, {} as Record<string, string>)
  }, [styles, theme])
  
  useInsertionEffect(() => {
    if (!globalStyleSheet?.sheet) return
    
    const styleRule = `.${className} { ${Object.entries(processedStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ')} }`
    
    if (!injectedStyles.has(styleRule)) {
      injectedStyles.add(styleRule)
      
      try {
        globalStyleSheet.sheet.insertRule(styleRule, globalStyleSheet.sheet.cssRules.length)
        console.log('🎨 Injected themed CSS:', styleRule)
      } catch (error) {
        console.error('Failed to inject themed CSS:', error)
      }
    }
  }, [className, processedStyles])
  
  return className
}

// Component demonstrating CSS-in-JS with useInsertionEffect
const StyledComponent = ({ text, variant = 'primary' }: { text: string, variant?: 'primary' | 'secondary' | 'danger' }) => {
  const baseStyles = useMemo(() => ({
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'inline-block',
    textDecoration: 'none'
  }), [])
  
  const variantStyles = useMemo(() => ({
    primary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
    },
    secondary: {
      backgroundColor: '#6b7280',
      color: 'white',
      boxShadow: '0 2px 4px rgba(107, 114, 128, 0.2)'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: 'white',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
    }
  }), [])
  
  const combinedStyles = useMemo(() => ({
    ...baseStyles,
    ...variantStyles[variant]
  }), [baseStyles, variantStyles, variant])
  
  const hoverStyles = useMemo(() => ({
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  }), [])
  
  const className = useCSS(`styled-button-${variant}`, combinedStyles)
  const hoverClassName = useCSS(`styled-button-${variant}-hover`, hoverStyles)
  
  return (
    <button 
      className={`${className} hover:${hoverClassName}`}
      onMouseEnter={(e) => e.currentTarget.classList.add(hoverClassName)}
      onMouseLeave={(e) => e.currentTarget.classList.remove(hoverClassName)}
    >
      {text}
    </button>
  )
}

// Themed component example
const ThemedCard = ({ title, content, theme }: { title: string, content: string, theme: Theme }) => {
  const cardStyles = useMemo(() => ({
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
    border: `1px solid var(--primary-color)`,
    borderRadius: 'var(--border-radius)',
    padding: '20px',
    margin: '10px 0',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontSize: 'var(--font-size)'
  }), [])
  
  const titleStyles = useMemo(() => ({
    color: 'var(--primary-color)',
    fontSize: 'calc(var(--font-size) * 1.2)',
    fontWeight: 'bold',
    marginBottom: '10px',
    borderBottom: `2px solid var(--secondary-color)`,
    paddingBottom: '8px'
  }), [])
  
  const cardClassName = useThemedCSS(cardStyles, theme)
  const titleClassName = useThemedCSS(titleStyles, theme)
  
  return (
    <div className={cardClassName}>
      <h3 className={titleClassName}>{title}</h3>
      <p>{content}</p>
    </div>
  )
}

// Hook timing demonstration
const TimingDemo = () => {
  const [executionOrder, setExecutionOrder] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const renderCount = useRef(0)
  const isMountedRef = useRef(true)
  
  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])
  
  // Reset execution order when visibility toggles
  useEffect(() => {
    if (isMountedRef.current) {
      setExecutionOrder([])
    }
  }, [isVisible])
  
  // useInsertionEffect - ONLY for CSS injection, no state updates allowed
  useInsertionEffect(() => {
    console.log('🔵 useInsertionEffect executed - CSS injection only')
    // Note: useInsertionEffect must NOT schedule state updates
    // This hook is specifically for CSS-in-JS libraries
  }, [isVisible])
  
  useLayoutEffect(() => {
    console.log('🟡 useLayoutEffect executed')
    if (isMountedRef.current) {
      setExecutionOrder(prev => [...prev, `${Date.now()}: useLayoutEffect executed`])
    }
  }, [isVisible])
  
  useEffect(() => {
    console.log('🟢 useEffect executed')
    if (isMountedRef.current) {
      setExecutionOrder(prev => [...prev, `${Date.now()}: useEffect executed`])
    }
  }, [isVisible])
  
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h4 className="font-medium mb-3">Hook Execution Timing:</h4>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-3"
      >
        Toggle Visibility (Current: {isVisible ? 'Visible' : 'Hidden'})
      </button>
      
      <div className="text-sm space-y-1">
        <div className="font-medium">Execution Order (State Updates Only):</div>
        {executionOrder.map((entry, index) => (
          <div key={index} className="text-xs text-gray-600">
            {index + 1}. {entry}
          </div>
        ))}
      </div>
      
      <div className="mt-3 p-2 bg-blue-100 text-blue-800 rounded text-sm">
        <div className="font-medium mb-1">📝 Important Notes:</div>
        <div className="text-xs space-y-1">
          <div>• <strong>useInsertionEffect:</strong> Runs first but CANNOT update state</div>
          <div>• <strong>useLayoutEffect:</strong> Runs after insertion, can update state</div>
          <div>• <strong>useEffect:</strong> Runs last, can update state</div>
          <div>• Check browser console để see useInsertionEffect logs</div>
        </div>
      </div>
      
      {isVisible && (
        <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-sm">
          Component is now visible! Check the execution order above.
        </div>
      )}
    </div>
  )
}

// Dynamic style injection demo
const DynamicStyleDemo = () => {
  const [dynamicColor, setDynamicColor] = useState('#3b82f6')
  const [borderRadius, setBorderRadius] = useState('8px')
  const [fontSize, setFontSize] = useState('16px')
  
  const dynamicStyles = useMemo(() => ({
    backgroundColor: dynamicColor,
    color: 'white',
    border: 'none',
    borderRadius: borderRadius,
    fontSize: fontSize,
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '5px'
  }), [dynamicColor, borderRadius, fontSize])
  
  const dynamicClassName = useCSS('dynamic-button', dynamicStyles)
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Dynamic Style Injection:</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Background Color:</label>
          <input
            type="color"
            value={dynamicColor}
            onChange={(e) => setDynamicColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Border Radius:</label>
          <select
            value={borderRadius}
            onChange={(e) => setBorderRadius(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="0px">No Radius</option>
            <option value="4px">Small (4px)</option>
            <option value="8px">Medium (8px)</option>
            <option value="16px">Large (16px)</option>
            <option value="50%">Circle</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Font Size:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="12px">Small (12px)</option>
            <option value="14px">Normal (14px)</option>
            <option value="16px">Medium (16px)</option>
            <option value="18px">Large (18px)</option>
            <option value="24px">XL (24px)</option>
          </select>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <p className="text-sm text-gray-600 mb-3">Dynamic Button Preview:</p>
        <button className={dynamicClassName}>
          Dynamic Styled Button
        </button>
      </div>
    </div>
  )
}

const UseInsertionEffectExample = () => {
  const [theme, setTheme] = useState<Theme>({
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderRadius: '8px',
    fontSize: '16px'
  })
  
  const [cssRuleCount, setCssRuleCount] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Track CSS rule count
  useEffect(() => {
    const updateRuleCount = () => {
      setCssRuleCount(globalStyleSheet?.sheet?.cssRules.length || 0)
    }
    
    const interval = setInterval(updateRuleCount, 1000)
    updateRuleCount()
    
    return () => clearInterval(interval)
  }, [])
  
  const themes = {
    light: {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderRadius: '8px',
      fontSize: '16px'
    },
    dark: {
      primaryColor: '#60a5fa',
      secondaryColor: '#34d399',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      borderRadius: '12px',
      fontSize: '16px'
    },
    purple: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#f59e0b',
      backgroundColor: '#faf5ff',
      textColor: '#581c87',
      borderRadius: '16px',
      fontSize: '18px'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          💅 useInsertionEffect Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook này fires before React makes changes to the DOM, primary dành cho CSS-in-JS libraries. 
          Timing: useInsertionEffect → useLayoutEffect → useEffect.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          📊 CSS Injection Stats
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <div className="text-2xl font-bold text-blue-800">{cssRuleCount}</div>
            <div className="text-sm text-blue-600">CSS Rules Injected</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold text-green-800">{injectedStyles.size}</div>
            <div className="text-sm text-green-600">Unique Styles</div>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <div className="text-2xl font-bold text-purple-800">
              {globalStyleSheet ? 'Active' : 'Inactive'}
            </div>
            <div className="text-sm text-purple-600">Global StyleSheet</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-sm text-blue-700">
            💡 useInsertionEffect ensures styles are injected before DOM mutations, preventing FOUC (Flash of Unstyled Content).
          </p>
        </div>
      </div>

      {/* Hook Timing Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          ⏱️ Hook Execution Timing
        </h3>
        <TimingDemo />
        
        <div className="mt-4 p-3 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-700">
            📝 <strong>Execution Order:</strong> useInsertionEffect runs first, followed by useLayoutEffect, then useEffect.
            Check console để see the execution order.
          </p>
        </div>
      </div>

      {/* CSS-in-JS Basic Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🎨 CSS-in-JS Basic Example
        </h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Styled buttons using useCSS hook với useInsertionEffect:
            </p>
            <div className="flex flex-wrap gap-3">
              <StyledComponent text="Primary Button" variant="primary" />
              <StyledComponent text="Secondary Button" variant="secondary" />
              <StyledComponent text="Danger Button" variant="danger" />
            </div>
          </div>
          
          <DynamicStyleDemo />
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-700">
            ✅ <strong>Benefits:</strong> Styles are injected immediately, no FOUC, optimal performance với early DOM manipulation.
          </p>
        </div>
      </div>

      {/* Themed Components */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🌈 Theme-Based Styling
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            Select a theme để see dynamic style injection:
          </p>
          <div className="flex gap-2">
            {Object.entries(themes).map(([themeName, themeConfig]) => (
              <button
                key={themeName}
                onClick={() => setTheme(themeConfig)}
                className={`px-4 py-2 rounded capitalize ${
                  theme === themeConfig
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {themeName}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <ThemedCard
            title="Themed Card Example"
            content="This card adapts to the selected theme using CSS variables processed through useInsertionEffect. The styles are injected before DOM mutations."
            theme={theme}
          />
          
          <ThemedCard
            title="Another Themed Card"
            content="Multiple components can share the same theme system. Each component gets its styles injected efficiently through useInsertionEffect."
            theme={theme}
          />
        </div>
        
        <div className="mt-4 p-3 bg-purple-50 rounded">
          <p className="text-sm text-purple-700">
            🎨 <strong>Theme System:</strong> CSS variables are processed và injected using useInsertionEffect, 
            ensuring consistent styling across all themed components.
          </p>
        </div>
      </div>

      {/* Advanced Example */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🚀 Advanced CSS-in-JS Features
        </h3>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-gray-500 text-white rounded mb-4"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Example
        </button>
        
        {showAdvanced && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium mb-2">CSS Injection Stats:</h4>
              <div className="text-sm text-gray-600">
                <div>Total CSS Rules: {cssRuleCount}</div>
                <div>Unique Styles: {injectedStyles.size}</div>
                <div>StyleSheet Status: {globalStyleSheet ? 'Active' : 'Not Created'}</div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">
              <h4 className="font-medium mb-2">Injected CSS Rules:</h4>
              <div className="text-xs text-gray-600 max-h-40 overflow-y-auto">
                {Array.from(injectedStyles).map((rule, index) => (
                  <div key={index} className="mb-1 font-mono">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-orange-50 rounded">
          <p className="text-sm text-orange-700">
            ⚡ <strong>Performance:</strong> useInsertionEffect ensures all CSS is ready before any visual changes, 
            preventing layout shifts và improving performance.
          </p>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📝 Code Examples
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Basic CSS Injection:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`import { useInsertionEffect } from 'react'

function useCSS(className, styles) {
  useInsertionEffect(() => {
    // Create or get existing stylesheet
    let styleSheet = document.querySelector('[data-css-injection]')
    if (!styleSheet) {
      styleSheet = document.createElement('style')
      styleSheet.setAttribute('data-css-injection', 'true')
      document.head.appendChild(styleSheet)
    }
    
    // Inject CSS rule
    const rule = \`.\${className} { \${Object.entries(styles)
      .map(([key, value]) => \`\${key}: \${value}\`)
      .join('; ')} }\`
    
    styleSheet.sheet.insertRule(rule, 0)
  }, [className, styles])
  
  return className
}`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Theme-based Styling:</h4>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded overflow-x-auto">
{`function useThemedCSS(styles, theme) {
  const className = \`themed-\${Math.random().toString(36).substr(2, 9)}\`
  
  useInsertionEffect(() => {
    // Process theme variables
    const processedStyles = Object.entries(styles).reduce((acc, [key, value]) => {
      let processedValue = value
        .replace(/var\\(--primary-color\\)/g, theme.primaryColor)
        .replace(/var\\(--secondary-color\\)/g, theme.secondaryColor)
      
      acc[key] = processedValue
      return acc
    }, {})
    
    // Inject processed styles
    injectCSS(className, processedStyles)
  }, [className, styles, theme])
  
  return className
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          💡 Use Cases cho useInsertionEffect
        </h3>
        <ul className="space-y-2 text-sm text-green-700">
          <li>• <strong>CSS-in-JS libraries:</strong> Styled-components, Emotion, etc.</li>
          <li>• <strong>Dynamic stylesheets:</strong> Runtime CSS generation</li>
          <li>• <strong>Theme systems:</strong> CSS variable injection</li>
          <li>• <strong>Critical CSS:</strong> Above-the-fold style injection</li>
          <li>• <strong>Server-side styling:</strong> SSR CSS collection</li>
          <li>• <strong>Performance optimization:</strong> Early DOM manipulation</li>
          <li>• <strong>Style deduplication:</strong> Preventing duplicate CSS rules</li>
          <li>• <strong>Atomic CSS:</strong> Utility-first style generation</li>
        </ul>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-3">
          ⚠️ Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-red-700">
          <li>• <strong>Rare usage:</strong> Chỉ dùng khi really cần early DOM manipulation</li>
          <li>• <strong>Library authors:</strong> Primarily cho CSS-in-JS library authors</li>
          <li>• <strong>No DOM reading:</strong> Don't read DOM trong useInsertionEffect</li>
          <li>• <strong>Timing critical:</strong> Runs before React DOM mutations</li>
          <li>• <strong>SSR considerations:</strong> Handle server-side rendering carefully</li>
          <li>• <strong>Performance impact:</strong> Use judiciously để avoid performance issues</li>
        </ul>
      </div>
    </div>
  )
}

export default UseInsertionEffectExample 
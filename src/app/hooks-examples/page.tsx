'use client'

import { useState } from 'react'
import UseStateExample from '@/components/examples/UseStateExample'
import UseReducerExample from '@/components/examples/UseReducerExample'
import UseContextExample from '@/components/examples/UseContextExample'
import UseRefExample from '@/components/examples/UseRefExample'
import UseEffectExample from '@/components/examples/UseEffectExample'
import UseImperativeHandleExample from '@/components/examples/UseImperativeHandleExample'
import UseLayoutEffectExample from '@/components/examples/UseLayoutEffectExample'

/**
 * Hooks Examples Main Page
 * 
 * Trang chính showcase tất cả React và Next.js hooks examples
 * với navigation tabs để chuyển đổi giữa các hooks khác nhau.
 */

type HookType = 
  | 'useState'
  | 'useReducer' 
  | 'useContext'
  | 'useRef'
  | 'useEffect'
  | 'useLayoutEffect'
  | 'useImperativeHandle'
  | 'useRouter'
  | 'usePathname'
  | 'useSearchParams'
  | 'useParams'

interface HookInfo {
  id: HookType
  name: string
  category: 'State' | 'Context' | 'Ref' | 'Effect' | 'Navigation'
  description: string
  icon: string
  available: boolean
  component?: React.ComponentType
}

const hooksInfo: HookInfo[] = [
  // React State Hooks
  {
    id: 'useState',
    name: 'useState',
    category: 'State',
    description: 'Quản lý state trong function component',
    icon: '🎯',
    available: true,
    component: UseStateExample
  },
  {
    id: 'useReducer',
    name: 'useReducer',
    category: 'State', 
    description: 'Quản lý state phức tạp với reducer pattern',
    icon: '⚙️',
    available: true,
    component: UseReducerExample
  },
  
  // React Context Hooks
  {
    id: 'useContext',
    name: 'useContext',
    category: 'Context',
    description: 'Đọc và subscribe vào React context',
    icon: '🌐',
    available: true,
    component: UseContextExample
  },
  
  // React Ref Hooks
  {
    id: 'useRef',
    name: 'useRef',
    category: 'Ref',
    description: 'Tạo mutable ref không trigger re-render',
    icon: '🎯',
    available: true,
    component: UseRefExample
  },
  {
    id: 'useImperativeHandle',
    name: 'useImperativeHandle',
    category: 'Ref',
    description: 'Tùy chỉnh ref value được exposed từ component',
    icon: '🔧',
    available: true,
    component: UseImperativeHandleExample
  },
  
  // React Effect Hooks
  {
    id: 'useEffect',
    name: 'useEffect',
    category: 'Effect',
    description: 'Thực hiện side effects trong function component',
    icon: '⚡',
    available: true,
    component: UseEffectExample
  },
  {
    id: 'useLayoutEffect',
    name: 'useLayoutEffect',
    category: 'Effect',
    description: 'Effect chạy sync trước khi browser paint',
    icon: '📐',
    available: true,
    component: UseLayoutEffectExample
  },
  
  // Next.js Navigation Hooks
  {
    id: 'useRouter',
    name: 'useRouter',
    category: 'Navigation',
    description: 'Điều hướng programmatically trong Next.js',
    icon: '🧭',
    available: false // Sẽ implement sau
  },
  {
    id: 'usePathname',
    name: 'usePathname',
    category: 'Navigation',
    description: 'Lấy pathname hiện tại của URL',
    icon: '📍',
    available: false // Sẽ implement sau
  },
  {
    id: 'useSearchParams',
    name: 'useSearchParams',
    category: 'Navigation',
    description: 'Đọc và manipulate URL search parameters',
    icon: '🔍',
    available: false // Sẽ implement sau
  },
  {
    id: 'useParams',
    name: 'useParams',
    category: 'Navigation',
    description: 'Lấy dynamic route parameters',
    icon: '🏷️',
    available: false // Sẽ implement sau
  }
]

const categories = Array.from(new Set(hooksInfo.map(hook => hook.category)))

const HooksExamplesPage = () => {
  const [activeHook, setActiveHook] = useState<HookType>('useState')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  // Filter hooks dựa trên category
  const filteredHooks = selectedCategory === 'All' 
    ? hooksInfo 
    : hooksInfo.filter(hook => hook.category === selectedCategory)
  
  const activeHookInfo = hooksInfo.find(hook => hook.id === activeHook)
  const ActiveComponent = activeHookInfo?.component
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 React & Next.js Hooks Examples
              </h1>
              <p className="mt-2 text-gray-600">
                Tổng hợp examples chi tiết cho tất cả React và Next.js hooks
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Hook Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Available Hooks
              </h2>
              
              <div className="space-y-2">
                {filteredHooks.map((hook) => (
                  <button
                    key={hook.id}
                    onClick={() => setActiveHook(hook.id)}
                    disabled={!hook.available}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeHook === hook.id
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-800'
                        : hook.available
                          ? 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{hook.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">
                          {hook.name}
                          {!hook.available && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {hook.category}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {hook.description}
                    </p>
                  </button>
                ))}
              </div>
              
              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {hooksInfo.filter(h => h.available).length}
                    </div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {hooksInfo.filter(h => !h.available).length}
                    </div>
                    <div className="text-xs text-gray-500">Coming Soon</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {ActiveComponent ? (
              <div className="bg-white rounded-lg shadow-sm">
                <ActiveComponent />
              </div>
            ) : (
              // Placeholder cho hooks chưa implement
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">{activeHookInfo?.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {activeHookInfo?.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {activeHookInfo?.description}
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center justify-center space-x-2 text-orange-700">
                    <span className="text-2xl">🚧</span>
                    <span className="font-medium">Coming Soon!</span>
                  </div>
                  <p className="text-orange-600 text-sm mt-2">
                    Example cho hook này đang được phát triển. 
                    Hãy check lại sau nhé!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>
              📚 Created with ❤️ using React, Next.js, TypeScript & TailwindCSS
            </p>
            <p className="text-sm mt-2">
              Tất cả examples đều có TypeScript types và comments chi tiết bằng tiếng Việt
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HooksExamplesPage 
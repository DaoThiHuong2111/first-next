'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

/**
 * usePathname Hook Example - Next.js App Router
 * 
 * Hook này trả về pathname hiện tại của URL mà không bao gồm domain hay query parameters.
 * Rất hữu ích để:
 * - Highlight active navigation items
 * - Conditional rendering dựa trên route
 * - Analytics và tracking
 * - Breadcrumb navigation
 * - Route-based styling
 */

interface NavigationItem {
  path: string
  label: string
  icon: string
  description: string
}

interface BreadcrumbItem {
  label: string
  path: string
  isActive: boolean
}

const navigationItems: NavigationItem[] = [
  { path: '/', label: 'Home', icon: '🏠', description: 'Trang chủ' },
  { path: '/about', label: 'About', icon: 'ℹ️', description: 'Giới thiệu' },
  { path: '/products', label: 'Products', icon: '📦', description: 'Sản phẩm' },
  { path: '/contact', label: 'Contact', icon: '📞', description: 'Liên hệ' },
  { path: '/admin', label: 'Admin', icon: '⚙️', description: 'Quản trị' },
  { path: '/hooks-examples', label: 'Hooks Examples', icon: '🪝', description: 'Ví dụ Hooks' }
]

const UsePathnameExample = () => {
  const pathname = usePathname()
  const [pathHistory, setPathHistory] = useState<string[]>([])
  const [visitCount, setVisitCount] = useState<Record<string, number>>({})

  /**
   * Track path changes để theo dõi navigation history
   */
  useEffect(() => {
    setPathHistory(prev => {
      const newHistory = [pathname, ...prev.filter(p => p !== pathname)]
      return newHistory.slice(0, 10) // Chỉ giữ 10 paths gần nhất
    })
    
    setVisitCount(prev => ({
      ...prev,
      [pathname]: (prev[pathname] || 0) + 1
    }))
  }, [pathname])

  /**
   * Generate breadcrumb từ pathname
   */
  const generateBreadcrumb = (path: string): BreadcrumbItem[] => {
    const segments = path.split('/').filter(segment => segment !== '')
    const breadcrumb: BreadcrumbItem[] = [
      { label: 'Home', path: '/', isActive: path === '/' }
    ]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isActive = index === segments.length - 1
      
      // Format segment name
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      breadcrumb.push({
        label,
        path: currentPath,
        isActive
      })
    })

    return breadcrumb
  }

  /**
   * Check if navigation item is active
   */
  const isActiveNavItem = (itemPath: string): boolean => {
    if (itemPath === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(itemPath)
  }

  /**
   * Get route category dựa trên pathname
   */
  const getRouteCategory = (path: string): string => {
    if (path === '/') return 'Home'
    if (path.startsWith('/admin')) return 'Administration'
    if (path.startsWith('/products')) return 'E-commerce'
    if (path.startsWith('/user')) return 'User Profile'
    if (path.startsWith('/hooks-examples')) return 'Documentation'
    if (path.startsWith('/api')) return 'API Endpoint'
    return 'General'
  }

  /**
   * Get page permissions dựa trên pathname
   */
  const getPagePermissions = (path: string): string[] => {
    if (path.startsWith('/admin')) return ['admin', 'superuser']
    if (path.startsWith('/user')) return ['authenticated']
    if (path.startsWith('/api')) return ['api_access']
    return ['public']
  }

  /**
   * Simulate conditional rendering dựa trên pathname
   */
  const shouldShowSidebar = (): boolean => {
    const hideSidebarPaths = ['/', '/login', '/register']
    return !hideSidebarPaths.includes(pathname)
  }

  /**
   * Get page metadata dựa trên pathname
   */
  const getPageMetadata = () => {
    const metadata: Record<string, { title: string; description: string; keywords: string[] }> = {
      '/': {
        title: 'Home - Next.js App',
        description: 'Welcome to our Next.js application',
        keywords: ['home', 'nextjs', 'react']
      },
      '/about': {
        title: 'About Us - Next.js App',
        description: 'Learn more about our company',
        keywords: ['about', 'company', 'team']
      },
      '/products': {
        title: 'Products - Next.js App',
        description: 'Browse our product catalog',
        keywords: ['products', 'catalog', 'shop']
      },
      '/hooks-examples': {
        title: 'React Hooks Examples',
        description: 'Interactive examples of React hooks',
        keywords: ['hooks', 'react', 'examples', 'tutorial']
      }
    }

    return metadata[pathname] || {
      title: 'Page - Next.js App',
      description: 'Page description',
      keywords: ['page']
    }
  }

  const breadcrumb = generateBreadcrumb(pathname)
  const routeCategory = getRouteCategory(pathname)
  const pagePermissions = getPagePermissions(pathname)
  const metadata = getPageMetadata()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          📍 usePathname Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để lấy pathname hiện tại của URL. Rất hữu ích cho navigation highlighting, 
          conditional rendering, và tracking user behavior.
        </p>
      </div>

      {/* Current Pathname Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          🎯 Current Pathname Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Basic Info:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Pathname:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{pathname}</code></li>
              <li><strong>Length:</strong> {pathname.length} characters</li>
              <li><strong>Segments:</strong> {pathname.split('/').filter(s => s).length}</li>
              <li><strong>Category:</strong> {routeCategory}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Route Analysis:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Is Root:</strong> {pathname === '/' ? 'Yes' : 'No'}</li>
              <li><strong>Has Params:</strong> {pathname.includes('[') ? 'Yes' : 'No'}</li>
              <li><strong>Visit Count:</strong> {visitCount[pathname] || 0}</li>
              <li><strong>Permissions:</strong> {pagePermissions.join(', ')}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🍞 Dynamic Breadcrumb Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Breadcrumb được generate tự động từ pathname hiện tại.
        </p>
        
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumb.map((item, index) => (
              <li key={item.path} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                )}
                <span
                  className={`ml-1 text-sm font-medium ${
                    item.isActive 
                      ? 'text-blue-600 cursor-default' 
                      : 'text-gray-500 hover:text-blue-600 cursor-pointer'
                  }`}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Active Navigation Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🎯 Active Navigation Highlighting
        </h3>
        <p className="text-gray-600 mb-4">
          Navigation items được highlight dựa trên pathname hiện tại.
        </p>
        
        <nav className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          {navigationItems.map((item) => {
            const isActive = isActiveNavItem(item.path)
            return (
              <div
                key={item.path}
                className={`p-3 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-blue-100 border-2 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs mt-1">{item.description}</div>
                {isActive && (
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    ✓ Active
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Conditional Rendering Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🎭 Conditional Rendering Based on Pathname
        </h3>
        <p className="text-gray-600 mb-4">
          Hiển thị components khác nhau dựa trên pathname hiện tại.
        </p>
        
        <div className="space-y-4">
          {/* Sidebar Visibility */}
          <div className={`p-4 rounded-lg ${shouldShowSidebar() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h4 className="font-medium mb-2">🔧 Sidebar Visibility:</h4>
            <p className="text-sm">
              {shouldShowSidebar() 
                ? '✅ Sidebar should be visible on this page' 
                : '❌ Sidebar should be hidden on this page'
              }
            </p>
          </div>

          {/* Admin Features */}
          {pathname.startsWith('/admin') && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium mb-2">⚙️ Admin Features:</h4>
              <p className="text-sm">🔒 Admin-only features are available on this page</p>
            </div>
          )}

          {/* Documentation Features */}
          {pathname.startsWith('/hooks-examples') && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium mb-2">📚 Documentation Features:</h4>
              <p className="text-sm">📖 Code examples and interactive demos are available</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📊 Navigation History & Analytics
        </h3>
        <p className="text-gray-600 mb-4">
          Track được user navigation patterns và page visit frequency.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Paths */}
          <div>
            <h4 className="font-medium mb-3">🕐 Recent Paths:</h4>
            <ul className="space-y-2">
              {pathHistory.slice(0, 5).map((path, index) => (
                <li key={`${path}-${index}`} className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{path}</code>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit Statistics */}
          <div>
            <h4 className="font-medium mb-3">📈 Visit Statistics:</h4>
            <ul className="space-y-2">
              {Object.entries(visitCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([path, count]) => (
                <li key={path} className="flex justify-between items-center">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">{path}</code>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {count} visits
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Page Metadata */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          📄 Dynamic Page Metadata
        </h3>
        <p className="text-gray-600 mb-4">
          Metadata được generate tự động dựa trên pathname.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <dl className="grid md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-gray-700">Title:</dt>
              <dd className="text-sm text-gray-600">{metadata.title}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Description:</dt>
              <dd className="text-sm text-gray-600">{metadata.description}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Keywords:</dt>
              <dd className="text-sm text-gray-600">{metadata.keywords.join(', ')}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-700">Route Category:</dt>
              <dd className="text-sm text-gray-600">{routeCategory}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* URL Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🔍 URL Pattern Analysis
        </h3>
        <p className="text-gray-600 mb-4">
          Phân tích cấu trúc và patterns của pathname.
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Pattern Detection:</h4>
            <ul className="text-sm space-y-1">
              <li>• <strong>Static Route:</strong> {!/\[.*\]/.test(pathname) ? 'Yes' : 'No'}</li>
              <li>• <strong>Dynamic Route:</strong> {/\[.*\]/.test(pathname) ? 'Yes' : 'No'}</li>
              <li>• <strong>Nested Route:</strong> {pathname.split('/').length > 2 ? 'Yes' : 'No'}</li>
              <li>• <strong>API Route:</strong> {pathname.startsWith('/api') ? 'Yes' : 'No'}</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">URL Segments:</h4>
            <div className="flex flex-wrap gap-2">
              {pathname.split('/').filter(segment => segment !== '').map((segment, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {segment}
                </span>
              ))}
              {pathname === '/' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  root
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 Best Practices cho usePathname
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• <strong>Navigation highlighting:</strong> So sánh pathname để highlight active menu items</li>
          <li>• <strong>Conditional rendering:</strong> Render components khác nhau based on current route</li>
          <li>• <strong>Analytics tracking:</strong> Track page views và user navigation patterns</li>
          <li>• <strong>Breadcrumb generation:</strong> Tự động generate breadcrumb từ URL structure</li>
          <li>• <strong>Permission checking:</strong> Check user permissions dựa trên current route</li>
          <li>• <strong>SEO optimization:</strong> Generate dynamic metadata cho mỗi page</li>
          <li>• <strong>Performance:</strong> usePathname không trigger unnecessary re-renders</li>
        </ul>
      </div>
    </div>
  )
}

export default UsePathnameExample 
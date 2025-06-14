'use client'

import { useLinkStatus } from 'next/link'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Component LoadingIndicator sử dụng useLinkStatus
const LoadingIndicator = () => {
  const { pending } = useLinkStatus()
  
  return pending ? (
    <div role="status" aria-label="Loading" className="inline-flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
      <span className="text-sm text-blue-600">Đang tải...</span>
    </div>
  ) : null
}

// Component LoadingSpinner nâng cao
const LoadingSpinner = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const { pending } = useLinkStatus()
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return pending ? (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 border border-gray-200 z-50">
      <div className="flex items-center">
        <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizeClasses[size]} mr-2`}></div>
        <span className="text-sm font-medium text-gray-700">Đang chuyển trang...</span>
      </div>
    </div>
  ) : null
}

// Component LinkWithStatus - Link với status indicator
const LinkWithStatus = ({ 
  href, 
  children, 
  className = '',
  showInlineStatus = false 
}: { 
  href: string
  children: React.ReactNode
  className?: string
  showInlineStatus?: boolean
}) => {
  return (
    <Link href={href} className={`${className} relative`}>
      <span className="flex items-center">
        {children}
        {showInlineStatus && (
          <span className="ml-2">
            <LoadingIndicator />
          </span>
        )}
      </span>
    </Link>
  )
}

const UseLinkStatusExample = () => {
  const [navigationCount, setNavigationCount] = useState(0)
  const [lastNavigationTime, setLastNavigationTime] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<string>('')

  // Update thời gian
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('vi-VN'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Theo dõi navigation
  const handleNavigation = () => {
    setNavigationCount(prev => prev + 1)
    setLastNavigationTime(new Date().toLocaleTimeString('vi-VN'))
  }

  // Danh sách các demo pages
  const demoPages = [
    { href: '/hooks-examples', title: 'Hooks Examples', description: 'Trang chính hooks examples', icon: '🔧' },
    { href: '/admin/dashboard', title: 'Dashboard', description: 'Trang dashboard admin', icon: '📊' },
    { href: '/admin/users', title: 'Users', description: 'Quản lý người dùng', icon: '👥' },
    { href: '/admin/products', title: 'Products', description: 'Quản lý sản phẩm', icon: '📦' },
    { href: '/admin/settings', title: 'Settings', description: 'Cài đặt hệ thống', icon: '⚙️' },
    { href: '/blog/post-1', title: 'Blog Post 1', description: 'Bài viết blog mẫu', icon: '📝' },
    { href: '/profile', title: 'Profile', description: 'Trang profile cá nhân', icon: '👤' }
  ]

  return (
    <div className="space-y-8">
      {/* Global Loading Indicator */}
      <LoadingSpinner size="md" />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">useLinkStatus Hook</h2>
        <p className="text-indigo-100 leading-relaxed">
          Hook này cho phép theo dõi trạng thái loading khi navigation đang diễn ra. 
          Rất hữu ích để hiển thị loading indicators và cải thiện UX.
        </p>
      </div>

      {/* Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            🔄 Số lần Navigation
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            {navigationCount}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            ⏰ Navigation cuối
          </h3>
          <div className="text-lg font-mono text-green-600">
            {lastNavigationTime || 'Chưa có'}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">
            🕐 Thời gian hiện tại
          </h3>
          <div className="text-lg font-mono text-purple-600">
            {currentTime}
          </div>
        </div>
      </div>

      {/* Basic Example */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🎯 Basic Loading Indicator
        </h3>
        <p className="text-gray-600 mb-4">
          Click vào link để xem loading indicator hoạt động:
        </p>

        <div className="flex flex-wrap gap-4">
          <LinkWithStatus
            href="/hooks-examples"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            showInlineStatus={true}
            onClick={handleNavigation}
          >
            📚 Hooks Examples
          </LinkWithStatus>

          <LinkWithStatus
            href="/admin/dashboard"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            showInlineStatus={true}
            onClick={handleNavigation}
          >
            📊 Dashboard
          </LinkWithStatus>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🌐 Navigation Grid với Loading Status
        </h3>
        <p className="text-gray-600 mb-4">
          Các link này sẽ hiển thị loading indicator toàn cục khi được click:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoPages.map((page, index) => (
            <Link
              key={index}
              href={page.href}
              onClick={handleNavigation}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start">
                <span className="text-2xl mr-3 transform group-hover:scale-110 transition-transform">
                  {page.icon}
                </span>
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                    {page.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {page.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom Loading Components */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🎨 Custom Loading Components
        </h3>
        <p className="text-gray-600 mb-4">
          Các kiểu loading indicator khác nhau:
        </p>

        <div className="space-y-4">
          {/* Pulse Loading */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Link
                href="/admin/users"
                onClick={handleNavigation}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors mr-4"
              >
                👥 Users Page
              </Link>
              <span className="text-gray-600">Pulse loading style</span>
            </div>
            <PulseLoader />
          </div>

          {/* Dots Loading */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Link
                href="/admin/products"
                onClick={handleNavigation}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors mr-4"
              >
                📦 Products Page
              </Link>
              <span className="text-gray-600">Dots loading style</span>
            </div>
            <DotsLoader />
          </div>

          {/* Bar Loading */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Link
                href="/admin/settings"
                onClick={handleNavigation}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors mr-4"
              >
                ⚙️ Settings Page
              </Link>
              <span className="text-gray-600">Progress bar style</span>
            </div>
            <BarLoader />
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          💻 Code Examples
        </h3>

        <div className="space-y-4">
          {/* Basic Usage */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              📝 Sử dụng cơ bản:
            </h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`'use client'
import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  
  return pending ? (
    <div role="status" aria-label="Loading" className="spinner" />
  ) : null
}`}
            </div>
          </div>

          {/* Advanced Usage */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              🔄 Advanced Loading Component:
            </h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`function GlobalLoader() {
  const { pending } = useLinkStatus()
  
  return pending ? (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-600 animate-pulse z-50">
      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse" />
    </div>
  ) : null
}`}
            </div>
          </div>

          {/* Link with Status */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              🔗 Link với Status:
            </h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`function LinkWithStatus({ href, children }) {
  return (
    <Link href={href}>
      <span className="flex items-center">
        {children}
        <LoadingIndicator />
      </span>
    </Link>
  )
}`}
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-amber-800">
          ⚡ Best Practices
        </h3>

        <ul className="space-y-3 text-amber-700">
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
            <div>
              <strong>Descendant of Link:</strong> Hook này chỉ hoạt động trong component con của Link
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
            <div>
              <strong>SPA Navigation:</strong> Chỉ hiển thị loading cho client-side navigation
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
            <div>
              <strong>Accessibility:</strong> Luôn thêm role="status" và aria-label cho screen readers
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
            <div>
              <strong>Performance:</strong> Sử dụng CSS animations thay vì JavaScript cho smooth loading
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

// Custom Loading Components
const PulseLoader = () => {
  const { pending } = useLinkStatus()
  
  return pending ? (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  ) : null
}

const DotsLoader = () => {
  const { pending } = useLinkStatus()
  
  return pending ? (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  ) : null
}

const BarLoader = () => {
  const { pending } = useLinkStatus()
  
  return pending ? (
    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div className="w-full h-full bg-gray-500 animate-pulse"></div>
    </div>
  ) : null
}

export default UseLinkStatusExample 
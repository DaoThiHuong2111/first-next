'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Interface cho segment info
interface SegmentInfo {
  segment: string
  path: string
  title: string
  icon: string
}

const UseSelectedLayoutSegmentsExample = () => {
  // Lấy tất cả segments hiện tại
  const segments = useSelectedLayoutSegments()
  
  // State để demo
  const [currentTime, setCurrentTime] = useState<string>('')
  const [segmentHistory, setSegmentHistory] = useState<string[][]>([])

  // Mapping segments to readable names
  const segmentMapping: Record<string, SegmentInfo> = {
    'admin': { segment: 'admin', path: '/admin', title: 'Quản trị', icon: '⚙️' },
    'dashboard': { segment: 'dashboard', path: '/admin/dashboard', title: 'Bảng điều khiển', icon: '📊' },
    'users': { segment: 'users', path: '/admin/users', title: 'Người dùng', icon: '👥' },
    'products': { segment: 'products', path: '/admin/products', title: 'Sản phẩm', icon: '📦' },
    'categories': { segment: 'categories', path: '/admin/categories', title: 'Danh mục', icon: '📂' },
    'settings': { segment: 'settings', path: '/admin/settings', title: 'Cài đặt', icon: '⚙️' },
    'profile': { segment: 'profile', path: '/admin/profile', title: 'Hồ sơ', icon: '👤' },
    'security': { segment: 'security', path: '/admin/security', title: 'Bảo mật', icon: '🔒' },
    'reports': { segment: 'reports', path: '/admin/reports', title: 'Báo cáo', icon: '📈' },
    'analytics': { segment: 'analytics', path: '/admin/analytics', title: 'Phân tích', icon: '📊' }
  }

  // Update thời gian
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('vi-VN'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Lưu lịch sử segments
  useEffect(() => {
    if (segments.length > 0) {
      setSegmentHistory(prev => {
        const newHistory = [segments, ...prev.slice(0, 4)] // Giữ 5 entry gần nhất
        return newHistory
      })
    }
  }, [segments])

  // Tạo breadcrumb từ segments
  const createBreadcrumb = (segments: string[]) => {
    const breadcrumbItems = [
      { title: 'Trang chủ', path: '/', icon: '🏠' }
    ]

    let currentPath = ''
    segments.forEach(segment => {
      currentPath += `/${segment}`
      const segmentInfo = segmentMapping[segment]
      breadcrumbItems.push({
        title: segmentInfo?.title || segment,
        path: currentPath,
        icon: segmentInfo?.icon || '📄'
      })
    })

    return breadcrumbItems
  }

  const breadcrumbItems = createBreadcrumb(segments)

  // Tạo navigation tree
  const navigationTree = [
    {
      title: 'Admin Panel',
      path: '/admin',
      children: [
        { title: 'Dashboard', path: '/admin/dashboard' },
        { title: 'Users', path: '/admin/users' },
        { title: 'Products', path: '/admin/products' },
        { title: 'Categories', path: '/admin/categories' }
      ]
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      children: [
        { title: 'Profile', path: '/admin/settings/profile' },
        { title: 'Security', path: '/admin/settings/security' }
      ]
    },
    {
      title: 'Reports',
      path: '/admin/reports',
      children: [
        { title: 'Analytics', path: '/admin/reports/analytics' }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">useSelectedLayoutSegments Hook</h2>
        <p className="text-purple-100 leading-relaxed">
          Hook này trả về mảng tất cả segments đang hoạt động trong route hiện tại. 
          Rất hữu ích để tạo breadcrumb và navigation phức tạp.
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            📍 Segments Hiện Tại
          </h3>
          <div className="text-lg font-mono bg-white p-2 rounded border">
            {segments.length > 0 ? `[${segments.map(s => `'${s}'`).join(', ')}]` : '[] (trang chủ)'}
          </div>
          <div className="text-sm text-green-600 mt-2">
            Số lượng segments: {segments.length}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            ⏰ Thời Gian Hiện Tại
          </h3>
          <div className="text-lg font-mono bg-white p-2 rounded border">
            {currentTime}
          </div>
        </div>
      </div>

      {/* Dynamic Breadcrumb */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🍞 Dynamic Breadcrumb Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Breadcrumb được tạo tự động từ các segments hiện tại:
        </p>

        <nav className="flex items-center flex-wrap gap-2 bg-gray-50 p-4 rounded-lg">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-gray-400 mx-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              <Link
                href={item.path}
                className={`
                  inline-flex items-center px-3 py-1 rounded-lg text-sm transition-colors
                  ${index === breadcrumbItems.length - 1
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                <span className="mr-1">{item.icon}</span>
                {item.title}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Segments Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🔍 Segments Breakdown
        </h3>
        <p className="text-gray-600 mb-4">
          Chi tiết các segment trong route hiện tại:
        </p>

        {segments.length > 0 ? (
          <div className="grid gap-3">
            {segments.map((segment, index) => {
              const segmentInfo = segmentMapping[segment]
              return (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mr-3">
                        #{index + 1}
                      </span>
                      <span className="text-2xl mr-2">{segmentInfo?.icon || '📄'}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {segmentInfo?.title || segment}
                        </h4>
                        <p className="text-sm text-gray-600">Segment: "{segment}"</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Depth Level</div>
                      <div className="font-bold text-blue-600">{index + 1}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-6xl mb-4 block">🏠</span>
            <p>Bạn đang ở trang chủ - không có segments nào</p>
          </div>
        )}
      </div>

      {/* Navigation Tree */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🌳 Navigation Tree Example
        </h3>
        <p className="text-gray-600 mb-4">
          Click vào các link để xem segments thay đổi:
        </p>

        <div className="grid gap-4">
          {navigationTree.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                {section.title}
              </h4>
              <div className="ml-4 space-y-2">
                {section.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.path}
                    className="block text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    → {child.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segment History */}
      {segmentHistory.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            📜 Segment History
          </h3>
          <p className="text-gray-600 mb-4">
            Lịch sử 5 lần navigation gần nhất:
          </p>

          <div className="space-y-2">
            {segmentHistory.map((historySegments, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  index === 0
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">
                    [{historySegments.map(s => `'${s}'`).join(', ')}]
                  </span>
                  {index === 0 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      Hiện tại
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
import { useSelectedLayoutSegments } from 'next/navigation'

export default function Breadcrumb() {
  const segments = useSelectedLayoutSegments()
  
  return (
    <nav>
      {segments.map((segment, index) => (
        <span key={index}>{segment}</span>
      ))}
    </nav>
  )
}`}
            </div>
          </div>

          {/* Advanced Breadcrumb */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              🍞 Advanced Breadcrumb:
            </h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`function DynamicBreadcrumb() {
  const segments = useSelectedLayoutSegments()
  
  const breadcrumbItems = ['Home']
  let currentPath = ''
  
  segments.forEach(segment => {
    currentPath += '/' + segment
    breadcrumbItems.push({
      title: segment,
      path: currentPath
    })
  })
  
  return (
    <nav>
      {breadcrumbItems.map((item, index) => (
        <Link key={index} href={item.path}>
          {item.title}
        </Link>
      ))}
    </nav>
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
              <strong>Client Component Only:</strong> Hook này chỉ hoạt động trong Client Components
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
            <div>
              <strong>Array Processing:</strong> Luôn kiểm tra segments.length trước khi xử lý
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
            <div>
              <strong>Dynamic Routing:</strong> Hoàn hảo cho breadcrumb và navigation trees
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
            <div>
              <strong>Performance:</strong> Kết hợp với useMemo để cache breadcrumb computation
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UseSelectedLayoutSegmentsExample 
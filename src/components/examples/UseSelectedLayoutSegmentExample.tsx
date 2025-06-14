'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Interface cho menu items
interface MenuItem {
  slug: string
  title: string
  description: string
}

// Interface cho blog nav item
interface BlogNavItemProps {
  slug: string
  children: React.ReactNode
}

const UseSelectedLayoutSegmentExample = () => {
  // Lấy segment hiện tại
  const segment = useSelectedLayoutSegment()
  
  // State để demo
  const [menuItems] = useState<MenuItem[]>([
    { slug: 'dashboard', title: 'Dashboard', description: 'Trang chính quản lý' },
    { slug: 'users', title: 'Users', description: 'Quản lý người dùng' },
    { slug: 'products', title: 'Products', description: 'Quản lý sản phẩm' },
    { slug: 'settings', title: 'Settings', description: 'Cài đặt hệ thống' },
    { slug: 'reports', title: 'Reports', description: 'Báo cáo và thống kê' }
  ])

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

  // Component BlogNavLink sử dụng useSelectedLayoutSegment
  const BlogNavLink = ({ slug, children }: BlogNavItemProps) => {
    const currentSegment = useSelectedLayoutSegment()
    const isActive = slug === currentSegment

    return (
      <Link
        href={`/admin/${slug}`}
        className={`
          inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
          }
        `}
        style={{ fontWeight: isActive ? 'bold' : 'normal' }}
      >
        <span className={`
          inline-block w-2 h-2 rounded-full mr-2 transition-colors
          ${isActive ? 'bg-white' : 'bg-gray-400'}
        `}></span>
        {children}
      </Link>
    )
  }

  // Tìm menu item hiện tại
  const currentMenuItem = menuItems.find(item => item.slug === segment)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">useSelectedLayoutSegment Hook</h2>
        <p className="text-blue-100 leading-relaxed">
          Hook này cho phép đọc segment đang hoạt động một cấp dưới layout hiện tại. 
          Rất hữu ích để tạo navigation menu và breadcrumb động.
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            📍 Segment Hiện Tại
          </h3>
          <div className="text-lg font-mono bg-white p-2 rounded border">
            {segment || 'null (trang chủ)'}
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

      {/* Navigation Menu Example */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🧭 Navigation Menu với Active State
        </h3>
        <p className="text-gray-600 mb-4">
          Sử dụng useSelectedLayoutSegment để highlight menu item đang hoạt động:
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          {menuItems.map(item => (
            <BlogNavLink key={item.slug} slug={item.slug}>
              {item.title}
            </BlogNavLink>
          ))}
        </div>

        {/* Current menu info */}
        {currentMenuItem && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 mb-1">
              🎯 Menu Đang Hoạt Động: {currentMenuItem.title}
            </h4>
            <p className="text-blue-700 text-sm">
              {currentMenuItem.description}
            </p>
          </div>
        )}
      </div>

      {/* Breadcrumb Example */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🍞 Breadcrumb Navigation
        </h3>
        <p className="text-gray-600 mb-4">
          Sử dụng segment để tạo breadcrumb động:
        </p>

        <nav className="flex items-center space-x-2 text-sm bg-gray-50 p-3 rounded-lg">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            🏠 Trang Chủ
          </Link>
          
          {segment && (
            <>
              <span className="text-gray-400">/</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                📄 {currentMenuItem?.title || segment}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Parallel Routes Example */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🔄 Parallel Routes Support
        </h3>
        <p className="text-gray-600 mb-4">
          Hook hỗ trợ tham số parallelRoutesKey để đọc segment từ parallel route cụ thể:
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <code className="text-sm text-gray-800">
            {`// Đọc segment từ parallel route 'auth'
const loginSegment = useSelectedLayoutSegment('auth')

// Ví dụ: URL /admin/@auth/login 
// loginSegment sẽ trả về 'login'`}
          </code>
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
import { useSelectedLayoutSegment } from 'next/navigation'

export default function Navigation() {
  const segment = useSelectedLayoutSegment()
  
  return (
    <p>Active segment: {segment}</p>
  )
}`}
            </div>
          </div>

          {/* Active Link */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              🔗 Tạo Active Link:
            </h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`function NavLink({ slug, children }) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link 
      href={\`/admin/\${slug}\`}
      className={isActive ? 'active' : ''}
    >
      {children}
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
              <strong>Client Component Only:</strong> Hook này chỉ hoạt động trong Client Components
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
            <div>
              <strong>Layout Structure:</strong> Trả về segment một cấp dưới layout hiện tại
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
            <div>
              <strong>Parallel Routes:</strong> Sử dụng tham số để đọc từ parallel route cụ thể
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-amber-200 text-amber-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
            <div>
              <strong>Performance:</strong> Kết hợp với React.memo để tối ưu re-render
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UseSelectedLayoutSegmentExample 
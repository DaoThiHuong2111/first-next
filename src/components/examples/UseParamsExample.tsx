'use client'

import { useParams, useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

/**
 * useParams Hook Example - Next.js App Router
 * 
 * Hook này trả về object chứa dynamic route parameters từ current URL.
 * Rất hữu ích cho:
 * - Dynamic routes như [id], [slug], [...segments]
 * - Nested dynamic routes
 * - Catch-all routes
 * - Optional catch-all routes
 * - Accessing route parameters trong components
 */

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  posts: number
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
}

interface BlogPost {
  slug: string
  title: string
  content: string
  author: string
  date: string
}

const UseParamsExample = () => {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Mock data states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Simulate API calls dựa trên route parameters
   */
  useEffect(() => {
    if (Object.keys(params).length > 0) {
      setIsLoading(true)
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock data based on route type
        if (params.userId) {
          setUserProfile({
            id: params.userId as string,
            name: `User ${params.userId}`,
            email: `user${params.userId}@example.com`,
            avatar: '👤',
            posts: Math.floor(Math.random() * 100)
          })
        }
        
        if (params.productId) {
          setProduct({
            id: params.productId as string,
            name: `Product ${params.productId}`,
            category: params.category as string || 'General',
            price: Math.floor(Math.random() * 1000) + 10,
            description: `This is a description for product ${params.productId}`
          })
        }
        
        if (params.slug) {
          setBlogPost({
            slug: params.slug as string,
            title: `Blog Post: ${(params.slug as string).replace(/-/g, ' ')}`,
            content: `This is the content for blog post with slug: ${params.slug}`,
            author: 'Admin',
            date: new Date().toLocaleDateString()
          })
        }
        
        setIsLoading(false)
      }, 1000)
    }
  }, [params])

  /**
   * Navigate to different dynamic routes
   */
  const navigateToRoute = (routePath: string) => {
    router.push(routePath)
  }

  /**
   * Get parameter information
   */
  const getParameterInfo = () => {
    const paramEntries = Object.entries(params)
    const paramCount = paramEntries.length
    const hasArrayParams = paramEntries.some(([_, value]) => Array.isArray(value))
    const isCatchAll = pathname.includes('[...') || pathname.includes('[[...')
    
    return {
      paramEntries,
      paramCount,
      hasArrayParams,
      isCatchAll
    }
  }

  /**
   * Format parameters để hiển thị
   */
  const formatParamValue = (value: string | string[]): string => {
    if (Array.isArray(value)) {
      return `[${value.join(', ')}]`
    }
    return value
  }

  /**
   * Generate breadcrumb từ params
   */
  const generateParamBreadcrumb = () => {
    const breadcrumb = ['Home']
    
    if (params.category) breadcrumb.push(`Category: ${params.category}`)
    if (params.productId) breadcrumb.push(`Product: ${params.productId}`)
    if (params.userId) breadcrumb.push(`User: ${params.userId}`)
    if (params.slug) breadcrumb.push(`Post: ${params.slug}`)
    
    return breadcrumb
  }

  /**
   * Route examples để demonstrate
   */
  const routeExamples = [
    {
      path: '/users/123',
      description: 'Single dynamic segment: [userId]',
      params: { userId: '123' },
      icon: '👤'
    },
    {
      path: '/products/electronics/laptop-456',
      description: 'Multiple dynamic segments: [category]/[productId]',
      params: { category: 'electronics', productId: 'laptop-456' },
      icon: '💻'
    },
    {
      path: '/blog/react-hooks-guide',
      description: 'Slug route: [slug]',
      params: { slug: 'react-hooks-guide' },
      icon: '📝'
    },
    {
      path: '/docs/getting-started/installation',
      description: 'Catch-all route: [...segments]',
      params: { segments: ['getting-started', 'installation'] },
      icon: '📚'
    },
    {
      path: '/admin/users/123/settings',
      description: 'Nested dynamic: [userId]/settings',
      params: { userId: '123' },
      icon: '⚙️'
    }
  ]

  const paramInfo = getParameterInfo()
  const breadcrumb = generateParamBreadcrumb()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🏷️ useParams Hook Example
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hook để truy cập dynamic route parameters trong Next.js App Router. 
          Hỗ trợ single params, multiple params, catch-all routes và optional catch-all routes.
        </p>
      </div>

      {/* Current Parameters Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">
          📊 Current Route Parameters
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-3">Active Parameters:</h4>
            {paramInfo.paramCount > 0 ? (
              <ul className="space-y-2">
                {paramInfo.paramEntries.map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between bg-blue-100 p-3 rounded">
                    <span className="font-medium text-blue-900">{key}:</span>
                    <code className="text-sm bg-blue-200 px-2 py-1 rounded text-blue-800">
                      {formatParamValue(value)}
                    </code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-600 italic">
                Chưa có route parameters. Navigate đến dynamic route để xem parameters.
              </p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-blue-800 mb-3">Route Info:</h4>
            <ul className="space-y-1 text-sm">
              <li><strong>Current pathname:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{pathname}</code></li>
              <li><strong>Parameter count:</strong> {paramInfo.paramCount}</li>
              <li><strong>Has array params:</strong> {paramInfo.hasArrayParams ? 'Yes' : 'No'}</li>
              <li><strong>Is catch-all route:</strong> {paramInfo.isCatchAll ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Breadcrumb from Params */}
      {paramInfo.paramCount > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            🍞 Dynamic Breadcrumb from Parameters
          </h3>
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">→</span>}
                <span className={index === breadcrumb.length - 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}>
                  {item}
                </span>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Route Examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🗺️ Dynamic Route Examples
        </h3>
        <p className="text-gray-600 mb-4">
          Click vào các examples để navigate và xem params được extract như thế nào.
        </p>
        
        <div className="grid gap-4">
          {routeExamples.map((example, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{example.icon}</span>
                  <div>
                    <div className="font-medium">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{example.path}</code>
                    </div>
                    <div className="text-sm text-gray-600">{example.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigateToRoute(example.path)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Navigate
                </button>
              </div>
              
              <div className="mt-3 ml-11">
                <div className="text-xs text-gray-500 mb-1">Expected params:</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(example.params).map(([key, value]) => (
                    <span key={key} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {key}: {formatParamValue(value)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Loading Based on Params */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading data based on route parameters...</span>
          </div>
        </div>
      )}

      {/* User Profile Data */}
      {userProfile && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            👤 User Profile (from userId param)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{userProfile.avatar}</div>
              <div>
                <h4 className="font-medium text-lg">{userProfile.name}</h4>
                <p className="text-gray-600">{userProfile.email}</p>
                <p className="text-sm text-gray-500">{userProfile.posts} posts</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <strong>Parameter used:</strong> userId = <code className="bg-gray-200 px-2 py-1 rounded">{params.userId}</code>
            </div>
          </div>
        </div>
      )}

      {/* Product Data */}
      {product && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            📦 Product Details (from productId & category params)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-lg">{product.name}</h4>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {product.category}
              </span>
              <span className="font-medium text-green-600">
                ${product.price}
              </span>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <strong>Parameters used:</strong> 
              {params.category && <> category = <code className="bg-gray-200 px-2 py-1 rounded mx-1">{params.category}</code></>}
              {params.productId && <> productId = <code className="bg-gray-200 px-2 py-1 rounded mx-1">{params.productId}</code></>}
            </div>
          </div>
        </div>
      )}

      {/* Blog Post Data */}
      {blogPost && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            📝 Blog Post (from slug param)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-lg">{blogPost.title}</h4>
            <div className="text-sm text-gray-500 mb-3">
              By {blogPost.author} • {blogPost.date}
            </div>
            <p className="text-gray-700">{blogPost.content}</p>
            <div className="mt-4 text-sm text-gray-600">
              <strong>Parameter used:</strong> slug = <code className="bg-gray-200 px-2 py-1 rounded">{params.slug}</code>
            </div>
          </div>
        </div>
      )}

      {/* Parameter Manipulation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🛠️ Parameter Manipulation Examples
        </h3>
        <p className="text-gray-600 mb-4">
          Các patterns thường gặp khi làm việc với route parameters.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">🔍 Parameter Validation:</h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <code className="text-xs">
                  {`// Validate userId param
const userId = params.userId
if (!userId || Array.isArray(userId)) {
  return <div>Invalid user ID</div>
}

// Use the validated param
const numericId = parseInt(userId)
if (isNaN(numericId)) {
  return <div>User ID must be numeric</div>
}`}
                </code>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">🎯 Type Safety:</h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <code className="text-xs">
                  {`// TypeScript interface for params
interface PageParams {
  userId?: string
  productId?: string
  category?: string
  slug?: string
  segments?: string[]
}

const typedParams = params as PageParams`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Pattern Demos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          🏗️ Route Pattern Demonstrations
        </h3>
        
        <div className="grid gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">📁 File Structure Examples:</h4>
            <div className="space-y-2 text-sm font-mono">
              <div><code>app/users/[userId]/page.tsx</code> → <code>params: {'{userId: "123"}'}</code></div>
              <div><code>app/products/[category]/[id]/page.tsx</code> → <code>params: {'{category: "electronics", id: "456"}'}</code></div>
              <div><code>app/blog/[...slug]/page.tsx</code> → <code>params: {'{slug: ["react", "hooks"]}'}</code></div>
              <div><code>app/docs/[[...segments]]/page.tsx</code> → <code>params: {'{segments: ["getting-started"] | undefined}'}</code></div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">⚙️ Common Use Cases:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>User profiles:</strong> <code>/users/[userId]</code></li>
              <li>• <strong>Product pages:</strong> <code>/products/[category]/[productId]</code></li>
              <li>• <strong>Blog posts:</strong> <code>/blog/[slug]</code></li>
              <li>• <strong>Documentation:</strong> <code>/docs/[...segments]</code></li>
              <li>• <strong>Admin panels:</strong> <code>/admin/[section]/[...params]</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          💡 Best Practices cho useParams
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• <strong>Parameter validation:</strong> Luôn validate params trước khi sử dụng</li>
          <li>• <strong>Type safety:</strong> Định nghĩa TypeScript interfaces cho params</li>
          <li>• <strong>Error handling:</strong> Handle trường hợp params missing hoặc invalid</li>
          <li>• <strong>Default values:</strong> Cung cấp default values cho optional params</li>
          <li>• <strong>SEO friendly:</strong> Sử dụng meaningful parameter names</li>
          <li>• <strong>Catch-all routes:</strong> Dùng [...segments] cho flexible routing</li>
          <li>• <strong>Optional catch-all:</strong> Dùng [[...segments]] khi params có thể empty</li>
          <li>• <strong>Performance:</strong> useParams không cause unnecessary re-renders</li>
        </ul>
      </div>
    </div>
  )
}

export default UseParamsExample 
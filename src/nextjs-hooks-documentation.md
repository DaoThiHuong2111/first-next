# Next.js Hooks Documentation

## Next.js Navigation Hooks (App Router)

### 1. useRouter
**Mục đích**: Điều hướng programmatically trong App Router
**Cú pháp**: `const router = useRouter()`
**Import**: `import { useRouter } from 'next/navigation'`

```tsx
'use client'
import { useRouter } from 'next/navigation'

const NavigationExample = () => {
  const router = useRouter()
  
  const handleNavigate = () => {
    // Điều hướng đến trang dashboard
    router.push('/dashboard')
  }
  
  const handleNavigateWithoutScroll = () => {
    // Điều hướng mà không scroll to top
    router.push('/profile', { scroll: false })
  }
  
  const handleReplace = () => {
    // Thay thế current entry trong history
    router.replace('/login')
  }
  
  const handleRefresh = () => {
    // Refresh current route
    router.refresh()
  }
  
  const handleGoBack = () => {
    // Quay lại trang trước
    router.back()
  }
  
  const handleGoForward = () => {
    // Đi tới trang tiếp theo
    router.forward()
  }
  
  const handlePrefetch = () => {
    // Prefetch trang để tăng tốc độ điều hướng
    router.prefetch('/dashboard')
  }
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">useRouter Examples</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleNavigate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Navigate to Dashboard
        </button>
        
        <button
          onClick={handleNavigateWithoutScroll}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Navigate without Scroll
        </button>
        
        <button
          onClick={handleReplace}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Replace with Login
        </button>
        
        <button
          onClick={handleRefresh}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Refresh Page
        </button>
        
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
        
        <button
          onClick={handleGoForward}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Go Forward
        </button>
        
        <button
          onClick={handlePrefetch}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Prefetch Dashboard
        </button>
      </div>
    </div>
  )
}
```

### 2. usePathname
**Mục đích**: Lấy pathname hiện tại của URL
**Cú pháp**: `const pathname = usePathname()`
**Import**: `import { usePathname } from 'next/navigation'`

```tsx
'use client'
import { usePathname } from 'next/navigation'

const PathnameDisplay = () => {
  // Lấy pathname hiện tại
  const pathname = usePathname()
  
  // Kiểm tra route hiện tại
  const isHomePage = pathname === '/'
  const isDashboard = pathname.startsWith('/dashboard')
  const isProfile = pathname === '/profile'
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Current Pathname</h2>
      
      <div className="space-y-2">
        <p className="text-lg">
          <strong>Current Path:</strong> {pathname}
        </p>
        
        <div className="flex space-x-4">
          <span className={`px-3 py-1 rounded ${
            isHomePage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isHomePage ? '✓' : '✗'} Home Page
          </span>
          
          <span className={`px-3 py-1 rounded ${
            isDashboard ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isDashboard ? '✓' : '✗'} Dashboard Section
          </span>
          
          <span className={`px-3 py-1 rounded ${
            isProfile ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isProfile ? '✓' : '✗'} Profile Page
          </span>
        </div>
      </div>
    </div>
  )
}
```

### 3. useSearchParams
**Mục đích**: Đọc query parameters từ URL
**Cú pháp**: `const searchParams = useSearchParams()`
**Import**: `import { useSearchParams } from 'next/navigation'`

```tsx
'use client'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const SearchParamsExample = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Lấy các query parameters
  const query = searchParams.get('query') || ''
  const page = searchParams.get('page') || '1'
  const sort = searchParams.get('sort') || 'name'
  const filter = searchParams.get('filter') || 'all'
  
  // Helper function để tạo query string mới
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  
  // Handlers để update query parameters
  const handleQueryChange = (newQuery: string) => {
    router.push(pathname + '?' + createQueryString('query', newQuery))
  }
  
  const handlePageChange = (newPage: string) => {
    router.push(pathname + '?' + createQueryString('page', newPage))
  }
  
  const handleSortChange = (newSort: string) => {
    router.push(pathname + '?' + createQueryString('sort', newSort))
  }
  
  const handleFilterChange = (newFilter: string) => {
    router.push(pathname + '?' + createQueryString('filter', newFilter))
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Parameters</h2>
      
      {/* Hiển thị current parameters */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">Current Parameters:</h3>
        <ul className="space-y-1">
          <li><strong>Query:</strong> {query || 'none'}</li>
          <li><strong>Page:</strong> {page}</li>
          <li><strong>Sort:</strong> {sort}</li>
          <li><strong>Filter:</strong> {filter}</li>
        </ul>
      </div>
      
      {/* Controls để thay đổi parameters */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search Query:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded w-full"
            placeholder="Enter search query..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Page:</label>
          <select
            value={page}
            onChange={(e) => handlePageChange(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="1">Page 1</option>
            <option value="2">Page 2</option>
            <option value="3">Page 3</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sort By:</label>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="price">Price</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Filter:</label>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  )
}
```

### 4. useParams
**Mục đích**: Lấy dynamic route parameters
**Cú pháp**: `const params = useParams()`
**Import**: `import { useParams } from 'next/navigation'`

```tsx
'use client'
import { useParams } from 'next/navigation'

// Sử dụng trong dynamic route như [id]/page.tsx hoặc [slug]/page.tsx
const ParamsExample = () => {
  const params = useParams()
  
  // Lấy các dynamic parameters
  const id = params.id as string
  const slug = params.slug as string
  const category = params.category as string
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dynamic Route Parameters</h2>
      
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">Current Parameters:</h3>
        <ul className="space-y-1">
          {id && <li><strong>ID:</strong> {id}</li>}
          {slug && <li><strong>Slug:</strong> {slug}</li>}
          {category && <li><strong>Category:</strong> {category}</li>}
        </ul>
        
        {!id && !slug && !category && (
          <p className="text-gray-600">No dynamic parameters found</p>
        )}
      </div>
      
      {/* Ví dụ sử dụng parameters */}
      {id && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <h3 className="font-semibold">Using ID Parameter:</h3>
          <p>Fetching data for item with ID: {id}</p>
        </div>
      )}
      
      {slug && (
        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <h3 className="font-semibold">Using Slug Parameter:</h3>
          <p>Displaying content for slug: {slug}</p>
        </div>
      )}
    </div>
  )
} 
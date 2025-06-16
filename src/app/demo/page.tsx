import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">
          🔄 Server Actions vs API Endpoints Demo
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          So sánh 2 cách tiếp cận để xử lý form submission trong Next.js
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Server Actions Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Server Actions</h2>
                <p className="text-sm text-green-600">Cách mới - Đơn giản</p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Không cần API endpoint riêng
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Tự động handle loading/error states
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Code gọn gàng, ít boilerplate
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Type safety built-in
              </li>
            </ul>
            
            <Link 
              href="/demo/server-actions"
              className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Xem Demo Server Actions
            </Link>
          </div>

          {/* API Endpoints Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <span className="text-2xl">🛣️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">API Endpoints</h2>
                <p className="text-sm text-blue-600">Cách truyền thống - Phức tạp</p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-4 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                Cần tạo API route riêng
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                Phải tự handle loading/error
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                Nhiều boilerplate code
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">ℹ️</span>
                Linh hoạt cho complex cases
              </li>
            </ul>
            
            <Link 
              href="/demo/api-endpoints"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Xem Demo API Endpoints
            </Link>
          </div>
        </div>

        {/* Code comparison */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-center">📊 So sánh Code</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Server Actions (28 lines)</h4>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <pre>{`'use server'

export async function createUser(formData) {
  // Validation + Business logic
  revalidatePath('/users')
  redirect('/users')
}

<form action={createUser}>
  <input name="name" />
  <button type="submit">Submit</button>
</form>`}</pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">API Endpoints (80+ lines)</h4>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <pre>{`// File 1: API Route
export async function POST(request) {
  // Manual handling...
}

// File 2: Component  
const [loading, setLoading] = useState(false)
const handleSubmit = async (e) => {
  // Manual fetch, error handling...
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
} 
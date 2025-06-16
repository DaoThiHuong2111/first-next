import Link from 'next/link'

interface PageProps {
  searchParams: {
    name?: string
  }
}

export default function ServerActionSuccessPage({ searchParams }: PageProps) {
  const userName = searchParams.name || 'Người dùng'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success icon */}
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>

          {/* Success message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Thành công!
          </h1>
          
          <p className="text-gray-600 mb-6">
            User <strong className="text-green-600">{userName}</strong> đã được tạo thành công bằng Server Actions.
          </p>

          {/* Benefits recap */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-800 mb-2 text-center">
              🚀 Những gì đã xảy ra:
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Form được submit tự động</li>
              <li>• Server Action chạy trên server</li>
              <li>• Validation được thực hiện server-side</li>
              <li>• User được "tạo" (simulated)</li>
              <li>• Redirect xảy ra từ server</li>
              <li>• Không cần client-side JavaScript!</li>
            </ul>
          </div>

          {/* Navigation buttons */}
          <div className="space-y-3">
            <Link 
              href="/demo/server-actions"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              ← Thử lại Server Actions
            </Link>
            
            <Link 
              href="/demo/api-endpoints"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              So sánh với API Endpoints →
            </Link>
            
            <Link 
              href="/demo"
              className="block w-full text-gray-600 hover:text-gray-800 underline"
            >
              Quay lại Demo chính
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
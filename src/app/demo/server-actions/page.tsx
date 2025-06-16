import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

// 🔥 SERVER ACTION - Đặc biệt chú ý: directive 'use server'
async function createUserWithServerAction(formData: FormData) {
  'use server'
  
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  
  // Validation
  if (!name || !email) {
    throw new Error('Tên và email là bắt buộc')
  }
  
  try {
    // Simulate database operation
    const user = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('✅ User created via Server Action:', user)
    
    // Redirect to success page
    redirect('/demo/server-actions/success?name=' + encodeURIComponent(name))
    
  } catch (error) {
    throw new Error('Không thể tạo user')
  }
}

export default function ServerActionsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚀 Server Actions Demo
          </h1>
          <p className="text-gray-600">
            Cách mới để handle form submissions trong Next.js
          </p>
        </div>

        {/* Main form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Tạo User với Server Actions
          </h2>
          
          <form action={createUserWithServerAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Nhập tên của bạn"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Tạo User (Server Action)
            </button>
          </form>
        </div>

        {/* Advantages box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">
            ✅ Đặc điểm của Server Actions:
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Form tự động disable khi đang submit</li>
            <li>• Không cần useState để manage loading state</li>
            <li>• Không cần fetch() API calls</li>
            <li>• Error handling tự động</li>
            <li>• Server-side redirect sau khi thành công</li>
            <li>• Type safety từ server tới client</li>
          </ul>
        </div>

        {/* Code example */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">📝 Code ví dụ:</h3>
          <pre className="text-sm text-gray-600 overflow-x-auto">
{`async function createUser(formData: FormData) {
  'use server' // 🔥 Chỉ cần dòng này!
  
  const name = formData.get('name')
  // Validation + Business logic
  redirect('/success') // Tự động redirect
}

<form action={createUser}>
  <input name="name" />
  <button type="submit">Submit</button>
</form>`}
          </pre>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link 
            href="/demo"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← Quay lại Demo
          </Link>
          <Link 
            href="/demo/api-endpoints"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            So sánh với API Endpoints →
          </Link>
        </div>
      </div>
    </div>
  )
} 
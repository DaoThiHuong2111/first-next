'use server' // 🔥 QUAN TRỌNG: Directive này đánh dấu toàn bộ file là Server Actions

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * 🎯 SERVER ACTION - Hàm chạy trên server, không cần API endpoint riêng
 * 
 * Cách hoạt động:
 * 1. Next.js tự động tạo một endpoint ẩn cho function này
 * 2. Khi form submit, Next.js sẽ:
 *    - Serialize formData từ form
 *    - Gửi POST request lên server endpoint được tạo tự động
 *    - Chạy function này trên server
 *    - Trả kết quả về client (redirect, error, etc.)
 * 
 * @param formData - FormData object được Next.js tự động truyền vào khi form submit
 */
export async function createUser(formData: FormData) {
  // 📝 Lấy dữ liệu từ FormData (tương tự như req.body trong API route)
  // FormData.get() trả về string | File | null
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  
  // ✅ Server-side validation - validation này chạy an toàn trên server
  // Client không thể bypass validation này
  if (!name || !email) {
    // Khi throw Error, Next.js tự động hiển thị error boundary
    throw new Error('Tên và email là bắt buộc')
  }
  
  try {
    // 💾 Business Logic - Tạo user object (thực tế sẽ save vào database)
    const user = {
      id: Date.now(), // Thực tế dùng UUID hoặc auto-increment
      name,
      email,
      createdAt: new Date().toISOString()
    }
    
    // ⏳ Simulate database operation (Prisma, Drizzle, raw SQL...)
    // await db.user.create({ data: user })
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('User created:', user)
    
    // 🔄 CACHE REVALIDATION: Báo cho Next.js xóa cache của path '/users'
    // Điều này đảm bảo lần truy cập tiếp theo sẽ fetch dữ liệu mới từ server
    revalidatePath('/users')
    
    // 🚀 SERVER-SIDE REDIRECT: Chuyển hướng user đến trang /users
    // Điều này xảy ra hoàn toàn trên server, không cần client-side JavaScript
    redirect('/users')
    
  } catch (error) {
    // 💥 Error handling: Next.js sẽ tự động catch và hiển thị trong error boundary
    throw new Error('Không thể tạo user: ' + (error as Error).message)
  }
}

/**
 * 🖼️ COMPONENT SỬ DỤNG SERVER ACTION
 * 
 * Đặc điểm:
 * - Không cần 'use client' directive
 * - Không cần useState cho loading/error states
 * - Không cần fetch() calls
 * - Form tự động handle submission
 */
export default function CreateUserWithServerAction() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Tạo User - Server Actions
      </h2>
      
      {/* 
        🎯 FORM VỚI SERVER ACTION
        - action={createUser}: Đây là điểm khác biệt chính!
        - Khi submit, Next.js tự động:
          1. Thu thập tất cả form data
          2. Gọi createUser function trên server
          3. Handle loading state (form bị disable tự động)
          4. Handle redirect sau khi thành công
          5. Handle error nếu có
      */}
      <form action={createUser} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên
          </label>
          {/* 
            📝 INPUT FIELD
            - name="name": Key này sẽ được dùng trong formData.get('name')
            - required: HTML validation (server vẫn validate lại)
          */}
          <input
            type="text"
            id="name"
            name="name" // 🔑 Key này match với formData.get('name')
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email" // 🔑 Key này match với formData.get('email')
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* 
          🚀 SUBMIT BUTTON
          - type="submit": Trigger form submission
          - Không cần onClick handler!
          - Next.js tự động disable button khi đang submit
          - Tự động show loading state
        */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Tạo User
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-green-50 rounded-md">
        <h3 className="text-sm font-medium text-green-800">✅ Ưu điểm Server Actions:</h3>
        <ul className="text-sm text-green-700 mt-1 space-y-1">
          <li>• Không cần tạo API endpoint riêng</li>
          <li>• Code gọn gàng, ít boilerplate</li>
          <li>• Type safety tự động</li>
          <li>• Form tự động handle loading state</li>
        </ul>
      </div>
    </div>
  )
} 
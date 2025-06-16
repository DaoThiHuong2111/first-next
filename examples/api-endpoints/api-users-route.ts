// examples/api-endpoints/api-users-route.ts
/**
 * 🛣️ API ROUTE HANDLER - Cần thiết khi KHÔNG sử dụng Server Actions
 * 
 * Đường dẫn: app/api/users/route.ts
 * 
 * Đặc điểm:
 * - Phải tạo file riêng trong thư mục app/api/
 * - Phải export các HTTP methods (GET, POST, PUT, DELETE)
 * - Phải handle request/response thủ công
 * - Phải validate và parse request body
 * - Phải set status codes và headers thủ công
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * 📝 POST METHOD - Tạo user mới
 * 
 * @param request - NextRequest object chứa request data
 * @returns NextResponse - JSON response
 */
export async function POST(request: NextRequest) {
  try {
    // 📦 MANUAL REQUEST PARSING - Phải tự parse request body
    const body = await request.json()
    const { name, email } = body

    // ✅ MANUAL VALIDATION - Phải tự validate input
    if (!name || !email) {
      // 💥 MANUAL ERROR RESPONSE - Phải tự tạo error response với status code
      return NextResponse.json(
        { message: 'Tên và email là bắt buộc' },
        { status: 400 } // HTTP 400 Bad Request
      )
    }

    // 💾 BUSINESS LOGIC - Tạo user object
    const user = {
      id: Date.now(), // Thực tế dùng UUID hoặc auto-increment
      name,
      email,
      createdAt: new Date().toISOString()
    }

    // ⏳ Simulate database operation (Prisma, Drizzle, raw SQL...)
    // Trong thực tế: await db.user.create({ data: user })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('User created via API:', user)

    // ✅ MANUAL SUCCESS RESPONSE - Phải tự tạo success response
    return NextResponse.json(user, { status: 201 }) // HTTP 201 Created
    
  } catch (error) {
    // 💥 MANUAL ERROR HANDLING - Phải tự handle và log errors
    console.error('Error creating user:', error)
    return NextResponse.json(
      { message: 'Không thể tạo user' },
      { status: 500 } // HTTP 500 Internal Server Error
    )
  }
}

/**
 * 📋 GET METHOD - Lấy danh sách users
 * 
 * @returns NextResponse - JSON array of users
 */
export async function GET() {
  try {
    // 💾 Simulate database query
    // Trong thực tế: const users = await db.user.findMany()
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
    
    // ✅ SUCCESS RESPONSE
    return NextResponse.json(users) // Default status 200
    
  } catch (error) {
    // 💥 ERROR RESPONSE
    return NextResponse.json(
      { message: 'Không thể lấy danh sách users' },
      { status: 500 }
    )
  }
}

/**
 * 🔧 Các method khác cần implement:
 * 
 * export async function PUT(request: NextRequest) { ... }  // Update user
 * export async function DELETE(request: NextRequest) { ... }  // Delete user
 * export async function PATCH(request: NextRequest) { ... }  // Partial update
 * 
 * 📚 Mỗi method cần:
 * - Parse request data
 * - Validate input
 * - Handle business logic
 * - Return appropriate response with status codes
 * - Handle errors properly
 */ 
# Food Delivery Microservices

Dự án đã được chia thành 4 microservices chính và 1 API Gateway:

## Kiến trúc

```
API Gateway (Port 4000)
├── User Service (Port 4001)
├── Device Service (Port 4002) 
├── Cart Service (Port 4003)
└── Order Service (Port 4004)
```

## Services

### 1. User Service (Port 4001)
- Quản lý đăng ký, đăng nhập người dùng
- JWT authentication
- Endpoints: `/api/user/register`, `/api/user/login`

### 2. Device Service (Port 4002)
- Quản lý sản phẩm/thiết bị
- CRUD operations cho devices
- Endpoints: `/api/device/list`, `/api/device/add`, `/api/device/remove`

### 3. Cart Service (Port 4003)
- Quản lý giỏ hàng của người dùng
- Thêm/xóa sản phẩm khỏi giỏ hàng
- Endpoints: `/api/cart/add`, `/api/cart/remove`, `/api/cart/get`

### 4. Order Service (Port 4004)
- Quản lý đơn hàng
- Tích hợp Stripe payment
- Endpoints: `/api/order/place`, `/api/order/list`, `/api/order/userorders`

### 5. API Gateway (Port 4000)
- Điều hướng requests đến các services tương ứng
- Load balancing và routing
- Endpoint chính cho frontend

## Cách chạy

### Chạy từng service riêng lẻ:
```bash
# Terminal 1 - User Service
cd user-service
npm install
npm run dev

# Terminal 2 - Device Service  
cd device-service
npm install
npm run dev

# Terminal 3 - Cart Service
cd cart-service
npm install
npm run dev

# Terminal 4 - Order Service
cd order-service
npm install
npm run dev

# Terminal 5 - API Gateway
cd api-gateway
npm install
npm run dev
```

### Chạy tất cả với script (Windows):
```bash
start-all.bat
```

### Chạy với Docker:
```bash
docker-compose up --build
```

## Environment Variables

Tạo file `.env` trong mỗi service với các biến:

```env
MONGODB_URI=mongodb://localhost:27017/food-delivery
JWT_SECRET=random#secret
STRIPE_SECRET_KEY=your_stripe_key
PORT=service_port
```

## Database

Mỗi service kết nối đến cùng một MongoDB database nhưng có thể tách riêng nếu cần:
- User Service: users collection
- Device Service: devices collection  
- Cart Service: users collection (cartData field)
- Order Service: orders collection

## Health Checks

Mỗi service có endpoint `/health` để kiểm tra trạng thái:
- User Service: http://localhost:4001/health
- Device Service: http://localhost:4002/health
- Cart Service: http://localhost:4003/health
- Order Service: http://localhost:4004/health
- API Gateway: http://localhost:4000/health

## Frontend Integration

Frontend chỉ cần trỏ đến API Gateway (port 4000) thay vì backend cũ (port 4000).
Không cần thay đổi gì trong frontend code.
# Restaurant Reservations Project

## Tổng quan
Đây là hệ thống quản lý nhà hàng theo mô hình fullstack gồm:
- `FE`: ứng dụng React + TypeScript cho khách hàng và quản trị.
- `BE`: hệ thống Node.js/Express theo kiến trúc API Gateway + microservices.

Mục tiêu chính của dự án là hỗ trợ quy trình đặt bàn, quản lý thực đơn, người dùng, đánh giá và thanh toán MoMo trong cùng một nền tảng.

## Kiến trúc hệ thống
### Backend (`BE`)
- API Gateway chạy cổng `5000`, định tuyến request đến các service.
- Các service nghiệp vụ:
  - `auth` (`5001`): đăng ký/đăng nhập, JWT, quản lý người dùng và vai trò.
  - `restaurant` (`5002`): quản lý nhà hàng và bàn.
  - `menu` (`5003`): quản lý loại món và món ăn.
  - `order` (`5004`): đặt bàn, thanh toán, Socket.IO thông báo realtime.
  - `review` (`5005`): đánh giá và phản hồi đánh giá.
- Tích hợp upload ảnh qua GridFS (`/api/upload`, `/api/images/:filename`).
- API tổng hợp cho dashboard admin tại Gateway (thống kê người dùng, doanh thu, đơn gần đây, món phổ biến).

### Frontend (`FE`)
- React Router tách luồng:
  - Trang khách: trang chủ, thực đơn, đặt bàn, giỏ hàng, đăng nhập/đăng ký, chi tiết đặt bàn.
  - Trang admin: dashboard, quản lý người dùng, quản lý đặt bàn, quản lý thực đơn.
- Sử dụng `AuthContext`, `CartContext`, `SocketContext` để quản lý trạng thái toàn cục.
- Kết nối realtime với Order Service bằng Socket.IO để nhận thông báo đặt bàn mới/cập nhật trạng thái.
- Tích hợp thanh toán MoMo (tạo giao dịch, callback, kiểm tra trạng thái, hoàn tiền).

## Chức năng chính
### 1) Xác thực và phân quyền
- Đăng ký, đăng nhập, refresh token, đăng xuất.
- Lấy thông tin người dùng hiện tại.
- Phân quyền theo vai trò (`admin`, `staff`, user) cho các chức năng quản trị.

### 2) Quản lý nhà hàng và bàn
- CRUD nhà hàng (admin).
- CRUD bàn (admin/staff), kiểm tra tình trạng bàn và khả dụng.
- Hỗ trợ tìm danh sách bàn trống theo thời gian đặt.

### 3) Quản lý thực đơn
- Quản lý loại món ăn (CRUD).
- Quản lý món ăn (CRUD), món nổi bật/phổ biến.
- Hỗ trợ hiển thị thực đơn cho khách theo dạng public API.

### 4) Đặt bàn và theo dõi đơn
- Tạo đơn đặt bàn (public).
- Xem/cập nhật trạng thái đơn đặt bàn (có xác thực).
- Thống kê số lượng đặt bàn, doanh thu và danh sách đặt bàn gần đây.

### 5) Thanh toán MoMo
- Tạo thanh toán theo đơn đặt bàn.
- Nhận callback/IPN từ MoMo, kiểm tra trạng thái thanh toán.
- Hỗ trợ hoàn tiền MoMo qua API backend.
- Có xử lý fallback cho URL QR/redirect để giảm lỗi luồng thanh toán.

### 6) Đánh giá
- Người dùng tạo/sửa/xóa đánh giá.
- Admin xác thực, duyệt trạng thái và phản hồi đánh giá.

## Công nghệ sử dụng
- Backend: Node.js, Express, Mongoose/MongoDB, JWT, Socket.IO, Multer/GridFS, Axios.
- Frontend: React 18, TypeScript, Material UI, Redux Toolkit, Axios, React Router.
- Tích hợp ngoài: MoMo Payment API.

## Trạng thái hiện tại
- Nhiều module đã hoàn thiện end-to-end (auth, menu, đặt bàn, thanh toán, đánh giá).
- Một số màn hình admin vẫn ở trạng thái "đang phát triển" (placeholder UI), nhưng nền API đã có cho nhiều nghiệp vụ cốt lõi.

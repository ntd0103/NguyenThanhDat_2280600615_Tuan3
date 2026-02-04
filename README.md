# Product Dashboard

Dashboard quản lý sản phẩm sử dụng API từ [Platzi Fake Store API](https://fakeapi.platzi.com/en/rest/products/)

## Tính năng

### 1. Hiển thị dữ liệu
- Bảng hiển thị các cột: ID, Title, Price, Category, Images
- Sử dụng Bootstrap 5 cho giao diện responsive
- Description hiển thị khi hover chuột vào dòng (tooltip)
- Hiển thị hình ảnh sản phẩm dưới dạng thumbnail

### 2. Tìm kiếm
- Tìm kiếm theo tên sản phẩm (title)
- Cập nhật kết quả realtime khi nhập (onChange)
- Tự động quay về trang 1 khi tìm kiếm

### 3. Phân trang
- Có thể chọn hiển thị 5, 10, hoặc 20 sản phẩm mỗi trang
- Hiển thị số trang với nút Previous/Next
- Hiển thị thông tin "Hiển thị X - Y của Z sản phẩm"
- Pagination thông minh với dấu "..." khi có nhiều trang

### 4. Sắp xếp
- Sắp xếp theo Title (A-Z hoặc Z-A)
- Sắp xếp theo Price (tăng dần hoặc giảm dần)
- Icon hiển thị trạng thái sắp xếp hiện tại
- Click lại để đảo chiều sắp xếp

### 5. Export CSV
- Export dữ liệu ở trang hiện tại ra file CSV
- File CSV bao gồm: ID, Title, Price, Category, Description, Images
- Tên file tự động với timestamp

### 6. Xem và Chỉnh sửa sản phẩm
- Click nút "View" để xem chi tiết sản phẩm
- Modal hiển thị đầy đủ thông tin
- Preview hình ảnh sản phẩm
- Chỉnh sửa thông tin: Title, Price, Description, Category ID, Images
- Sử dụng API PUT để cập nhật sản phẩm

### 7. Tạo sản phẩm mới
- Nút "Tạo mới" mở modal tạo sản phẩm
- Form nhập đầy đủ thông tin: Title, Price, Description, Category ID, Images
- Sử dụng API POST để tạo sản phẩm mới
- Sản phẩm mới xuất hiện đầu tiên trong danh sách

## API Endpoints sử dụng

- **GET** `https://api.escuelajs.co/api/v1/products` - Lấy danh sách sản phẩm
- **GET** `https://api.escuelajs.co/api/v1/products/{id}` - Lấy chi tiết sản phẩm
- **POST** `https://api.escuelajs.co/api/v1/products` - Tạo sản phẩm mới
- **PUT** `https://api.escuelajs.co/api/v1/products/{id}` - Cập nhật sản phẩm

## Cấu trúc project

```
tuan 3/
├── index.html    # File HTML chính với Bootstrap
├── app.js        # File JavaScript xử lý logic
└── README.md     # Tài liệu hướng dẫn
```

## Cách sử dụng

1. Clone hoặc download project về máy
2. Mở file `index.html` bằng trình duyệt web
3. Dashboard sẽ tự động load dữ liệu từ API

### Tìm kiếm sản phẩm
- Nhập tên sản phẩm vào ô "Tìm kiếm theo tên sản phẩm..."
- Kết quả tự động cập nhật

### Thay đổi số sản phẩm hiển thị
- Chọn số lượng từ dropdown (5, 10, hoặc 20 sản phẩm/trang)

### Sắp xếp
- Click vào "Title" hoặc "Price" ở header bảng
- Click lần nữa để đảo chiều sắp xếp

### Xem chi tiết và chỉnh sửa
1. Click nút "View" ở sản phẩm muốn xem
2. Modal hiển thị chi tiết sản phẩm
3. Chỉnh sửa thông tin nếu muốn
4. Click "Lưu thay đổi" để cập nhật

### Tạo sản phẩm mới
1. Click nút "Tạo mới"
2. Điền đầy đủ thông tin vào form:
   - Title: Tên sản phẩm
   - Price: Giá (số)
   - Description: Mô tả
   - Category ID: ID danh mục (1-5)
   - Images: Các URL hình ảnh, cách nhau bởi dấu phẩy
3. Click "Tạo sản phẩm"

### Export CSV
- Click nút "Export CSV"
- File CSV chứa dữ liệu trang hiện tại sẽ được tải về

## Công nghệ sử dụng

- **HTML5** - Cấu trúc trang
- **CSS3** - Styling
- **Bootstrap 5.3** - UI Framework
- **Bootstrap Icons** - Icons
- **JavaScript (ES6+)** - Logic xử lý
- **Fetch API** - Gọi API
- **Platzi Fake Store API** - Nguồn dữ liệu

## Tính năng nâng cao

- ✅ Responsive design - Hoạt động tốt trên mọi thiết bị
- ✅ Loading spinner khi tải dữ liệu
- ✅ Error handling - Xử lý lỗi khi API không hoạt động
- ✅ Image fallback - Hiển thị placeholder khi ảnh lỗi
- ✅ Form validation - Kiểm tra dữ liệu trước khi submit
- ✅ Tooltip mô tả - Hiển thị description khi hover
- ✅ CSV export với UTF-8 BOM - Tương thích Excel tiếng Việt

## Browser support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Author

Developed for assignment Tuần 3

## License

Free to use for educational purposes

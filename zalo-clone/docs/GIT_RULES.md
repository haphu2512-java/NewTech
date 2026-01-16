# 📘 GIT RULES – QUY ĐỊNH LÀM VIỆC VỚI GIT

## 1. Mục đích
Tài liệu này quy định cách sử dụng Git trong dự án nhằm:
- Tránh conflict không cần thiết  
- Dễ review code  
- Dễ truy vết lịch sử thay đổi  
- Làm việc nhóm hiệu quả và nhất quán  

---

## 2. Cấu trúc Branch

### 🔹 Branch chính
- `main`  
  - Chỉ chứa code ổn định, có thể deploy  
  - ❌ Không commit trực tiếp  

- `develop`  
  - Branch tích hợp  
  - Nhận merge từ các branch thành viên  

### 🔹 Branch theo thành viên
Mỗi thành viên làm việc trên **branch riêng**, đặt theo tên:

Ví dụ:
- XuanPhu  
- MinhAnh  
- QuocBao  

📌 Quy tắc:
- Chỉ commit code của chính mình  
- Không làm việc trực tiếp trên `develop` hoặc `main`  

---

## 3. Workflow chuẩn

### Bước 1: Cập nhật code mới nhất
```bash
git checkout develop
git pull origin develop
```

### Bước 2: Chuyển sang branch cá nhân và sync
```bash
git checkout XuanPhu (tên branch)
git merge develop
```

### Bước 3: Code & commit
- Commit nhỏ, rõ ràng  
- Không commit code lỗi hoặc debug  

### Bước 4: Push lên branch cá nhân
```bash
git push origin XuanPhu(tên branch)
```

### Bước 5: Tạo Pull Request
- PR từ branch cá nhân → `develop`
- Mô tả rõ nội dung thay đổi

---

## 4. Quy tắc Commit Message

### Định dạng
```text
<type>: <short description>
```

### Các type được dùng
- feat: Thêm tính năng mới  
- fix: Sửa lỗi  
- refactor: Refactor code  
- style: Format, UI  
- docs: Cập nhật tài liệu  
- chore: Config, build, CI  

### Ví dụ
```text
feat: add login screen
fix: crash when open profile
```

---

## 5. Quy tắc Merge

- ❌ Không merge trực tiếp vào `main`
- ✅ `main` chỉ merge từ `develop`
- ✅ Code phải chạy ổn định trước khi merge

---

## 6. Conflict

- Tự resolve conflict trên branch cá nhân  
- Test lại trước khi push  
- Không đẩy conflict lên `develop`  

---

## 7. Quy tắc File

🚫 Không commit:
- node_modules  
- .env  
- dist / build  

---

## 8. Hotfix

```bash
git checkout -b hotfix/issue-name main
```
- Fix xong merge vào `main`
- Merge lại vào `develop`  

---

## 9. Trách nhiệm

- Tự chịu trách nhiệm code của mình  
- Chủ động pull code mỗi ngày  
- Không push code khi chưa test  

---

> Git là công cụ – kỷ luật mới là sức mạnh của team

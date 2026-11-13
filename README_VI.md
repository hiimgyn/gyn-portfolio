# Gyn Nguyen Portfolio (Tiếng Việt)

Portfolio cá nhân của Nguyễn Minh Hùng (Gyn Nguyen), Business Analyst có nền tảng kỹ thuật. Xây dựng bằng Vue 3, Vite, Tailwind CSS 4, three.js và GSAP, cùng phong cách tối với các sản phẩm khác trong hệ sinh thái hiimgyn (GPM Hub, trang hub).

---

## 🚀 Tính năng nổi bật

- **Trang chủ**: hero trên nền cảnh hạt three.js toàn màn hình, cuộn trang thì biến hình từ quy trình BPMN (sự kiện bắt đầu, task, gateway, sự kiện kết thúc) sang sơ đồ hệ thống nhiều tầng rồi thành quả cầu. Có xử lý reduced-motion và máy không có WebGL.
- **Cách tôi làm việc**: mô hình hoá quy trình BPMN, phân rã hệ thống, đặc tả yêu cầu, mô hình dữ liệu, bàn giao/UAT.
- **Dự án**: ReLightHost, Animal Survivor, GFGames, GPM Hub (ảnh chụp thật), viet-hoa-game (bộ rule việt hoá game cho AI, repo riêng tư) và gói extension VBook.
- **Giới thiệu**: hồ sơ, mẫu user story kèm tiêu chí Gherkin, bộ công cụ, kinh nghiệm và các case study trước đây.
- **Tetris Lab**: chế độ Zen, Training (luyện T-spin) và Boss, xoay SRS.
- Trang **Liên hệ**, song ngữ Anh / Việt.

---

## 🛠️ Công nghệ sử dụng

- **Vue 3 (Composition API)** + **Vite 6** + **vue-router**
- **Tailwind CSS 4**, tiêu đề SVN-Gilroy, chữ thân Geist
- **three.js** cho cảnh nền (một draw call Points, biến hình trong vertex shader)
- **vue-i18n** song ngữ
- **GSAP** cho hiệu ứng vào trang của hero
- **@heroicons/vue** cho biểu tượng

---

## 📦 Hướng dẫn cài đặt

```bash
# 1. Clone mã nguồn
git clone https://github.com/hiimgyn/gyn-portfolio.git
cd gyn-portfolio

# 2. Cài đặt thư viện
npm install

# 3. Chạy môi trường phát triển
npm run dev

# 4. Đóng gói cho production
npm run build
```

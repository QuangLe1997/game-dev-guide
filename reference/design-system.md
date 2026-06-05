# 🎨 Design System — chuẩn UI cho mọi game

> Đồng bộ "ngôn ngữ thị giác" của QUANG ARCADE: arcade-neon, glassmorphism, gradient-mesh. Copy-paste vào `index.html`.

## Tech constraints (bắt buộc)
- 1 file `index.html`. Asset trong `assets/`.
- Không framework (no React/Vue), không bundler, không npm. JS thuần (ES modules inline).
- External resource = **Google Fonts** (+ Three.js CDN nếu 3D). Mọi thứ khác inline.

## Fonts — luôn dùng cặp này
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
```
- **Orbitron** = display / tiêu đề / số / nút (arcade, hi-tech).
- **Space Grotesk** = body / mô tả / text thường.

## Color tokens + nền gradient-mesh (copy vào `:root`)
```css
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#06060d; --ink:#eef0ff; --mut:#9aa0c0; --line:rgba(255,255,255,.10);
  --disp:'Orbitron',system-ui,sans-serif;
  --body:'Space Grotesk',system-ui,-apple-system,sans-serif;
  --accent:#56d4ff;            /* ĐỔI MÀU NÀY cho mỗi game — xem reference/inventory.md */
}
body{ background:var(--bg); color:var(--ink); font-family:var(--body);
  min-height:100vh; overflow-x:hidden; line-height:1.45; -webkit-font-smoothing:antialiased; }

/* nền mesh trôi nhẹ phía sau mọi thứ */
body::before{
  content:""; position:fixed; inset:-30%; z-index:-2; pointer-events:none;
  background:
    radial-gradient(40% 40% at 18% 22%, rgba(231,181,74,.16), transparent 60%),
    radial-gradient(38% 38% at 82% 18%, rgba(127,224,224,.16), transparent 60%),
    radial-gradient(45% 45% at 76% 84%, rgba(255,90,138,.15), transparent 60%),
    radial-gradient(42% 42% at 22% 82%, rgba(167,139,250,.15), transparent 60%);
  filter:blur(20px); animation:mesh 26s ease-in-out infinite alternate;
}
@keyframes mesh{ from{transform:translate3d(-3%,-2%,0) scale(1)} to{transform:translate3d(3%,3%,0) scale(1.08)} }
@media (prefers-reduced-motion:reduce){ *{animation:none!important;} }
```

## Glassmorphism panel
```css
.panel, .card, .chip {
  border:1px solid var(--line);
  background:linear-gradient(180deg,rgba(22,24,38,.72),rgba(12,13,22,.82));
  backdrop-filter:blur(8px);
  border-radius:16px;
}
/* glow theo accent (hover / khung vùng chơi) */
.glow{
  box-shadow:0 24px 60px -18px color-mix(in srgb,var(--accent) 55%,transparent),
             0 0 0 1px color-mix(in srgb,var(--accent) 30%,transparent) inset;
}
```

## Typography hierarchy
- **Tiêu đề lớn**: Orbitron 900, uppercase, `letter-spacing:.04em`, gradient clip text:
```css
background:linear-gradient(95deg,#ffd24a,#7fe0e0,#a78bfa,#ff5a8a);
-webkit-background-clip:text; background-clip:text; color:transparent;
```
- **Nhãn / kicker / chip / nút**: Orbitron 600–800, uppercase, `letter-spacing:.12em–.42em`, nhỏ (10–13px).
- **Body**: Space Grotesk 400–500.
- `clamp()` cho mọi font lớn: `font-size:clamp(34px,9vw,104px)`.

## Responsive (mobile + desktop)
- **Vùng chơi = hero**: to nhất, trên cùng (mobile) hoặc bên trái (desktop). Cap `max-width:min(100%,70vh)`.
- **Desktop**: cân nhắc 2 cột (vùng chơi | panel điều khiển) bằng CSS grid.
- **Mobile**: stack 1 cột, control dưới vùng chơi (vừa tầm ngón cái).
- Breakpoint hay dùng: `@media (max-width:860px)` (đổi 1 cột), `@media (max-width:560px)`.
- **Viewport game** (khoá zoom, cảm giác app):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
```
  (Hub arcade thì để scalable — bỏ `maximum-scale/user-scalable`.)
- HUD né tai thỏ: `padding: env(safe-area-inset-top) env(safe-area-inset-right) ...`.

## HUD chip (thống nhất header)
Mọi phần header (điểm / ví / nút) dùng cùng surface: glass gradient + `backdrop-filter:blur(14px)` + viền + vạch sáng đỉnh. Giữ ngôn ngữ này khi thêm chip mới.

## Quy ước "không chói"
- Bloom strength thấp (~0.5) + threshold cao (~0.82); emissive thấp. Chỉ điểm sáng mới glow.
- Bảng màu cao cấp, dịu mắt; chữ luôn rõ trên nền.

# ⚡ Performance budget + robustness

> Game phải **mượt trên máy yếu** và **không vỡ trắng màn** khi CDN lỗi. Đặt ngân sách rõ + có fallback.

## Ngân sách FPS (target)
| Thiết bị | Target | Tối thiểu chấp nhận |
|---|---|---|
| Desktop | 60 fps | 50 |
| Mobile cao cấp | 60 fps | 45 |
| Mobile yếu / cũ | 30+ fps | 30 |

- Đo bằng DevTools Performance hoặc đếm frame trong loop. Test cả máy yếu (throttle CPU 4–6× trong DevTools).
- Nếu tụt dưới min → **tự hạ chất lượng** (xem dưới), không để giật.

## Tự hạ chất lượng (graceful degradation)
```javascript
const MOBILE = matchMedia('(pointer:coarse)').matches || innerWidth < 540;
let lowFX = MOBILE;
// đo fps trượt, nếu thấp kéo dài → bật lowFX
let frames=0, t0=performance.now();
function fpsWatch(now){ frames++; if(now-t0>=1000){ if(frames<45) lowFX=true; frames=0; t0=now; } }
// dùng lowFX để: giảm số particle, tắt bloom/đổ bóng nặng, giảm DPR cap, tắt nền cosmos.
```
- **DPR cap:** `Math.min(devicePixelRatio||1, MOBILE?2:3)` — đừng render 3–4× pixel trên mobile.
- **Particle pool** (tái dùng object, không `new` mỗi frame) → tránh GC giật.
- **3D:** bloom yếu, tắt shadow trên mobile, giảm segment hình học, ẩn background phụ khi `lowFX`.
- **Canvas 2D:** vẽ sprite tĩnh vào offscreen canvas cache; tránh `shadowBlur` dày đặc mỗi frame.
- Tôn trọng `prefers-reduced-motion` (đã có trong tokens).

## 🔴 CDN-fail guard (Three.js / Matter.js)
Game nạp lib qua CDN → CDN lỗi/chặn = **màn hình đen, không báo gì**. Phải có guard:
```html
<script type="module">
  try {
    const THREE = await import('three');     // hoặc import bình thường ở top + try/catch quanh init
    bootGame(THREE);
  } catch (err) {
    document.body.innerHTML =
      '<div style="display:grid;place-items:center;height:100dvh;font-family:system-ui;color:#eef0ff;text-align:center;padding:24px">'
      + '<div><h2>Couldn’t load the game engine</h2><p style="opacity:.7">Check your connection and reload.</p>'
      + '<button onclick="location.reload()" style="margin-top:14px;padding:12px 20px">Reload</button></div></div>';
    console.error(err);
  }
</script>
```
- Tối thiểu: bắt lỗi load → hiện thông điệp + nút Reload, **không để trắng màn câm lặng**.
- (tuỳ chọn) fallback CDN thứ 2 (unpkg) nếu jsDelivr fail.

## Global error catch (đỡ "đơ ngầm")
```javascript
addEventListener('error', e => console.error('runtime', e.error||e.message));
addEventListener('unhandledrejection', e => console.error('promise', e.reason));
```
Trong lúc dev giúp thấy lỗi; production có thể show toast nhẹ thay vì để game đứng im.

## Memory / vòng đời
- Hủy listener / `cancelAnimationFrame` khi rời scene để không chạy nhiều loop chồng.
- Three.js: `dispose()` geometry/material/texture khi không dùng (đổi level/biome) để tránh rò GPU memory.

> Ghi target FPS đã đạt + thiết bị test vào `tests/TEST-REPORT.md` (mục Performance) nếu game nặng đồ hoạ.

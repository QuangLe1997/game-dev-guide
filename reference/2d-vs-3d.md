# 🧊 2D vs 3D — chọn công nghệ render theo thể loại

> Cả hai đều **zero-build, single `index.html`**. Quyết định dựa trên: gameplay có tận dụng chiều sâu không, và ngân sách FPS trên mobile.

## Quyết định nhanh
| Nếu game… | Chọn | Lý do |
|---|---|---|
| Có không gian/chiều sâu/đổ bóng/camera động làm "wow" (snake, tank, match khối bóng) | **3D — Three.js** | Chiều sâu + bloom + particle 3D tạo cảm giác cao cấp |
| Là lưới/vật lý 2D, cần FPS cao & nhẹ (tetris, bubble, merge, sliding, block puzzle) | **2D — Canvas** | Nhẹ, mượt mọi máy, code gọn |
| Phân vân | nghiêng **3D nếu tận dụng được chiều sâu**, còn lại **2D** | — |

## 3D — Three.js (zero-build qua importmap CDN)
```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
}}
</script>
<script type="module">
  import * as THREE from 'three';
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
  import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
  // RoomEnvironment (PMREM) cho phản chiếu, RoundedBoxGeometry cho khối bo góc, Reflector cho sàn gương.
</script>
```
**Setup chuẩn:** renderer + scene + fog + PMREM env + camera + composer(bloom) + lights.
**Quy ước:** bloom **yếu** (strength ~0.5, threshold ~0.82), emissive thấp, chỉ điểm sáng mới glow (xem `design-system.md`).
**Mobile:** tắt bớt hiệu ứng nặng (cosmos/đổ bóng) để giữ FPS; tự hạ chất lượng nếu yếu.
**Tham khảo:** `neon-serpent-3d` (snake 3D + cosmos + evolution/biome), `tank-shooter` (twin-stick 3D), `triple-tile` (match-3 khối bóng).

## 2D — Canvas
```javascript
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
function resize(){
  const dpr = Math.min(devicePixelRatio||1, 2);   // cap 2 cho mobile khỏi nặng
  cv.width = innerWidth*dpr; cv.height = innerHeight*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
addEventListener('resize', resize); resize();
```
- Vẽ sprite vào **cached canvas** (offscreen) cho vật lặp lại (mảnh tetris, trái cây) → nhanh.
- Vật lý: tự viết (lưới/tick) hoặc **Matter.js** (CDN) cho physics thật (như suika-merge).
- **Tham khảo:** `brick-blitz` (tetris, Canvas thuần), `suika-merge` (Matter.js), `dino-egg-shooter` (bubble), `slide-puzzle`, `block-blast`.

## Cấu trúc file theo độ phức tạp
- **Đơn giản / 3D inline** (< ~2500 dòng): tất cả trong `index.html` (`neon-serpent-3d`, `block-blast`).
- **Phức tạp / nhiều hệ thống**: tách `src/` (managers/ scenes/ entities/ systems/ effects/) + `style.css`, vẫn zero-build qua ES modules (`suika-merge`, `brick-blitz`). `index.html` chỉ là skeleton + import.

## Chung cho cả hai
- Input kép: keyboard/mouse + touch. Audio WebAudio. localStorage. Responsive hero. UI tiếng Anh.

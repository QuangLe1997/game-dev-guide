# 🔁 Retention systems + PWA + cache-busting

> Module copy-paste để game "đầy đủ" như game thương mại: giữ chân người chơi (daily reward, achievements, leaderboard) + cài được như app (PWA) + **không kẹt bản cũ** (cache-busting). Tất cả zero-build, localStorage.

---

## 1. Daily reward (chuỗi 7 ngày)
Thưởng xu/quà khi mở game mỗi ngày; chuỗi đứt nếu nghỉ > 1 ngày; ngày 7 thưởng lớn.
```javascript
const DAY = 86400000;
function dayIndex(ts){ return Math.floor((ts - new Date(ts).getTimezoneOffset()*60000)/DAY); }
function claimDaily(now){
  const last = Save.get('daily.last', -999), streak = Save.get('daily.streak', 0);
  const today = dayIndex(now);
  if (today === last) return null;                 // đã nhận hôm nay
  const cont = (today === last + 1);               // liên tiếp?
  const day = cont ? Math.min(streak + 1, 7) : 1;
  Save.set('daily.last', today); Save.set('daily.streak', day);
  const reward = [0,50,75,100,150,200,300,1000][day]; // ngày 7 = jackpot
  return { day, reward };
}
```
> ⚠️ Dùng ngày *local* để công bằng múi giờ. Đừng tin đồng hồ tuyệt đối — chỉ so *index ngày*.

## 2. Achievements
Mốc đơn giản, mở khoá 1 lần, lưu localStorage; toast khi unlock.
```javascript
const ACH = [
  { id:'first',   name:'First Blood',  test:s=>s.score>0 },
  { id:'combo8',  name:'Combo Master', test:s=>s.combo>=8 },
  { id:'lvl10',   name:'Double Digits',test:s=>s.level>=10 },
  { id:'score1k', name:'Kilo Club',    test:s=>s.score>=1000 },
];
function checkAchievements(S){
  const got = new Set(Save.get('ach', []));
  for(const a of ACH){ if(!got.has(a.id) && a.test(S)){ got.add(a.id); toast(`🏆 ${a.name}`); } }
  Save.set('ach', [...got]);
}
```

## 3. Local leaderboard (top 10)
Không cần server — bảng điểm cục bộ tạo cảm giác "phá kỷ lục".
```javascript
function submitScore(name, score){
  const board = Save.get('board', []);
  board.push({ name: name||'YOU', score, at: Date.now() });
  board.sort((a,b)=>b.score-a.score);
  Save.set('board', board.slice(0,10));
}
```
> Online leaderboard = ngoài phạm vi zero-build (cần backend). Ghi vào backlog nếu cần.

## 4. PWA — cài được + chơi offline
Thêm 3 thứ vào game:
1. **`manifest.webmanifest`** — copy [`../templates/pwa/manifest.webmanifest`](../templates/pwa/manifest.webmanifest), điền tên + 2 icon (192/512 px) trong `assets/`.
2. **`sw.js`** — copy [`../templates/pwa/sw.js`](../templates/pwa/sw.js).
3. **Đăng ký** trong `index.html`:
```html
<link rel="manifest" href="manifest.webmanifest" />
<meta name="theme-color" content="#06060d" />
<script>if('serviceWorker' in navigator){ addEventListener('load',()=>navigator.serviceWorker.register('sw.js')); }</script>
```
→ Installable (Add to Home Screen), chơi offline sau lần load đầu.

## 5. 🔴 CACHE-BUSTING (bắt buộc nhớ)
Service worker cache → **deploy mới mà không bump version = người chơi kẹt bản cũ**. Đây là bug "đã sửa rồi mà không thấy đổi" kinh điển.
- Trong `sw.js`: **bump `CACHE_VERSION`** (`v1`→`v2`…) **mỗi lần deploy đổi `index.html`/JS/CSS**. `activate` tự xoá cache cũ; `skipWaiting`+`clients.claim` để bản mới chiếm quyền ngay.
- HTML/JS/CSS để **network-first** (luôn cố lấy mới), chỉ ảnh mới cache-first.
- Khi verify sau deploy: mở **tab ẩn danh** hoặc DevTools → Application → "Update on reload" để khỏi nhầm cache.
- Nếu game **không cần offline** → có thể bỏ hẳn SW cho đỡ rắc rối cache. Chỉ thêm PWA khi thực sự muốn installable/offline.

> Đưa việc bump `CACHE_VERSION` thành 1 dòng trong checklist deploy của game (và ghi ở `DOCS.md §16` mỗi lần bump).

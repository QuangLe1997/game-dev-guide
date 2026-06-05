<!-- ============================================================
  TEMPLATE: DOCS.md — TÀI LIỆU KỸ THUẬT BẮT BUỘC cho MỖI game.
  Mục tiêu: đọc file này là HIỂU TOÀN BỘ game + biết chỗ chỉnh,
  KHÔNG cần đọc code. Muốn nâng độ khó / thêm màn chơi / đổi điểm
  → đọc §5, §6, §7, §15 là đủ.

  QUY TẮC VÀNG: file này phải LUÔN khớp với code. Mỗi khi đổi
  tính năng / level / số cân bằng → CẬP NHẬT NGAY trong cùng commit.
  Doc outdated = bug. (Xem CLAUDE.md §1 của repo game.)

  Copy file này thành DOCS.md trong repo game, điền hết, xoá phần
  hướng dẫn trong dấu <!-- -->. Số dòng (nếu ghi) là GẦN ĐÚNG —
  luôn grep tên hàm/marker để định vị.
  ============================================================ -->

# <GAME NAME> — Tài liệu kỹ thuật

> Đọc file này là hiểu toàn bộ game + biết chỗ nào để sửa, **không cần đọc code**.
> Game nằm trong: `index.html` (hoặc `src/`). Số cân bằng tập trung ở **§14**.

---

## 0. TRẠNG THÁI TÍNH NĂNG (đọc đầu tiên)
<!-- Bảng mọi tính năng + đã làm/chưa + chỗ sửa (tên hàm/marker để grep). -->

| Tính năng | Trạng thái | Ở đâu (hàm / marker / file) |
|---|---|---|
| Core loop (mô tả 1 dòng) | ✅ / 🚧 / ❌ | `tickStep()` |
| Hệ điểm + combo | ✅ | `onScore()` |
| Level / lên cấp | ✅ | `levelUp()` |
| Power-ups | ✅ | `POW`, `spawnPowerup()` |
| … | | |

**Chưa làm (backlog):** …

---

## 1. Tổng quan & Concept

### Market context (research §0.0 — điền từ đầu)
<!-- Insight thị trường dẫn tới game này. Xem reference/market-research.md. -->
**Research (YYYY-MM-DD):**
- Genre hot: … (nguồn …)
- Theme/style hot: … → chọn …
- Story/vibe: …
- Đối thủ: <game A> mạnh …, thiếu … → khe hở: …
**Hook:** "…" (một câu định vị game khác/ngon hơn đối thủ ở đâu)

### Concept
- **Thể loại:** …
- **Core loop (1 câu):** "Người chơi [hành động] để [mục tiêu], càng [tiến triển] càng [khó]."
- **Thắng / Thua:** điều kiện thắng (nếu có) · điều kiện thua.
- **Cảm giác mục tiêu (fantasy):** game muốn người chơi *cảm thấy* gì.
- **2D hay 3D + vì sao:** …
- **Layout (mobile ưu tiên #1):** [ ] A — Mobile-frame (khung portrait ≤480px, letterbox desktop, không responsive) · [ ] B — Responsive thật (game cần view rộng). Vì sao: …

## 2. Tech stack
- Render: Canvas 2D / Three.js (r…). Build: zero-build, single `index.html` / `src/`.
- Thư viện ngoài (CDN): … (Matter.js? ZzFXM?).
- Lưu trữ: `localStorage`. Audio: WebAudio synth.

## 3. Vòng đời / State machine
<!-- Liệt kê các mode + điều kiện chuyển. -->
`mode ∈ intro → menu → playing → (paused) → dying → gameover → menu/playing`
- **intro:** …
- **menu:** …
- **playing:** …
- **paused / dying / gameover:** …

## 4. Gameplay & quy tắc
<!-- Luật chơi cụ thể: lưới/sân, di chuyển, va chạm, ăn/bắn/merge, điều kiện chết. -->
- Sân chơi: … (kích thước, toạ độ).
- Di chuyển / điều khiển logic: …
- Va chạm / chết: …
- Tương tác cốt lõi (ăn / bắn / merge / clear): …

---

## 5. CẤU TRÚC MÀN CHƠI / LEVEL  ⭐
<!-- ĐÂY là phần để "thêm màn chơi đọc vào là đủ". Mô tả MÔ HÌNH level. -->

### 5.1 Mô hình level
<!-- Game theo kiểu nào? Chọn/ghi rõ: -->
- [ ] **Endless + ramp** (1 màn vô tận, khó tăng theo level số) — VD snake/tetris.
- [ ] **Discrete stages** (các màn rời, mỗi màn có layout/mục tiêu riêng).
- [ ] **Wave-based** (từng đợt địch).

### 5.2 Level được định nghĩa ở đâu
- Dữ liệu level: `LEVELS[]` trong `…` (hoặc công thức sinh trong `…`).
- Cấu trúc 1 entry level:
```javascript
// VD cho discrete stages:
{ id:1, name:'…', goal:{ type:'score'|'clear'|'survive', value:1000 },
  layout:[…], spawnRate:…, enemies:[…], timeLimit:… , reward:… }
```
- (Endless) Công thức theo level `n`: tốc độ / mật độ / mục tiêu tính thế nào.

### 5.3 Bảng các màn hiện có
<!-- Liệt kê TỪNG màn (nếu discrete). Endless thì ghi mốc tiêu biểu. -->
| Level | Tên | Mục tiêu | Layout / đặc điểm | Tốc độ/Mật độ | Phần thưởng |
|---|---|---|---|---|---|
| 1 | … | … | … | … | … |
| 2 | … | … | … | … | … |

### 5.4 Tiến trình & milestone
- Lên cấp/đổi màn khi: … (đạt mốc gì).
- Milestone đặc biệt (boss / theme mới / lột xác) ở level: …
- Đổi tông màu / biome theo level: §… .

---

## 6. CẤU TRÚC ĐỘ KHÓ  ⭐
<!-- Để "nâng độ khó đọc vào là đủ". Mọi tham số khó nằm 1 bảng. -->

### 6.1 Các mode khó
| Mode | tham số 1 (vd grid) | tốc độ (baseTick→minTick) | mật độ vật cản | … |
|---|---|---|---|---|
| Easy | … | … | … | |
| Normal | … | … | … | |
| Hard | … | … | … | |

### 6.2 Khó tăng trong 1 ván (ramping)
- Công thức tốc độ theo level: `tick = max(minTick, baseTick − (level−1)·tickStep)`.
- Tham số nào tăng theo level (mật độ, số địch, timeLimit…): …
- **Đường cong mong muốn:** mô tả cảm giác (dễ vào, dốc dần, đỉnh ở level…).

### 6.3 Cách CHỈNH độ khó → xem §15.2 (recipe).

---

## 7. HỆ THỐNG TÍNH ĐIỂM  ⭐
<!-- Công thức điểm rõ ràng, ai đọc cũng tính lại được. -->

### 7.1 Nguồn điểm
| Hành động | Điểm cơ bản | Hệ số | Công thức đầy đủ |
|---|---|---|---|
| Ăn/clear thường | base=… | ×level ×combo | `round(base·level·mult)` |
| Bonus/vàng | … | … | … |
| Hoàn thành màn | … | … | … |

### 7.2 Combo / multiplier
- Cửa sổ combo: `COMBO_WINDOW = … ms`. Tối đa `COMBO_MAX = …`.
- `mult = 1 + combo·…`. Đứt combo khi: …

### 7.3 Best score / record
- Lưu ở localStorage key: `…`. Hiển thị ở: …

### 7.4 Cách ĐỔI điểm → xem §15.3 (recipe).

---

## 8. Economy / Xu (nếu có)
- Nguồn xu, công thức, ví, daily reward, dùng để mua gì.
- localStorage: `…`.

## 9. Vật phẩm / Power-up / Tiến hóa
| id | icon | Tác dụng | Thời lượng | Spawn khi |
|---|---|---|---|---|
| shield | 🛡️ | … | … | … |
| … | | | | |
- Bậc tiến hóa / nâng cấp (nếu có): bảng tier + điều kiện.

## 10. Âm thanh
- SFX map (sự kiện → âm): …
- Nhạc nền: …, tăng tốc theo level: …
- Mute key/nút: …

## 11. Điều khiển
- **Desktop:** phím … · chuột …
- **Mobile:** joystick/nút … · cử chỉ … (chống tap-leak ở §…).

## 12. State object `S` (field chính)
```
mode, diff, score, level, best, combo, tick, …
<liệt kê field + ý nghĩa ngắn>
```

## 13. localStorage keys
| key | ý nghĩa |
|---|---|
| `<game>.best` | điểm kỷ lục |
| `<game>.muted` | tắt tiếng |
| … | |

---

## 14. SỐ CÂN BẰNG (single source of truth)  ⭐
<!-- TẤT CẢ con số chỉnh game gom 1 chỗ (object CONFIG/BALANCE hoặc config.js).
     Không hardcode rải rác. Đây là nơi sửa khi balance. -->
```javascript
const CONFIG = {
  DIFF: { /* §6.1 */ },
  COMBO_WINDOW: …, COMBO_MAX: …,
  SCORE_BASE: …, GOLD_BASE: …,
  LEVELS: [ /* §5 */ ],
  POW: { /* §9 */ },
  // …
};
```
Vị trí trong code: `…` (file + marker).

---

## 15. HOW-TO (recipe cho việc hay làm)  ⭐
<!-- Hướng dẫn từng bước cho 3 việc người dùng hay yêu cầu. -->

### 15.1 Thêm một màn chơi mới
1. Mở `…` (nơi `LEVELS`/công thức ở §5.2).
2. Thêm entry theo cấu trúc §5.2 (id, goal, layout, …).
3. Cập nhật **§5.3 bảng các màn** trong DOCS này.
4. Test màn mới (vào đúng level đó), verify §verify.
5. Commit kèm cập nhật DOCS.

### 15.2 Nâng / chỉnh độ khó
1. Sửa số trong **§14 CONFIG.DIFF** (hoặc tham số ramp).
2. Cập nhật **§6 bảng độ khó** cho khớp.
3. Chơi thử từng mode, kiểm đường cong khó (§6.2).
4. Commit kèm cập nhật DOCS.

### 15.3 Đổi cách tính điểm
1. Sửa công thức/hằng ở **§14 CONFIG** (SCORE_BASE, mult…).
2. Cập nhật **§7 bảng điểm + công thức** cho khớp.
3. Verify điểm hiển thị đúng, best score vẫn lưu.
4. Commit kèm cập nhật DOCS.

### 15.4 Thêm power-up / tính năng
1. Thêm vào `CONFIG.POW` + logic apply.
2. Cập nhật **§0 bảng tính năng** + **§9**.
3. Verify + commit kèm DOCS.

---

## 16. Lịch sử cập nhật
<!-- Mỗi thay đổi lớn 1 dòng: ngày · commit · tóm tắt. Giúp truy vết. -->
- **YYYY-MM-DD** (`<commit>`): …

> **Last updated:** YYYY-MM-DD · nhánh `main` @ `<commit ngắn>`

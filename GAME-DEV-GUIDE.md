# 🎮 GAME DEV GUIDE — Build một game browser từ A → Z

> **Tài liệu chuẩn để xây MỘT game mới hoàn chỉnh** trong hệ "QUANG ARCADE": tự plan → đặt tên → thiết kế (màu/level/âm thanh/2D-3D) → build → gen ảnh OG → verify → tạo repo + deploy → đăng ký vào Arcade Hub. Làm đúng theo đây thì game mới **đồng bộ phong cách & chất lượng** với các game đang có.
>
> Quy ước: **prose tiếng Việt** để giải thích · **tiếng Anh** cho code/lệnh/term · **UI game public phải 100% tiếng Anh**.
>
> Mọi game: **single `index.html`, zero-build, no framework, no bundler, chơi ngay trên browser**.
>
> **Hub:** https://quangle1997.github.io/arcade/ · **URL mỗi game:** `https://quangle1997.github.io/<repo>/`

---

## 0. Pipeline tổng thể (bản đồ — agent bám theo đúng thứ tự)

```
┌─ PHASE 1: PLAN ──────────────────────────────────────────────┐
│ 0.1 Chốt thể loại + cơ chế lõi (1 câu "core loop")           │
│ 0.2 Quyết 2D hay 3D  → reference/2d-vs-3d.md                 │
│ 0.3 Đặt tên game + chọn --accent mới  → reference/inventory   │
│ 0.4 Phác level/difficulty + hệ điểm + juice                  │
│ 0.5 Viết 1 mini "design doc" (DOCS.md) ngay trong repo game  │
└──────────────────────────────────────────────────────────────┘
┌─ PHASE 2: BUILD ─────────────────────────────────────────────┐
│ 1. <head> + design tokens (§1, §2)                           │
│ 2. Game loop fixed-tick + interpolation                      │
│ 3. Core mechanic → render → input (kbd+mouse+touch)          │
│ 4. Juice: particle / shake / popup / bloom                   │
│ 5. Audio WebAudio synth + mute (§ reference/audio)           │
│ 6. UI: menu / HUD / game-over / pause / localStorage         │
└──────────────────────────────────────────────────────────────┘
┌─ PHASE 3: ART + VERIFY ──────────────────────────────────────┐
│ 7. Gen key-art + og-card.jpg (1200×675) bằng media-tools (§7)│
│ 8. Verify (§4.3): node --check + browser desktop+mobile + 0 err│
└──────────────────────────────────────────────────────────────┘
┌─ PHASE 4: SHIP ──────────────────────────────────────────────┐
│ 9. README.md (§6) → tạo repo + push (HTTPS) + GitHub Pages (§5)│
│ 10. Đăng ký vào Arcade Hub (§8): thumbnail + card + bump count │
│ 11. Confirm 2 URL live (game + arcade)                        │
└──────────────────────────────────────────────────────────────┘
┌─ PHASE 5: LEARN ─────────────────────────────────────────────┐
│ 12. Rút bài học → ghi LESSONS.md + commit + push repo guide  │
└──────────────────────────────────────────────────────────────┘
```

---

## PHASE 1 — PLAN (tự lập kế hoạch)

### 0.1 Chốt core loop
Viết **một câu** mô tả vòng lặp cốt lõi: *"Người chơi [hành động] để [mục tiêu], càng [tiến triển] càng [thử thách tăng]."*
VD: *"Drop fruits to merge same kinds into bigger ones, don't overflow the top."*
→ Nếu không nói được trong 1 câu, cơ chế chưa đủ rõ.

### 0.2 Chọn 2D hay 3D
Đọc [`reference/2d-vs-3d.md`](reference/2d-vs-3d.md). Tóm tắt:
- **3D (Three.js)**: snake/tank/match-3 khối bóng — khi không gian/chiều sâu/đổ bóng làm game "wow".
- **2D (Canvas)**: tetris/bubble/merge/sliding/block puzzle — khi gameplay là lưới/vật lý 2D, cần FPS cao & nhẹ trên mobile.
- **Mặc định nghiêng 3D nếu thể loại tận dụng được chiều sâu**; còn lại 2D Canvas cho gọn nhẹ.

### 0.3 Đặt tên + màu accent
- **Tên:** 1–2 từ tiếng Anh, mạnh, dễ nhớ, hợp thể loại (VD: NEON SERPENT, BRICK BLITZ, STEEL SIEGE). Tránh trùng tên game thương mại.
- **`--accent`:** chọn **màu mới chưa dùng** — xem bảng đã dùng trong [`reference/inventory.md`](reference/inventory.md). Mỗi game một màu chủ đạo riêng để arcade card phân biệt.
- **`<repo>` slug:** kebab-case, ngắn (VD `tank-shooter`, `neon-serpent-3d`).

### 0.4 Phác level / điểm / juice
- **Difficulty:** tối thiểu 3 mức (Easy / Normal / Hard) — đổi grid size / tốc độ / mật độ vật cản. Xem mẫu bảng `DIFF` trong [`reference/game-mechanics.md`](reference/game-mechanics.md).
- **Progression:** level tăng → nhanh hơn / khó hơn / phần thưởng to hơn. Có "lên cấp" rõ ràng (banner + âm + đổi tông màu/biome).
- **Score + combo:** điểm tức thì, combo nhân khi liên hoàn, popup nổi `+N`.
- **Juice (bắt buộc):** particle, screen shake, số nảy, flash, haptic (mobile). Mọi hành động đều có phản hồi hình + âm.

### 0.5 Tài liệu kỹ thuật `DOCS.md` (BẮT BUỘC — tạo NGAY từ đầu)
Mỗi game **phải** có `DOCS.md` trong repo game của nó, copy từ [`templates/GAME-DOCS-template.md`](templates/GAME-DOCS-template.md). Đây là tài liệu để **đọc là hiểu hết game mà không cần xem code** — đặc biệt §5 (cấu trúc màn chơi), §6 (cấu trúc độ khó), §7 (hệ tính điểm), §14 (số cân bằng), §15 (recipe nâng độ khó / thêm màn / đổi điểm).
Tạo khung `DOCS.md` ngay ở Phase 1 (điền dần khi build). **Quy tắc đồng bộ:** xem [§Tài liệu game bắt buộc](#-tài-liệu-game-bắt-buộc-không-được-outdated) bên dưới — đổi tính năng/level/điểm là phải update DOCS trong **cùng commit**.

---

## PHASE 2 — BUILD

### 1. Style / Design System (chuẩn UI)
Chi tiết đầy đủ (tokens, glass, typography, responsive): [`reference/design-system.md`](reference/design-system.md).
**Bắt buộc:**
- 1 file `index.html` (asset trong `assets/`). Không framework, không bundler, không npm. JS thuần.
- External resource duy nhất = **Google Fonts** (Orbitron + Space Grotesk) + Three.js CDN nếu 3D.
- Nền **gradient-mesh** + panel **glassmorphism** + mỗi game một `--accent`.
- `clamp()` cho mọi font lớn. Responsive mobile-first, vùng chơi là "hero".

### 2. `<head>` template
Copy nguyên từ [`templates/head.html`](templates/head.html) — đã có đủ viewport khoá-zoom, OG/Twitter tags, favicon emoji, fonts.

### 3. Game loop + mechanic
- **Fixed-tick + interpolation** (xem [`reference/game-mechanics.md`](reference/game-mechanics.md)): logic chạy theo tick cố định, render nội suy mượt giữa các tick.
- **Input kép**: keyboard (arrows/WASD/Space) + mouse + **touch** (tap/drag/joystick). Mobile cần joystick hoặc nút cảm ứng, chống tap-leak.

### 4. Juice & 5. Audio & 6. UI
- Juice: pool particle, shake scale theo độ lớn sự kiện, popup điểm.
- Audio: **WebAudio synth inline** (không file mp3), init sau user-gesture, nút mute. Xem [`reference/audio.md`](reference/audio.md).
- UI: menu (start/settings/profile) · HUD (score/level/lives/combo) · pause · game-over (hero score + retry + stats) · `localStorage` lưu record (namespace key theo game).

---

## PHASE 3 — ART + VERIFY

### 7. Gen key-art + OG image bằng media-tools (MCP)

> Dùng để tạo **`assets/og-card.jpg` (1200×675)** cho social share + **thumbnail** cho arcade card + (tuỳ chọn) banner trong game.

**Bước làm:**
1. **Đọc guide của media-tools trước** (BẮT BUỘC, 1 lần/phiên): gọi `get_agent_markdown` rồi `get_agent_docs` để biết model + cấu trúc prompt hiện hành.
2. **Tạo generation** — `create_generation_api_generation_post`:
   - `model: "gpt-image-2"` (hoặc model mới nhất guide khuyến nghị), `aspect_ratio: "16:9"` cho og-card.
   - `prompt`: theo tông neon/arcade của game, chừa "vùng an toàn" để crop 16:10, **không nhồi chữ** (gpt-image hay méo chữ).
   - `negative_prompt`: tránh watermark, text lỗi, viền.
   - ⚠️ **MCP hay timeout ở tầng giao tiếp nhưng task VẪN chạy/hoàn tất ở server. ĐỪNG gen lại nhiều lần** → tốn quota + rác. Đợi rồi poll.
3. **Lấy kết quả**: `get_generation_api_generation__task_id__get` (poll tới `status: done`) hoặc `list_history_api_history_get` (search theo name) → lấy `output_urls`.
4. **Tải + resize** (Windows PowerShell — dùng .NET; macOS dùng `sips`):
   ```powershell
   # Tải
   Invoke-WebRequest "<output_url>" -OutFile assets\og-card.jpg
   # Resize 1200×675 bằng System.Drawing
   Add-Type -AssemblyName System.Drawing
   $img = [System.Drawing.Image]::FromFile("assets\og-card.jpg")
   $bmp = New-Object System.Drawing.Bitmap 1200,675
   $g = [System.Drawing.Graphics]::FromImage($bmp)
   $g.DrawImage($img,0,0,1200,675); $bmp.Save("assets\og-card.jpg"); $img.Dispose(); $bmp.Dispose()
   ```
   (macOS: `sips -z 675 1200 assets/og-card.jpg` · thumbnail arcade ~800px: `sips -Z 800 …`)
5. **Dọn rác**: ship xong xoá task tạm bằng `delete_task_api_history__task_id__delete` — ⚠️ **chỉ xoá đúng task mình tạo** (search có thể trả task của project khác).

### 8. Verify protocol (làm TRƯỚC khi ship)
1. **Syntax**: tách inline `<script>` ra file `.mjs` tạm → `node --check file.mjs`. (Hoặc `node test.js` nếu game có test.)
2. **Serve local**: `python3 -m http.server 8773` → mở `http://localhost:8773`.
3. **Browser test** (Playwright MCP hoặc Chrome MCP nếu có): navigate, chụp **desktop 1280×800** + **mobile 390×844**, kiểm layout + **console error = 0** (favicon 404 bỏ qua).
4. **Functional**: chơi thật qua UI (không gọi hàm tắt) — 1 lượt, đổi setting, win/lose, reload còn nhớ record. Mobile: kiểm touch không bị tap-leak, audio resume sau chạm.

---

## PHASE 4 — SHIP

### 5. Tạo repo + GitHub Pages

> ⚠️ Path tuỳ máy. Trên máy này (Windows) các repo game thường nằm ở `D:\`. Thay `<games-root>` cho phù hợp.

```bash
cd <games-root>
mkdir <repo> && cd <repo>
# tạo index.html, assets/, README.md, DOCS.md ...

git init
git status && git diff --stat                    # xem trước
git add index.html README.md DOCS.md assets/*     # CHỈ file của mình (§Git safety)
git commit -m "feat: initial <GAME NAME> — single-file HTML5 game

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"

# tạo repo public trên GitHub (gh đã auth sẵn dưới QuangLe1997)
gh repo create QuangLe1997/<repo> --public --source=. --remote=origin

# đảm bảo HTTPS rồi push
git remote set-url origin https://github.com/QuangLe1997/<repo>.git
git push -u origin main
```

**Bật GitHub Pages** (branch `main`, folder `/`):
```bash
gh api -X POST repos/QuangLe1997/<repo>/pages \
  -f 'source[branch]=main' -f 'source[path]=/' 2>/dev/null || \
gh api -X PUT repos/QuangLe1997/<repo>/pages \
  -f 'source[branch]=main' -f 'source[path]=/'
```
→ ~30s sau live tại `https://quangle1997.github.io/<repo>/`.
Verify: `curl -fsSL "https://quangle1997.github.io/<repo>/?cb=<timestamp>"` rồi grep marker tựa game.

### 6. README.md cho game
Copy [`templates/README-game.md`](templates/README-game.md), điền tên/tagline/features/Live URL. Phải có dòng *"part of QUANG ARCADE"*.

### 8. Đăng ký vào ARCADE HUB

File: `arcade/index.html` (clone repo `arcade` nếu chưa có).
> **Bảo mật: CHỈ HTML tĩnh** — KHÔNG `innerHTML`/JS templating để render card (security hook chặn). Copy-paste block `<a class="card">`.

**B1 — Thumbnail:** bỏ ảnh key-art vào `arcade/assets/<repo>.jpeg` (~16:10, ~800px, crop `object-fit:cover`).

**B2 — Thêm card** (copy [`templates/arcade-card.html`](templates/arcade-card.html) vào trong `<main class="grid">`), set `--accent`, `num` (2 chữ số), title, sub, desc, tags, live URL.
➜ **Gỡ** `<span class="badge">★ Newest</span>` ở card cũ trước đó (chỉ 1 game được "Newest").

**B3 — Bump số lượng game** trong `arcade/index.html`: `<title>` + `<meta description>` + `og:*`/`twitter:*` + hero `.sub` + chip `<span class="chip"><b>N</b> Games</span>`. Và bảng Games trong `arcade/README.md`.

**B4 — (tuỳ chọn)** regen OG collage `arcade/assets/og-arcade.jpg` theo §7.

**B5 — Commit + push arcade:**
```bash
cd <games-root>/arcade
git status && git diff --stat
git add index.html README.md assets/<repo>.jpeg
git commit -m "feat: add <GAME NAME> to arcade (now N games)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push origin main
```

### 11. Confirm
Mở cả 2 URL: game (`/<repo>/`) + arcade. Card hiện đúng, click chơi được.

---

## PHASE 5 — LEARN (đừng bỏ qua)

Rút ra bài học gì trong lúc build (bug khó, mẹo, bẫy tool)? → Ghi [`LESSONS.md`](LESSONS.md) + commit + push repo guide này. Xem luật ở [`CLAUDE.md` §4](CLAUDE.md).

---

## 📑 Tài liệu game bắt buộc (KHÔNG được outdated)

> **Yêu cầu tối cao:** mỗi project game **phải** có một tài liệu kỹ thuật chuẩn để *đọc là hiểu hết game, không cần đọc code*. Người muốn nâng độ khó / thêm màn chơi / đổi cách tính điểm chỉ cần đọc tài liệu này là đủ.

### Quy định
1. **File `DOCS.md`** ở gốc repo game, theo đúng khung [`templates/GAME-DOCS-template.md`](templates/GAME-DOCS-template.md). (Game lớn có thể tách thêm `LEVELS.md` cho §5/§6, nhưng `DOCS.md` luôn là cửa vào.)
2. **Tạo từ đầu** (Phase 1, §0.5), điền dần khi build. Không để cuối dự án mới viết.
3. **Phải bao gồm tối thiểu:**
   - §0 Bảng trạng thái tính năng (+ chỗ sửa để grep)
   - §5 **Cấu trúc màn chơi/level** — mô hình level, định nghĩa ở đâu, bảng các màn, tiến trình
   - §6 **Cấu trúc độ khó** — bảng tham số từng mode + công thức ramp
   - §7 **Hệ thống tính điểm** — công thức đầy đủ, combo/multiplier, record
   - §14 **Số cân bằng** (single source of truth) — mọi con số gom 1 chỗ (`CONFIG`/`config.js`), không hardcode rải rác
   - §15 **HOW-TO recipes** — thêm màn / nâng độ khó / đổi điểm / thêm power-up
   - §16 Lịch sử cập nhật

### 🔴 LUẬT ĐỒNG BỘ — doc không bao giờ lệch code
- **Mỗi commit đổi tính năng / level / số cân bằng / cách tính điểm → PHẢI cập nhật `DOCS.md` trong CÙNG commit đó.** Code và doc đi cùng nhau.
- **Doc outdated bị coi như bug.** Không merge/push nếu doc chưa khớp.
- Đổi số balance → sửa ở **§14 CONFIG** rồi cập nhật bảng §5/§6/§7 tương ứng. Không sửa số rải rác trong code.
- Mỗi lần ship lớn → thêm 1 dòng vào §16 + cập nhật dòng `Last updated`.
- Khi review/verify (§8), **kiểm cả việc DOCS có khớp thực tế không** (đường cong khó, số màn, công thức điểm).

> Tham khảo doc chất lượng cao: `neon-serpent-3d/docs.md` (bảng tính năng + state machine) · `tank-shooter` (DOCS.md + LEVELS.md + config.js tách riêng số balance).

---

## ✅ Ship checklist (TL;DR — bám đúng thứ tự)

```
[ ] 1. PLAN: core loop 1 câu · 2D/3D · tên + --accent mới · level/score/juice
       → tạo khung DOCS.md từ templates/GAME-DOCS-template.md (§0.5)
[ ] 2. BUILD index.html: tokens §1 + head §2, loop fixed-tick, input kép, juice, audio, UI, localStorage
       → điền DOCS.md song song khi build (§5 level, §6 khó, §7 điểm, §14 CONFIG)
[ ] 3. ART: gen key-art + og-card.jpg (1200×675) bằng media-tools §7
[ ] 4. VERIFY §8: node --check + browser desktop 1280×800 & mobile 390×844 + 0 console error + chơi thử
       → kiểm DOCS.md KHỚP code (số màn, đường cong khó, công thức điểm)
[ ] 5. README.md §6 → tạo repo + push (HTTPS) §5 → bật GitHub Pages → verify live
[ ] 6. ARCADE §8: thumbnail + card + bump count + README + push
[ ] 7. Confirm 2 URL live (game + arcade)
[ ] 8. LEARN: ghi LESSONS.md + commit + push repo guide
```

---

## Definition of Done (game chỉ "xong" khi đủ hết)

- [ ] Single `index.html`, zero-build, mở là chạy.
- [ ] Responsive desktop (≥1280px) **và** mobile (390px). Vùng chơi là hero, không tràn.
- [ ] Input kép: touch + keyboard/mouse.
- [ ] UI **100% tiếng Anh** (không sót tiếng Việt — kể cả chữ HOA có dấu).
- [ ] Style chuẩn: Orbitron+Space Grotesk, mesh bg, glass panel, `--accent` riêng.
- [ ] OG/social tags + `assets/og-card.jpg` (1200×675).
- [ ] Key-art đẹp (media-tools) cho og-card và/hoặc banner.
- [ ] `localStorage` lưu record/lựa chọn.
- [ ] Audio: SFX WebAudio + nút mute, init sau user-gesture.
- [ ] 0 console error (trừ favicon 404 local).
- [ ] `README.md` có Live link + "part of QUANG ARCADE".
- [ ] Verify đã chạy (§8).
- [ ] Đã gắn vào arcade hub (§8).
- [ ] **`DOCS.md` đầy đủ & KHỚP code** (§0 tính năng · §5 level · §6 khó · §7 điểm · §14 CONFIG · §15 recipe · §16 history) — đọc là hiểu game không cần đọc code.
- [ ] Bài học (nếu có) đã ghi vào LESSONS.md + push.

---
Built for the QUANG ARCADE game family · zero-build HTML5 · GitHub Pages · crafted with ♥ & Claude Code.

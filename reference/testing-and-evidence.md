# 🧪 Testing & Evidence — luồng agent tự test + bằng chứng screenshot

> Một game **chỉ được tuyên bố DONE** khi đã chạy hết luồng dưới đây: agent tự lái game qua **mọi màn chơi / item / logic quan trọng**, chụp screenshot, **downsize**, lưu vào `tests/screenshots/`, ghi `tests/TEST-REPORT.md`, rồi **commit chung như bằng chứng test case đã PASS**.
>
> Mục tiêu: nhìn vào repo là biết game đã được kiểm thử cái gì, kết quả ra sao — không cần chạy lại.

---

## 0. Nguyên tắc
- **Tự động hoá bằng browser MCP** (Playwright MCP hoặc Chrome MCP): navigate → tương tác → `screenshot`.
- **Test qua UI thật** (chơi thật). Được phép dùng **dev helper** (`window._*`) để *ép trạng thái khó tái hiện* (vào thẳng level N, spawn power-up, force boss) cho việc chụp — nhưng phải có **ít nhất 1 lượt chơi thật** end-to-end (menu → chơi → chết/thắng → reload nhớ record).
- **Mỗi state quan trọng = 1 ảnh.** Phủ đủ: mọi level/milestone, mọi item/power-up, mọi màn UI, cả desktop + mobile.
- Ảnh là **bằng chứng**, không phải art → **downsize nhỏ** để repo nhẹ.

---

## 1. Ma trận test (phủ tối thiểu — tick hết mới DONE)

### Màn hình / luồng UI
- [ ] Intro / boot
- [ ] Menu (chọn được từng difficulty)
- [ ] HUD trong game (score / level / lives / combo hiển thị đúng)
- [ ] Pause
- [ ] Level-up / chuyển màn (banner / hiệu ứng)
- [ ] Game-over (hero score + retry + stats)
- [ ] Respawn (nếu có hệ mạng)

### Cấu trúc màn chơi (theo §5 DOCS của game)
- [ ] **Mỗi level/stage** (discrete) **hoặc** các **mốc tiêu biểu** (endless: early / mid / late + mỗi lần đổi biome/theme/milestone)
- [ ] Mỗi difficulty mode (Easy/Normal/Hard) ít nhất 1 ảnh gameplay

### Items / Power-ups (theo §9 DOCS)
- [ ] Mỗi power-up lúc **đang active** (buff chip hiện ở HUD)
- [ ] Vật phẩm đặc biệt (mồi vàng / bonus / boss…) nếu có

### Logic quan trọng
- [ ] Tính điểm + combo (ảnh có popup `+N` / `COMBO ×k`)
- [ ] Va chạm / chết / thắng đúng luật
- [ ] localStorage: record được nhớ **sau reload** (chụp trước & sau reload)

### Responsive
- [ ] **Mobile 390×844**: menu + gameplay + control (joystick/nút) — không tràn, không che HUD
- [ ] **Desktop 1280×800**: layout đầy đủ

### Sạch lỗi
- [ ] **Console error = 0** (favicon 404 bỏ qua) — lấy từ MCP console messages

---

## 2. Quy trình từng bước

```
1. Serve local:  python3 -m http.server 8773
2. (MCP) navigate http://localhost:8773
3. Với mỗi mục trong ma trận §1:
   - đưa game vào đúng state (chơi thật, hoặc window._* để ép)
   - resize đúng viewport (desktop 1280×800 / mobile 390×844)
   - screenshot → lưu raw tạm
4. Lấy console messages (level error) → phải rỗng
5. Downsize tất cả ảnh raw → tests/screenshots/ (§3)
6. Điền tests/TEST-REPORT.md (§4) — mỗi dòng 1 test case + ảnh + PASS/FAIL
7. Nếu có FAIL → sửa code, cập nhật DOCS nếu cần, lặp lại từ B3 cho mục đó
8. Khi 100% PASS → commit evidence (§5) → tuyên bố DONE (§6)
```

> Playwright/Chrome MCP thường lưu screenshot ra path tạm. Cứ chụp ra chỗ tạm rồi downsize copy vào `tests/screenshots/`.

---

## 3. Lưu & downsize ảnh (repo phải nhẹ)

**Quy ước thư mục & tên:**
```
tests/
├── TEST-REPORT.md
└── screenshots/
    ├── 01-menu-d.jpg          # NN-mô-tả-[d|m]  (d=desktop, m=mobile)
    ├── 02-level1-d.jpg
    ├── 03-powerup-shield-d.jpg
    ├── 04-gameover-d.jpg
    ├── 10-menu-m.jpg          # mobile bắt đầu từ ~10
    └── ...
```
- Định dạng **JPG**, **rộng tối đa 640px** (mobile có thể 360px), quality ~70%. Mục tiêu **< ~80 KB/ảnh**.
- KHÔNG commit ảnh PNG full-res (nặng). KHÔNG để ảnh raw lẫn vào.

**Downsize — Windows (PowerShell, System.Drawing):**
```powershell
Add-Type -AssemblyName System.Drawing
$maxW = 640
Get-ChildItem .\_raw\*.png | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $ratio = $maxW / $img.Width
  if ($ratio -ge 1) { $ratio = 1 }
  $w = [int]($img.Width*$ratio); $h = [int]($img.Height*$ratio)
  $bmp = New-Object System.Drawing.Bitmap $w,$h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img,0,0,$w,$h)
  $out = "tests\screenshots\" + ($_.BaseName -replace '\.png$','') + ".jpg"
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
  $p = New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, 70L)
  $bmp.Save($out, $enc, $p); $img.Dispose(); $bmp.Dispose()
}
```

**Downsize — macOS:** `sips -Z 640 _raw/*.png --setProperty format jpeg --out tests/screenshots/`
**Downsize — Linux (ImageMagick):** `mogrify -path tests/screenshots -resize 640x -quality 70 -format jpg _raw/*.png`

> Kiểm tổng dung lượng: `tests/screenshots/` nên **< ~1.5 MB** cho ~15–25 ảnh. Nếu nặng hơn → hạ quality/width.

---

## 4. TEST-REPORT.md
Dùng khung [`../templates/TEST-REPORT-template.md`](../templates/TEST-REPORT-template.md). Mỗi test case 1 dòng: ID · hạng mục · mô tả · viewport · ảnh (link tương đối) · kết quả (✅ PASS / ❌ FAIL) · ghi chú. Cuối file: tổng kết (N/N PASS) + verdict DONE.

---

## 5. Commit bằng chứng (chung với code)
```bash
cd <repo-game>
git status && git diff --stat
git add tests/TEST-REPORT.md tests/screenshots/*.jpg     # CHỈ file test (+ code nếu vừa sửa)
git commit -m "test: QA pass evidence — all levels/items/logic verified

- <N> screenshots (desktop+mobile), downsized
- covers: menu, levels 1..K, power-ups, scoring/combo, game-over, mobile
- console errors: 0

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push origin main
```

---

## 6. Định nghĩa DONE (agent chỉ tuyên bố khi đủ)
Game = **DONE / PASS / COMPLETED** khi **tất cả** đúng:
1. Ma trận §1 tick 100%.
2. `tests/screenshots/` có ảnh cho mọi level + mọi item + các logic quan trọng + mobile & desktop.
3. `tests/TEST-REPORT.md` ghi đủ, verdict = **PASS** (0 FAIL).
4. Console error = 0.
5. `DOCS.md` khớp thực tế đã test (số màn / độ khó / điểm).
6. Đã commit + push evidence.

Khi báo cho người dùng, **trích verdict + số liệu thật**: vd *"DONE — 22/22 test PASS, 18 ảnh evidence (desktop+mobile), 0 console error, đã push."* Nếu có mục chưa test được → nói rõ, **không tuyên bố DONE**.

> ⚠️ Không "tuyên bố pass" chỉ vì code chạy. Phải có **ảnh + report** chứng minh đã thấy tận mắt từng state.

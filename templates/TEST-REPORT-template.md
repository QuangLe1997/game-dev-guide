<!-- ============================================================
  TEMPLATE: tests/TEST-REPORT.md — bằng chứng QA cho game.
  Mỗi test case 1 dòng + link ảnh (đã downsize, trong tests/screenshots/).
  Chỉ tuyên bố game DONE khi verdict = PASS (0 FAIL). Xem
  reference/testing-and-evidence.md §6.
  Cập nhật lại mỗi lần đổi tính năng/level lớn (re-test + chụp lại).
  ============================================================ -->

# <GAME NAME> — Test Report (QA Evidence)

- **Ngày test:** YYYY-MM-DD
- **Commit:** `<short-sha>`
- **Build:** `index.html` (local http.server :8773)
- **Viewport:** desktop 1280×800 · mobile 390×844
- **Console errors:** 0 (favicon 404 ignored)

## Kết quả

| ID | Hạng mục | Mô tả test | Viewport | Ảnh | Kết quả | Ghi chú |
|----|----------|-----------|----------|-----|---------|---------|
| T01 | UI | Menu + chọn difficulty | desktop | [01-menu-d.jpg](screenshots/01-menu-d.jpg) | ✅ PASS | |
| T02 | Level | Level 1 gameplay | desktop | [02-level1-d.jpg](screenshots/02-level1-d.jpg) | ✅ PASS | |
| T03 | Level | Level mid + đổi biome/theme | desktop | [03-levelmid-d.jpg](screenshots/03-levelmid-d.jpg) | ✅ PASS | |
| T04 | Item | Power-up Shield active (HUD chip) | desktop | [04-pow-shield-d.jpg](screenshots/04-pow-shield-d.jpg) | ✅ PASS | |
| T05 | Item | Power-up X2 / Slow active | desktop | [05-pow-x2-d.jpg](screenshots/05-pow-x2-d.jpg) | ✅ PASS | |
| T06 | Logic | Tính điểm + combo (popup +N / ×k) | desktop | [06-combo-d.jpg](screenshots/06-combo-d.jpg) | ✅ PASS | |
| T07 | Logic | Level-up banner / chuyển màn | desktop | [07-levelup-d.jpg](screenshots/07-levelup-d.jpg) | ✅ PASS | |
| T08 | UI | Game-over (hero score + retry) | desktop | [08-gameover-d.jpg](screenshots/08-gameover-d.jpg) | ✅ PASS | |
| T09 | Persist | Record nhớ sau reload | desktop | [09-record-reload-d.jpg](screenshots/09-record-reload-d.jpg) | ✅ PASS | best score giữ nguyên |
| T10 | Responsive | Menu mobile | mobile | [10-menu-m.jpg](screenshots/10-menu-m.jpg) | ✅ PASS | |
| T11 | Responsive | Gameplay + control mobile | mobile | [11-play-m.jpg](screenshots/11-play-m.jpg) | ✅ PASS | joystick ok, không tap-leak |
| T12 | Responsive | Game-over mobile | mobile | [12-gameover-m.jpg](screenshots/12-gameover-m.jpg) | ✅ PASS | |
<!-- thêm dòng cho TỪNG level/item còn lại theo §1 ma trận. -->

## Tổng kết
- **Test cases:** N · **PASS:** N · **FAIL:** 0
- **Coverage:** menu/HUD/pause/levelup/gameover · levels 1..K (+ milestones) · power-ups <liệt kê> · scoring/combo · localStorage persist · mobile + desktop.
- **Console errors:** 0
- **DOCS.md khớp code:** ✅ (số màn / độ khó / công thức điểm đúng như đã test)

## ✅ VERDICT: **PASS — GAME DONE**
<!-- Nếu còn FAIL hoặc mục chưa test được → ghi rõ ở đây và KHÔNG để verdict PASS. -->

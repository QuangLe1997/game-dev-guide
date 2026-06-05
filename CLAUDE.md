# 🎮 GAME DEV GUIDE — Project Instructions (đọc đầu tiên, mọi session)

> File này Claude Code **tự động đọc** mỗi phiên trong repo. Đây là **trung tâm tri thức (knowledge base)** dùng chung cho TẤT CẢ agent xây game trong hệ "QUANG ARCADE". Đọc xong file này + [`GAME-DEV-GUIDE.md`](GAME-DEV-GUIDE.md) là đủ để tự build một game mới từ **A → Z** mà không cần hỏi lại.

---

## 0. Bạn là ai & repo này là gì

- Đây **KHÔNG** phải repo của một game cụ thể. Đây là **sách hướng dẫn + bộ nhớ chung**.
- Khi người dùng nói *"làm game mới"* / *"build game X"* → bạn **không code trong repo này**. Bạn:
  1. Đọc [`GAME-DEV-GUIDE.md`](GAME-DEV-GUIDE.md) (pipeline A→Z đầy đủ).
  2. Tạo **một repo riêng** cho game đó (xem §5 của guide).
  3. Build → verify → deploy → đăng ký vào Arcade Hub.
  4. Quay lại đây **ghi bài học** vào [`LESSONS.md`](LESSONS.md) rồi commit + push (§4 dưới đây).
- Repo này **chính nó cũng là một git repo** → mọi cập nhật tri thức phải được commit + push để agent session sau đọc được.

---

## 1. Quy trình làm việc (BẮT BUỘC)

1. **Tự chủ — không hỏi xác nhận từng bước.** Hệ game này để thử nghiệm + chơi vui. Gặp lựa chọn (kỹ thuật / thiết kế / thư viện / tên game / màu) → **tự chọn phương án tối ưu** rồi làm luôn. Chỉ hỏi khi bế tắc thật sự hoặc mâu thuẫn không tự giải được.
2. **Làm xong feature nào → commit + push NGAY.** Mỗi tính năng = 1 commit riêng, push thẳng `main` (GitHub Pages auto-deploy). Không gom dồn.
3. **Verify trước khi push**: `node --check` cú pháp + chạy thử HTTP server + 0 console error (desktop 1280×800 & mobile 390×844). **Game chỉ được tuyên bố DONE** khi đã tự test phủ mọi level/item/logic + lưu screenshot bằng chứng (downsize) vào `tests/screenshots/` + `tests/TEST-REPORT.md` verdict PASS, commit chung code (xem [`reference/testing-and-evidence.md`](reference/testing-and-evidence.md)). Không "tuyên bố pass" chỉ vì code chạy — phải có ảnh + report.
4. **Mỗi game PHẢI có `DOCS.md`** (tài liệu kỹ thuật — đọc là hiểu hết game không cần đọc code: cấu trúc màn chơi, độ khó, tính điểm, số cân bằng, recipe). Khung chuẩn: [`templates/GAME-DOCS-template.md`](templates/GAME-DOCS-template.md). Tạo từ đầu dự án.
5. **🔴 LUẬT ĐỒNG BỘ DOC:** mỗi commit đổi tính năng / level / độ khó / cách tính điểm → **cập nhật `DOCS.md` trong CÙNG commit**. Doc outdated = bug, không push. (Chi tiết: [`GAME-DEV-GUIDE.md` §Tài liệu game bắt buộc](GAME-DEV-GUIDE.md).)
6. **Cập nhật tri thức chung:** rút ra bài học chung → [`LESSONS.md`](LESSONS.md) của repo này (xem §4 dưới).

---

## 2. Git safety (CỰC KỲ QUAN TRỌNG — repo public)

- ❌ **TUYỆT ĐỐI KHÔNG** `git add -A` / `git add .` / `git add --all`.
- ✅ **LUÔN** `git status` + `git diff --stat` trước khi add.
- ✅ **CHỈ** `git add <file cụ thể>` đúng file mình tạo/sửa.
- ❌ Không commit secrets / API keys / file của người khác.
- ✅ Remote dùng **HTTPS** (SSH thường chưa auth trong môi trường agent):
  `git remote set-url origin https://github.com/QuangLe1997/<repo>.git`
- ✅ Commit message kết thúc bằng dòng:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## 3. Bản đồ tài liệu (đọc theo nhu cầu)

| Cần gì | Đọc file |
|---|---|
| **Pipeline A→Z** (plan → build → ship → arcade) | [`GAME-DEV-GUIDE.md`](GAME-DEV-GUIDE.md) ⭐ |
| Research thị trường (bước 0 trước khi plan) | [`reference/market-research.md`](reference/market-research.md) |
| **Khung tài liệu kỹ thuật bắt buộc cho mỗi game** | [`templates/GAME-DOCS-template.md`](templates/GAME-DOCS-template.md) ⭐ |
| **Luồng tự test + bằng chứng screenshot → DONE** | [`reference/testing-and-evidence.md`](reference/testing-and-evidence.md) ⭐ |
| Bài học / lỗi đã gặp / mẹo (đọc TRƯỚC khi build) | [`LESSONS.md`](LESSONS.md) ⭐ |
| Design system chi tiết (màu/font/glass) | [`reference/design-system.md`](reference/design-system.md) |
| Cơ chế game (loop, level, score, juice) | [`reference/game-mechanics.md`](reference/game-mechanics.md) |
| Âm thanh WebAudio | [`reference/audio.md`](reference/audio.md) |
| Chọn 2D / 3D theo thể loại | [`reference/2d-vs-3d.md`](reference/2d-vs-3d.md) |
| Danh sách game + màu accent đã dùng | [`reference/inventory.md`](reference/inventory.md) |
| Template copy-paste | [`templates/`](templates/) |

---

## 4. 🧠 LUẬT GHI BÀI HỌC (điều làm repo này thành knowledge base)

> **Đây là phần quan trọng nhất.** Mỗi khi trong lúc build game bạn rút ra được **một bài học quý** — một lỗi mất thời gian mới sửa được, một mẹo hiệu quả, một cạm bẫy của tool/CDN/mobile, một quyết định thiết kế hay — thì **PHẢI** ghi lại vào đây để agent sau không phải học lại từ đầu.

**Khi nào ghi:**
- Sửa xong một bug mà mất > 10 phút mò ra nguyên nhân.
- Phát hiện một hành vi bất ngờ của tool (media-tools timeout, gh Pages, Three.js CDN, iOS audio…).
- Tìm ra một pattern/snippet đáng tái dùng.
- Một lựa chọn thiết kế (màu/level/juice) cho kết quả tốt rõ rệt.

**Ghi vào đâu:** thêm 1 entry ở đầu danh sách trong [`LESSONS.md`](LESSONS.md) theo format có sẵn ở đó (ngày · nhãn · triệu chứng · nguyên nhân · cách xử lý · snippet nếu có).

**Sau khi ghi — BẮT BUỘC commit + push repo này:**
```bash
cd <đường-dẫn-tới>/game-dev-guide
git add LESSONS.md            # chỉ file mình sửa
git commit -m "lesson: <tóm tắt 1 dòng>

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push origin main
```
Nếu sửa cả guide/reference thì add thêm đúng các file đó. **Không push = bài học mất** → session sau không thấy.

---

## 5. TL;DR cho session mới (đọc 20 giây là chạy được)

1. Người dùng muốn game mới → mở [`GAME-DEV-GUIDE.md`](GAME-DEV-GUIDE.md), làm theo pipeline. **Bắt đầu bằng §0.0 RESEARCH** (genre/theme/story đang hot) để lấy context, rồi mới plan.
2. Trước khi build, lướt [`LESSONS.md`](LESSONS.md) để né các bẫy đã biết.
3. Build trong **repo riêng của game** (không build ở đây). Single `index.html`, zero-build, EN UI, mobile+desktop.
4. Gen OG/banner bằng **media-tools MCP** (§7 guide). Đặt tên game + chọn `--accent` mới (xem [`reference/inventory.md`](reference/inventory.md)).
5. Tạo repo + GitHub Pages → đăng ký vào **Arcade Hub**.
6. Rút ra bài học gì → ghi [`LESSONS.md`](LESSONS.md) + commit + push repo này.

> **Last updated:** 2026-06-04 · khởi tạo knowledge base từ PLAYBOOK + CLAUDE.md + phân tích 8 game hiện có.

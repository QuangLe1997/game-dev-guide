# 🎮 Game Dev Guide — Knowledge Base cho QUANG ARCADE

**Trung tâm tri thức dùng chung** để bất kỳ AI agent (Claude Code) nào, ở session mới, đọc vào là tự build được một game browser hoàn chỉnh từ **A → Z** và đăng ký vào [QUANG ARCADE](https://quangle1997.github.io/arcade/) — đồng bộ phong cách & chất lượng với các game đang có.

Đây **không phải repo của một game cụ thể**. Đây là sách hướng dẫn + bộ nhớ chung.

## 📂 Cấu trúc

| File | Vai trò |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | **Auto-read** mỗi session. Workflow + git safety + luật ghi bài học. Đọc đầu tiên. |
| [`GAME-DEV-GUIDE.md`](GAME-DEV-GUIDE.md) | ⭐ Pipeline A→Z: plan → build → gen ảnh → verify → repo + Pages → arcade. |
| [`LESSONS.md`](LESSONS.md) | ⭐ Bài học/bẫy đã gặp. Đọc trước khi build; ghi thêm sau khi build → commit + push. |
| [`reference/market-research.md`](reference/market-research.md) | Bước 0: research genre/theme/style/story đang hot trước khi plan. |
| [`reference/design-system.md`](reference/design-system.md) | Màu / font / glassmorphism / responsive (copy-paste tokens). |
| [`reference/game-mechanics.md`](reference/game-mechanics.md) | Game loop, level/difficulty, score/combo, juice, state machine. |
| [`reference/audio.md`](reference/audio.md) | WebAudio synth SFX + nhạc nền, mute, iOS resume. |
| [`reference/testing-and-evidence.md`](reference/testing-and-evidence.md) | ⭐ Luồng agent tự test + chụp/downsize screenshot làm bằng chứng + định nghĩa DONE. |
| [`reference/2d-vs-3d.md`](reference/2d-vs-3d.md) | Khi nào dùng 3D (Three.js) vs 2D (Canvas). |
| [`reference/inventory.md`](reference/inventory.md) | Danh sách game hiện có + màu `--accent` đã dùng (để chọn màu mới). |
| [`templates/GAME-DOCS-template.md`](templates/GAME-DOCS-template.md) | ⭐ Khung **tài liệu kỹ thuật bắt buộc** cho mỗi game (cấu trúc màn chơi/độ khó/điểm). |
| [`templates/TEST-REPORT-template.md`](templates/TEST-REPORT-template.md) | ⭐ Khung **báo cáo QA** (test case + ảnh bằng chứng + verdict PASS). |
| [`templates/`](templates/) | `<head>`, README game, arcade card — copy-paste. |

## 🚀 Dùng thế nào (agent session mới)

1. Người dùng muốn game mới → đọc [`GAME-DEV-GUIDE.md`](GAME-DEV-GUIDE.md), làm theo pipeline.
2. Lướt [`LESSONS.md`](LESSONS.md) để né bẫy đã biết.
3. Build trong **repo riêng của game** (không build trong repo này).
4. Ship → đăng ký arcade → **ghi bài học vào `LESSONS.md` + commit + push repo này**.

## 🧠 Vì sao đây là "bộ nhớ chung"

Mỗi agent học được gì quý → ghi vào `LESSONS.md` rồi push. Session/agent sau `git pull` (hoặc đọc lại) là thừa hưởng ngay, không phải học lại từ đầu. Tri thức tích luỹ dần thay vì biến mất theo từng phiên.

---
Built by [QuangLe1997](https://github.com/QuangLe1997) · crafted with ♥ & Claude Code.

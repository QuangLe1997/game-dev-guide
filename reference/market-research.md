# 📈 Market Research — bước 0 trước khi plan game

> Mục tiêu: game mới **bám trend & có khe hở thị trường**, không làm trong chân không. Research nhanh (15–30 phút), rút insight, đưa vào quyết định genre/theme/tên/màu/story và **lưu vào `DOCS.md §1`**.
>
> ⚠️ Lấy **cảm hứng + pattern + vibe**, KHÔNG sao chép. Không nhái tên/asset/nhân vật có bản quyền.

## 4 câu phải trả lời
1. **Genre/cơ chế đang hot** (web/H5 casual): .io, merge, idle/incremental, roguelite survivor, auto-battler, physics/ragdoll, hyper-casual one-tap, match/sort, tower defense… Cơ chế nào đang nhiều lượt chơi & dễ "one more try"?
2. **Theme / art style đang hot**: neon/synthwave, cozy pastel, low-poly 3D, pixel/retro, Y2K/chrome, dark fantasy, claymation, vaporwave… Chọn cái **hợp tông arcade-neon của hệ** nhưng còn mới mẻ, và phân biệt với 8 game đã có (xem [`inventory.md`](inventory.md)).
3. **Story / setting / vibe đang viral**: space survivor, dungeon crawl, brainrot/meme, farming/merge, cyber-heist… Lấy *vibe* để đặt theme + tên, không lấy IP.
4. **Đối thủ gần nhất**: 2–3 game cùng ý tưởng — họ mạnh gì, thiếu gì (control khó? thiếu juice? thiếu progression? quá khó vào?). **Khe hở** đó là góc của mình.

## Nguồn tham khảo
- **Web portals casual:** CrazyGames, Poki, itch.io (mục popular/new/trending), GameDistribution.
- **Trend tổng quát:** Google Trends (so sánh từ khoá genre), Reddit (r/WebGames, r/incremental_games, r/playmygame), YouTube/TikTok (game đang được stream/clip nhiều).
- **Casual mobile:** bảng top free Arcade/Puzzle (App Store / Google Play) để bắt mạch cơ chế hyper-casual.
- **Art trend:** ArtStation/Dribbble/Behance ("game UI", "casual game art"), Pinterest cho mood-board style.

## Cách làm (tool)
- Dùng **WebSearch** cho câu hỏi cụ thể ("trending html5 game mechanics 2026", "<genre> game popular crazygames"), **WebFetch** đọc trang đối thủ/bài tổng hợp.
- Cần sâu/đa nguồn có kiểm chứng → skill **`deep-research`**.
- Ưu tiên nguồn **6–12 tháng gần đây**. Bỏ qua trend đã bão hoà trừ khi có twist mới.

## Output (bắt buộc, gọn)
Viết vào `DOCS.md §1 — Market context`:
- **3–6 insight** gạch đầu dòng (mỗi cái 1 dòng, có thể kèm nguồn).
- **1 câu "hook"/góc tiếp cận**: ý tưởng này khác/ngon hơn đối thủ ở điểm nào.
- (tuỳ chọn) 2–3 tham chiếu style/theme để khâu ART (§7) bám theo khi gen key-art.

### Khuôn mẫu chép nhanh
```markdown
## 1. … (Market context)
**Research (YYYY-MM-DD):**
- Genre hot: … (nguồn …)
- Theme/style hot: … → chọn …
- Story/vibe: …
- Đối thủ: <game A> mạnh …, thiếu … → khe hở: …
**Hook:** "…"  (một câu định vị game)
```

> Research xong → quay lại [`GAME-DEV-GUIDE.md` §0.1–0.4](../GAME-DEV-GUIDE.md): genre/2D-3D/tên/màu/level/story phải **tham chiếu insight** ở trên, không quyết cảm tính.

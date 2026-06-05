# 📋 Inventory — game hiện có + màu accent đã dùng

> Cập nhật file này **sau mỗi game mới** (thêm dòng + đánh dấu màu đã dùng). Chọn `--accent` MỚI khác biệt cho game tiếp theo để arcade card không lẫn.

## Games đang chạy (8 + hub)

| # | Game | `--accent` | Genre | Tech | Repo |
|---|------|-----------|-------|------|------|
| 01 | **STEEL SIEGE** (tank) | `#e7b54a` | 3D tank defense (twin-stick, roguelite) | Three.js | `tank-shooter` |
| 02 | **NEON SERPENT 3D** | `#7fe0e0` | Snake reborn in 3D | Three.js | `neon-serpent-3d` |
| 03 | **DINO EGG POP** | `#ffb24a` | Match-3 bubble shooter | Canvas 2D | `dino-egg-shooter` |
| 04 | **SUIKA MERGE** | `#ff5a8a` | Watermelon merge physics | Canvas + Matter.js | `suika-merge` |
| 05 | **BRICK BLITZ** | `#a78bfa` | Glossy "metal Tetris" speed-ramp | Canvas 2D | `brick-blitz` |
| 06 | **SLIDE QUEST** | `#56d4ff` | Sliding picture puzzle (+ upload ảnh) | Canvas 2D | `slide-puzzle` |
| 07 | **BLOCK BLAST** | `#?` (xác nhận trong index.html) | Neon 8×8 block puzzle | Canvas 2D | `block-blast` |
| 08 | **TRIPLE MATCH 3D** | `#?` (xác nhận trong index.html) | 3D tile-match (match-3) | Three.js | `triple-tile` |
| — | **QUANG ARCADE** (hub) | — | Showcase 1 trang | HTML/CSS | `arcade` |

> ⚠️ Cột màu của 07/08 chưa xác nhận chính xác — mở `index.html` của chúng grep `--accent` để lấy giá trị thật khi cần.

## Màu accent ĐÃ DÙNG (tránh trùng)
```
#e7b54a  amber/gold   (tank)
#7fe0e0  cyan         (serpent)
#ffb24a  orange       (dino)
#ff5a8a  pink/rose    (suika)
#a78bfa  purple       (brick)
#56d4ff  sky blue     (slide)
```

## Gợi ý màu accent CÒN TRỐNG (cho game mới)
```
#5be58a  emerald green
#ff6b3d  coral/red-orange
#8de1ff  ice blue
#f0d24a  bright yellow
#c77dff  violet
#39e0c8  teal
#ff4d6d  hot red
```

## URL pattern
- Game: `https://quangle1997.github.io/<repo>/`
- Hub:  `https://quangle1997.github.io/arcade/`

## Repo gốc tham khảo chất lượng cao
- **Docs đầy đủ nhất:** `tank-shooter` (CLAUDE.md + DOCS.md + LEVELS.md + config.js), `neon-serpent-3d` (docs.md ~2600 dòng).
- **Modular src/ mẫu:** `suika-merge`, `brick-blitz` (managers/scenes/entities/systems/effects).
- **Design system gốc:** `arcade/PLAYBOOK.md`.

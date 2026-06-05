# 📋 Inventory — game hiện có + màu accent đã dùng

> Cập nhật file này **sau mỗi game mới** (thêm dòng + đánh dấu màu đã dùng). Chọn `--accent` MỚI khác biệt cho game tiếp theo để arcade card không lẫn.

## Games đang chạy (14 + hub)

| # | Game | `--accent` | Genre | Tech | Repo |
|---|------|-----------|-------|------|------|
| 01 | **STEEL SIEGE** (tank) | `#e7b54a` | 3D tank defense (twin-stick, roguelite) | Three.js | `tank-shooter` |
| 02 | **NEON SERPENT 3D** | `#7fe0e0` | Snake reborn in 3D | Three.js | `neon-serpent-3d` |
| 03 | **DINO EGG POP** | `#ffb24a` | Match-3 bubble shooter | Canvas 2D | `dino-egg-shooter` |
| 04 | **SUIKA MERGE** | `#ff5a8a` | Watermelon merge physics | Canvas + Matter.js | `suika-merge` |
| 05 | **BRICK BLITZ** | `#a78bfa` | Glossy "metal Tetris" speed-ramp | Canvas 2D | `brick-blitz` |
| 06 | **SLIDE QUEST** | `#56d4ff` | Sliding picture puzzle (+ upload ảnh) | Canvas 2D | `slide-puzzle` |
| 07 | **BLOCK BLAST** | `#54d6b2` | Neon 8×8 block puzzle | Canvas 2D | `block-blast` |
| 08 | **TRIPLE MATCH 3D** | `#7fe0c0` | 3D tile-match (match-3) | Three.js | `triple-tile` |
| 09 | **PRISM POUR** | `#39e0c8` | Water sort puzzle (20 levels, star rating) | Canvas 2D | `prism-pour` |
| 10 | **PULSE SURVIVOR** | `#c77dff` | Top-down survivors-like / bullet-heaven (auto-fire + OVERDRIVE) | Canvas 2D | `pulse-survivor` |
| 11 | **OVERCLOCK** | `#f0d24a` | Active-idle energy-reactor clicker (tap core, generators, SURGE, prestige) | Canvas 2D + DOM | `overclock` |
| 12 | **BEATFALL** | `#ff4d6d` | Synthwave 4-lane rhythm tap (self-synced WebAudio chart, STROBE x2, S/A/B/C) | Canvas 2D | `beatfall` |
| 13 | **ION TOWERS** | `#5be58a` | Path-based synthwave tower defense (8 maps, 3 towers, boss waves, OVERCHARGE) | Canvas 2D | `ion-towers` |
| 14 | **SKYLINE STACK** ⭐ | `#ff6b3d` | One-tap 3D tower stacker (slice overhang, PERFECT-streak heat: color+pitch+grow-back) | Three.js | `skyline-stack` |
| — | **QUANG ARCADE** (hub) | — | Showcase 1 trang | HTML/CSS | `arcade` |

## Màu accent ĐÃ DÙNG (tránh trùng)
```
#e7b54a  amber/gold   (tank)
#7fe0e0  cyan         (serpent)
#ffb24a  orange       (dino)
#ff5a8a  pink/rose    (suika)
#a78bfa  purple       (brick)
#56d4ff  sky blue     (slide)
#54d6b2  mint green   (block)
#7fe0c0  sea green    (triple)
#39e0c8  teal         (prism pour)
#c77dff  violet       (pulse survivor)
#f0d24a  bright yellow (overclock)
#ff4d6d  hot red       (beatfall)
#5be58a  emerald green (ion towers)
#ff6b3d  coral/red-orange (skyline stack) ⭐ NEW
```

## Gợi ý màu accent CÒN TRỐNG (cho game mới)
```
#8de1ff  ice blue
#ffd24a  bright amber (khác overclock đủ?)
#ff8da3  warm rose
#9b8cff  periwinkle
```

## URL pattern
- Game: `https://quangle1997.github.io/<repo>/`
- Hub:  `https://quangle1997.github.io/arcade/`

## Repo gốc tham khảo chất lượng cao
- **Docs đầy đủ nhất:** `tank-shooter` (CLAUDE.md + DOCS.md + LEVELS.md + config.js), `neon-serpent-3d` (docs.md ~2600 dòng).
- **Modular src/ mẫu:** `suika-merge`, `brick-blitz` (managers/scenes/entities/systems/effects).
- **Design system gốc:** `arcade/PLAYBOOK.md`.

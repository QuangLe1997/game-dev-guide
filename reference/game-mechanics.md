# ⚙️ Game Mechanics — loop, level, score, juice, state

> Pattern cốt lõi dùng chung. Bám theo để game "cuốn", công bằng, và mượt.

## Triết lý gameplay (bắt buộc)
- **Có ý nghĩa & cuốn:** mục tiêu rõ · phần thưởng tức thì (điểm/combo/item) · cảm giác tiến bộ (level/nâng cấp) · "just one more try".
- **Cân bằng độ khó:** không quá dễ (chán), không quá khó (nản), không khó thao tác (ức chế). Khó tăng dần mượt (ramping). Người mới chơi được ngay, người giỏi vẫn có thử thách.
- **Công bằng:** không chết oan; telegraph (cảnh báo trước) mối nguy; điều khiển nhạy & chính xác.
- **Juice:** mọi hành động có phản hồi hình + âm + (mobile) rung.
- **Mỗi tính năng phải phục vụ trải nghiệm** — không thêm cho có.

## Game loop — fixed-tick + interpolation
Logic chạy theo tick cố định (deterministic), render nội suy mượt giữa tick:
```javascript
let last = 0, acc = 0;
const TICK = 165;                 // ms mỗi nhịp logic (đổi theo difficulty/level)

function loop(now){
  const dt = now - last; last = now;
  acc += dt;
  while (acc >= S.tick){          // update logic theo nhịp cố định
    tickStep();
    acc -= S.tick;
  }
  const t = acc / S.tick;         // 0..1: phần lẻ để nội suy
  updateVisuals(t);               // vẽ/animate mượt theo t
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```
- Mesh/sprite **nội suy tuyến tính** giữa `prevState` và `state` theo `t`.
- Tốc độ tăng theo level: `S.tick = max(minTick, baseTick - (level-1)*tickStep)`. tick nhỏ = nhanh hơn.

## Level / Difficulty
Tối thiểu 3 mức, đổi các tham số cốt lõi. Mẫu bảng `DIFF`:
```javascript
const DIFF = {
  easy:   { grid:24, baseTick:200, minTick:115, tickStep:6,  obstPerLvl:0, goldChance:.16, foodPerLvl:5 },
  normal: { grid:20, baseTick:165, minTick:82,  tickStep:8,  obstPerLvl:1, goldChance:.18, foodPerLvl:5 },
  hard:   { grid:18, baseTick:138, minTick:62,  tickStep:9,  obstPerLvl:2, goldChance:.20, foodPerLvl:4 },
  insane: { grid:16, baseTick:112, minTick:48,  tickStep:10, obstPerLvl:3, goldChance:.22, foodPerLvl:4 },
};
```
- **Lên cấp:** đạt mốc (vd ăn đủ `foodPerLvl`) → `levelUp()`: tăng tốc + thêm vật cản + banner + flash + âm + (tuỳ game) đổi tông màu/biome.
- **Progression cảm xúc:** mỗi vài cấp có "milestone" (lột xác / boss / theme mới) để giữ hưng phấn.

## Score + Combo + Economy
```javascript
// Combo: ăn liên tiếp trong cửa sổ thời gian
if (now - S.lastEat < COMBO_WINDOW) S.combo = Math.min(S.combo+1, COMBO_MAX);
else S.combo = 0;
S.lastEat = now;
const mult = 1 + S.combo * 0.15;

// Điểm + popup nổi
const pts = Math.round(base * level * mult);
S.score += pts;
floatPop(pos, `+${pts}`);

// Xu/economy (tuỳ game) → bay vào ví, lưu localStorage
const coins = baseCoins + S.combo;
awardCoins(pos, Math.min(coins, 12));
```

## Power-ups (mẫu)
```javascript
const POW = {
  shield: { icon:'🛡️', ms:0,    apply:()=>{ S.shield=true; } },
  slow:   { icon:'⏳', ms:6000, apply:()=>{ S.slowUntil = now+6000; } },
  x2:     { icon:'2️⃣', ms:8000, apply:()=>{ S.x2Until = now+8000; } },
  life:   { icon:'❤️', ms:0,    apply:()=>{ S.lives = Math.min(S.lives+1, S.maxLives); } },
};
```
Buff đang chạy hiển thị chip ở HUD (`refreshBuffs()`), đếm ngược rõ ràng.

## Juice (làm game "đã tay")
- **Particle**: object-pooled burst khi ăn/nổ/merge.
- **Screen shake**: biên độ scale theo độ lớn sự kiện.
- **Popup số**: `+10`, `COMBO ×3` nổi lên rồi mờ.
- **Flash / vignette**: khi lên cấp / sắp chết.
- **Haptic** (mobile): `navigator.vibrate(ms)` khi lock/drop/hit.
- **Audio**: mọi action 1 SFX (xem `audio.md`).

## State machine (mẫu)
```
intro → menu → playing → (paused) → dying → gameover → menu/playing
```
- **intro**: cinematic mở đầu, tự chuyển sau vài giây hoặc khi chạm/phím.
- **menu**: chọn difficulty + start + profile. Có thể có "attract mode" (AI tự chơi demo).
- **playing**: loop accumulator fixed-tick.
- **paused**: dừng tick, vẫn render.
- **dying**: chuỗi chết ~1–1.5s (vỡ/nổ/rã + camera + vignette).
- **gameover**: còn mạng → respawn (giữ tiến độ); hết → overlay end-session (hero score + retry + stats).

## State object `S` (gom 1 chỗ)
```javascript
const S = {
  mode:'menu', diff:'normal', score:0, level:1, best:0,
  tick:165, accumulator:0, combo:0, lastEat:0,
  /* entities */ board:[], next:null,
  /* buffs */ shield:false, slowUntil:0, x2Until:0,
  /* lives */ lives:3, maxLives:10,
  /* fx */ shake:0, deathStart:0,
  /* economy */ wallet:0, gamesPlayed:0,
};
```

## localStorage (namespace theo game)
```javascript
const K = id => `mygame.${id}`;
localStorage[K('best')]   = S.best;
localStorage[K('wallet')] = S.wallet;
localStorage[K('muted')]  = S.muted ? 1 : 0;
```

## DOCS.md trong repo game (mẫu mục lục)
Mỗi game nên có `DOCS.md`: bảng tính năng (trạng thái + chỗ sửa) · state machine · bảng `DIFF` · hệ điểm/combo · localStorage keys · lịch sử cập nhật. Tham khảo `neon-serpent-3d/docs.md` & `tank-shooter` (DOCS+LEVELS+config.js) làm mẫu chất lượng cao.

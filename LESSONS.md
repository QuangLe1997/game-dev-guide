# 🧠 LESSONS — Bộ nhớ chung của mọi agent

> **Đọc file này TRƯỚC khi build** để né bẫy đã biết. **Ghi vào file này** mỗi khi rút ra bài học quý trong lúc làm (bug khó, mẹo, cạm bẫy tool/CDN/mobile, quyết định thiết kế hay).
>
> Ghi entry mới **ở ĐẦU danh sách** (mới nhất trên cùng). Sau khi ghi → **commit + push repo này ngay** (xem [`CLAUDE.md` §4](CLAUDE.md)). Không push = bài học mất.

### Format mỗi entry
```
## YYYY-MM-DD · [nhãn] Tiêu đề ngắn
- **Triệu chứng:** thấy gì / lỗi gì.
- **Nguyên nhân:** vì sao.
- **Cách xử lý:** làm gì để hết.
- **Snippet:** (nếu có) code/lệnh tái dùng.
- **Game:** repo nào phát hiện (để truy nguồn).
```
Nhãn gợi ý: `[git]` `[pages]` `[media-tools]` `[threejs]` `[audio]` `[mobile]` `[ios]` `[perf]` `[design]` `[arcade]` `[verify]`.

---

<!-- ↓↓↓ THÊM ENTRY MỚI NGAY DƯỚI ĐÂY (mới nhất trên cùng) ↓↓↓ -->

## 2026-06-04 · [verify] Stale `http.server` trên cổng dùng chung → test NHẦM game khác
- **Triệu chứng:** Headless Chrome mở `localhost:8773`, mọi screenshot ra… **PRISM POUR** chứ không phải game đang build. `document.querySelector('#coreZone')` trả `null`, `document.title` = tên game khác. Tưởng DOM vỡ / service worker hỏng, mò gần 20 phút.
- **Nguyên nhân:** Một `python -m http.server 8773` của phiên build game **trước** vẫn còn chạy, serve thư mục game cũ. Lệnh `http.server 8773` mới **không bind được** (cổng bận) nhưng fail im lặng trong background → `curl` vẫn 200 (từ server cũ). Cổng "đời cha để lại".
- **Cách xử lý:** (1) Verify server bằng **title/marker**, không chỉ HTTP 200: `curl -s localhost:PORT | grep '<title>'` phải khớp game của mình. (2) Mỗi game dùng **cổng riêng/độc nhất** hoặc kill server cũ trước. (3) Khi DOM "thiếu element" mà code đúng → nghi serve nhầm nguồn TRƯỚC khi nghi code.
- **Game:** `overclock`.

## 2026-06-04 · [design][perf] Idle/clicker: list mua đồ KHÔNG được rebuild `innerHTML` mỗi frame + lớp UI đừng đè tap-target
Rút từ build `overclock` (active-idle reactor). Một bản nháp trước đó dính cả 4 lỗi sau — đáng né ngay:
- **[perf] `list.innerHTML = …` trong vòng render 60fps = giết scroll + click.** Generator list dựng lại mỗi tick → `scrollTop` reset về 0 mỗi frame (không cuộn nổi trên mobile), phần tử bị thay liên tục nên tap "trượt". ⇒ **Dựng DOM 1 lần** (`buildGenList()`), giữ ref tới các `<span>` động, mỗi ~0.2s chỉ **cập nhật textContent + toggle class** (`refreshGenList()`).
- **[design] Lớp tương tác (list) đè lên tap-target (core) = không tap được core.** Canvas core vẽ ở `y≈140` nhưng `#genList{inset; pointer-events:auto}` phủ lên trên → mọi cú chạm "core" bị list nuốt. ⇒ Tách **vùng riêng** bằng layout cột flex: `#coreZone` (cao cố định) TRÊN, `#genList` (flex:1, scroll) DƯỚI — không chồng nhau.
- **[design] Cơ chế lõi (prestige) phải có NÚT rõ ràng, đừng giấu sau keybind.** Bản nháp chỉ cho prestige qua phím `L` với điều kiện mâu thuẫn (`prestigeCount>0` nên không bao giờ prestige được lần đầu) → tính năng lõi **bất khả thi** mà vẫn "trông như có". ⇒ Luôn có UI thấy được (thanh **Ascend** + nút `+N 🔥`). Chơi thật end-to-end mới lộ.
- **[design] Số nhỏ <1 đừng floor về "0".** `0.2/sec` floor ra `0` nhìn như sinh năng lượng = 0. ⇒ `formatRate()` riêng giữ 1 chữ số thập phân khi <10 (HUD energy vẫn floor cho sạch). Big-number suffix mở rộng K…Dc rồi rơi về `toExponential`.
- **Game:** `overclock`.

## 2026-06-04 · [verify][design] Puzzle level-based: PHẢI có solver verify solvable + win-check phải cho phép bình rỗng
- **Triệu chứng:** Game water-sort (PRISM POUR) "code chạy, render đẹp" nhưng **không bao giờ thắng** — không hiện màn complete. Tuyên bố DONE hớ vì chưa từng chơi thắng thật (browser cache còn hiện game cũ).
- **Nguyên nhân (2 lỗi chết người):** (1) **Level không giải được**: water-sort yêu cầu **mỗi màu xuất hiện đúng `capacity` (vd 4) lần** thì mới gom đầy 1 bình; mảng LEVELS viết tay số lượng màu tùy tiện (màu chỉ có 2 unit) → vô nghiệm. (2) **Win-check sai**: `tubes.every(isSolvedTube)` coi **bình rỗng = chưa xong** nên kể cả giải đúng cũng không trigger (giải xong luôn còn bình rỗng). Đúng: `every(t => t.length===0 || isSolvedTube(t))`.
- **Cách xử lý:** Với MỌI game puzzle level-based (sort/match/sokoban…), **viết generator + solver (BFS/A*) chạy lúc build** để: (a) verify từng level solvable, (b) tính **optimal moves chính xác** cho star-rating công bằng. Thêm `tools/verify.mjs` **replay lời giải qua chính game-logic** rồi assert win + assert invariant (mỗi màu ≡0 mod capacity). 20/20 PASS mới ship. Đừng tin "code chạy" — phải chơi-thắng-thật + harness chứng minh.
- **Snippet:** A* heuristic cho water-sort: `h = (#color-segments) − (#distinct colors)` (admissible, lower-bound số pour còn lại) → đủ nhanh tới 7 màu/9 bình. PRISM/wildcard: `effMatch=(a,b)=>a===b||a==='*'||b==='*'`; solved = full & (bỏ '*' ra còn ≤1 màu).
- **Game:** prism-pour.

## 2026-06-04 · [verify] MCP browser bị sandbox → chụp evidence bằng headless Chrome cục bộ + hook `?shot=`
- **Triệu chứng:** Cần screenshot bằng chứng nhưng `mcp__*__computer screenshot save_to_disk` **không trả path vào FS của mình**, và Chrome do MCP điều khiển **không vào được `localhost`** (instance remote/sandbox) → ảnh không commit được vào repo.
- **Nguyên nhân:** Chrome của MCP chạy ở môi trường tách biệt với Bash tool; localhost & filesystem không bắc cầu.
- **Cách xử lý:** Dùng **headless Chrome cục bộ** (chrome.exe có sẵn) chụp chính server `localhost` của mình → PNG vào FS, rồi PIL downsize → `tests/screenshots/`. Thêm **hook vô hại `?shot=scene[:level]`** vào game để headless tự lái tới state cần chụp (menu/play/sel/pause/win/select). Cờ chuẩn: `--headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=480,940 --virtual-time-budget=2800 --screenshot=out.png "URL?shot=win:1"`. Lưu ý: **đừng** đặt `--force-device-scale-factor=2` với window nhỏ (viewport CSS bị chia đôi → panel tràn); để scale=1 và width = bề rộng app (480).
- **Game:** prism-pour.

## 2026-06-04 · [design] `all:unset` trên button reset `box-sizing` → nút tràn ra ngoài card
- **Triệu chứng:** Nút trong dialog (Play/Resume/Play Again…) và card upgrade **lòi ~7px ra khỏi panel** ở mép phải, dù `width:100%` + panel có padding.
- **Nguyên nhân:** `*{box-sizing:border-box}` ở global, nhưng `.btn{ all:unset }` (pattern của starter) **reset MỌI property về initial**, gồm `box-sizing` → quay lại `content-box`. Khi đó `width:100%` (= content) **cộng thêm** `padding:15px` → tổng rộng hơn vùng trong panel ~28px, tràn mép.
- **Cách xử lý:** Sau `all:unset` luôn set lại `box-sizing:border-box` (và `width:100%` nếu cần) cho element đó: `.btn, .up, .icons button{ box-sizing:border-box }`. Đo bằng `getBoundingClientRect()` (btn.right vs panel.right) để chắc 0px overflow, đừng chỉ nhìn.
- **Game:** `pulse-survivor` (starter dùng `all:unset` cho .btn nên dính chung — đáng vá ở starter).

## 2026-06-04 · [verify][design] Chụp screenshot xong PHẢI soi vỡ layout, không chỉ "tính năng có hiện"
- **Triệu chứng:** Test `pulse-survivor` bằng screenshot, mọi state "PASS" vì mình chỉ check *tính năng có render không*. User mở ra thấy **vỡ layout quá trời**: chữ trong card level-up dính liền ("Fire Rate +22%Shoot faster"), HUD (score/timer + thanh HP/XP/OD ở đáy) **lòi xuyên qua** mọi overlay (menu/level-up/pause/gameover) bị cắt nham nhở ở mép.
- **Nguyên nhân:** Functional-correct ≠ visually-correct. `<span>` cho name/desc không `display:block` → dính dòng. `#hud` luôn hiện (inset:0) → lộ sau panel. Mình bỏ qua bước soi layout.
- **Cách xử lý:** Thêm **1 pass review UI/UX bắt buộc** trước khi DONE — soi TỪNG ảnh tìm: phần tử chồng/cắt/tràn mép & safe-area · chữ dính/wrap xấu/span phải là block · label quá nhỏ · **HUD/nền lòi qua dialog** (overlay phải che chrome gameplay) · padding/canh lệch · contrast & màu có dễ chịu không · banner/popup sót lại sai màn. Fix rồi **chụp lại**. Coi vỡ layout = bug chặn như bug logic.
- **Snippet:** ẩn HUD sau overlay: `#hud{opacity:1;transition:.18s} #app.overlay-open #hud{opacity:0}` + toggle `.overlay-open` trong `show()`/`hideAll()`. Card 2 dòng: `.nm,.ds{display:block}` + `.meta{display:flex;flex-direction:column;gap:3px}`.
- **Game:** `pulse-survivor`.

## 2026-06-04 · [verify][design] Survivors-like: bẫy va-chạm/entity & cách test khi rAF bị throttle
Rút từ build `pulse-survivor` (top-down auto-shooter, nhiều entity).
- **[verify] Browser tự động hoá báo `document.visibilityState='hidden'` → `requestAnimationFrame` bị PAUSE hoàn toàn** (game đứng yên, `time` không tăng) — tưởng game vỡ nhưng chỉ là tab "ẩn". Chrome MCP remote / headless background đều dính. ⇒ Đừng dựa vào rAF để test. Thêm 1 dev-helper **vô hại** `window._autoplay(frames)` tự **gọi thẳng các hàm tick** (chính logic thật) như một bot (lái tới shard, né địch, bắn overdrive). Vừa né throttle vừa cho telemetry thật (kills/level/hp/od). Để lại trong bản ship cũng được vì nó inert nếu không gọi.
- **[verify] Lấy ảnh bằng chứng khi browser test là REMOTE/headless:** `save_to_disk` lưu ở máy chủ browser (không với tới), và trả base64 qua MCP hay bị **chặn**. ⇒ Cách chắc ăn: chạy **headless Chrome cục bộ** bằng `puppeteer-core` (trỏ `executablePath` tới Chrome/Edge có sẵn) serve `localhost`, lái state bằng `page.evaluate(_autoplay/_pick/_boss…)`, `el.screenshot()` chụp **cả HTML + canvas** native thẳng ra đĩa. Downsize ≤640px bằng System.Drawing.
- **[design] Va chạm tiếp xúc PHẢI có i-frame, không cộng dồn mỗi frame.** Lần đầu code `hp -= dmg*dt*k` mỗi frame cho mọi địch chồng lên player → nhiều địch = mất máu tức thì (chết ~24s), và i-frame chỉ bật khi "1 hit lớn" nên không bao giờ bật. ⇒ Tiếp xúc là **1 hit rời rạc** `hp -= dmg`, set i-frame ~0.7s chặn stack. Đứng giữa bầy = ~1 hit / 0.7s, sống được & có nhịp.
- **[design] Entity chết PHẢI bị lọc khỏi mảng mỗi frame.** Quên `S.enemies = S.enemies.filter(e=>!e.dead)` → "xác" địch ở lại: vẫn render, vẫn đuổi, vẫn gây damage, và **bị đạn bắn lại** → `killEnemy` chạy nhiều lần (kills/score/shard phồng lên giả). ⇒ Lọc dead cuối mỗi frame + guard `if(e.dead) return` trong `damageEnemy` + skip dead trong vòng đạn-vs-địch. (Bẫy này làm "spawn rate" tưởng sai 3× nhưng thực ra là kills bị đếm trùng.)
- **[design] Float score lọt ra UI.** `S.score += dt*10` là số thực → game-over hiện `9,113.167`. ⇒ `Math.floor` khi lưu/hiện (HUD đã floor nhưng overlay quên).

## 2026-06-04 · [pages][perf] Stale deploy & màn hình đen — 2 bẫy ship phổ biến
- **[pages] PWA kẹt bản cũ:** có service worker mà deploy không bump `CACHE_VERSION` → người chơi vẫn thấy bản cũ ("đã sửa mà không đổi"). ⇒ Bump version mỗi deploy đổi code; HTML/JS để network-first; verify ở tab ẩn danh. Không cần offline thì bỏ hẳn SW. Chi tiết: [`reference/retention-and-pwa.md` §5](reference/retention-and-pwa.md).
- **[perf] CDN fail = trắng màn câm:** Three.js/Matter.js nạp qua CDN, nếu fail/chặn thì game đen thui không báo gì → tưởng vỡ. ⇒ Bọc init trong try/catch, hiện thông điệp + nút Reload. Chi tiết: [`reference/performance.md`](reference/performance.md).
- **[perf] Mobile yếu giật:** render DPR 3–4× + bloom + particle `new` mỗi frame. ⇒ Cap DPR ≤2 mobile, pool particle, `lowFX` tự bật khi fps<45.

## 2026-06-04 · [seed] Các bài học gốc rút từ 8 game đang chạy
Những điều này đã được kiểm chứng qua các game hiện có — coi như nền tảng:

- **[media-tools] Timeout giả.** `create_generation` hay timeout ở tầng MCP nhưng task **vẫn hoàn tất ở server**. ⇒ Đừng gen lại; poll `get_generation_api_generation__task_id__get` hoặc `list_history` theo name để lấy `output_urls`.
- **[media-tools] Đừng nhồi chữ vào prompt ảnh.** gpt-image hay render chữ méo/sai. Để tiêu đề game add bằng HTML/CSS đè lên, không nhờ AI vẽ chữ. Chừa "vùng an toàn" để crop 16:10 cho arcade card.
- **[git] Không bao giờ `git add -A`/`.`** trong repo public/shared — dễ commit nhầm file người khác hoặc secrets. Luôn `git status` + add file cụ thể.
- **[git] Remote phải HTTPS.** SSH key thường chưa auth trong môi trường agent → push fail. `git remote set-url origin https://github.com/QuangLe1997/<repo>.git`.
- **[pages] GitHub Pages mất ~30s** sau push mới live; verify bằng `curl` có cache-buster `?cb=<timestamp>` rồi grep marker, đừng tin lần curl đầu.
- **[ios] Audio câm trên iOS/Android** nếu không gọi `actx.resume()` **trong** user gesture. Gọi resume ở mọi handler chạm/phím đầu tiên.
- **[mobile] Tap-leak qua overlay ẩn.** Nút overlay đã ẩn vẫn "ăn" chạm joystick nếu không tắt pointer-events. Giữ CSS `.overlay.hidden, .overlay.hidden *{pointer-events:none}`. Joystick dùng `setPointerCapture` + `touchstart preventDefault` + nuốt `click` capture-phase.
- **[mobile] viewport-fit=cover + env(safe-area-inset-*)** để không bị tai thỏ / thanh dưới che HUD. Game thì khoá zoom (`maximum-scale=1, user-scalable=no`); hub thì để scalable.
- **[threejs] Zero-build bằng importmap CDN** (jsDelivr, r0.169). Bloom phải **yếu** (strength ~0.5, threshold ~0.82) + emissive thấp, nếu không màn hình chói gắt. Đá/vật trung tính KHÔNG emissive — chỉ điểm sáng mới glow.
- **[perf] Mobile tắt bớt hiệu ứng nặng** (cosmos/đổ bóng phức tạp) để giữ FPS. Tự hạ chất lượng nếu máy yếu.
- **[design] Mỗi game một `--accent` khác biệt** → arcade card không bị lẫn. Cập nhật bảng màu đã dùng ở [`reference/inventory.md`](reference/inventory.md) sau mỗi game.
- **[arcade] Card trong arcade phải HTML tĩnh thuần** — security hook chặn `innerHTML`/JS templating. Copy-paste block `<a class="card">`, sửa tay.
- **[verify] Test qua UI thật**, không gọi hàm tắt (`window._*`). Dev helper để debug thì xoá hoặc giữ vô hại trước khi ship.
- **[design] Giữ juice nhất quán:** mọi hành động (ăn/bắn/merge/clear) phải có phản hồi hình + âm + (mobile) haptic. Đây là thứ làm game "đã tay".

<!-- ↑↑↑ THÊM ENTRY MỚI NGAY TRÊN DÒNG NÀY ↑↑↑ -->

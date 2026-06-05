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

## 2026-06-05 · [threejs][verify] Crowd-runner 3D (InstancedMesh): bẫy NaN matrix, nhãn quay lưng camera, headless ~2 frame, balance carryover
Rút từ build `legion-rush` (3D count-master runner, đám đông bằng `InstancedMesh`).
- **[threejs] InstancedMesh "tàng hình" vì matrix NaN từ CONFIG thiếu hằng số.** Cả đám đông không hiện (HUD vẫn báo count, **KHÔNG** có console error). Nguyên nhân: `updateCrowdInstances` dùng `CONFIG.BOB_RATE` mà quên khai báo trong `CONFIG` → `undefined` → `t*undefined = NaN` → translation y/z của instance = NaN → GPU âm thầm bỏ qua (không vẽ, không lỗi). ⇒ Khi InstancedMesh không hiện gì: **nghi NaN trong matrix trước tiên** (số × undefined). Tìm nhanh: ghi `instanceMatrix.array[12..14]` (translation instance 0) vào `document.title`, đọc bằng `chrome --headless --dump-dom` → thấy `(0.5,NaN,NaN)` là ra ngay.
- **[threejs] Nhãn chữ (CanvasTexture plane) quay LƯNG vào camera đuôi.** Camera bám sau (z nhỏ) nhìn về +z; `PlaneGeometry` mặc định mặt trước hướng +z → quay đi → bị cull (FrontSide) hoặc **chữ bị gương** (DoubleSide). ⇒ Xoay `label.rotation.y = Math.PI` để mặt trước hướng về camera, chữ KHÔNG gương. (Toán: camera nhìn +z, up +y ⇒ "phải màn hình" = world −x; xoay 180° quanh Y mới đưa text về đúng chiều — DoubleSide thì lật ngang.)
- **[verify] Headless Chrome chỉ chạy ~2 frame rAF dù có `--virtual-time-budget`** → camera-follow lerp chưa kịp hội tụ khi chụp (đo `camZ=0.8` thay vì ~25). ⇒ Thêm `snapCamera()` đặt camera vào đúng pose bám-đuôi NGAY trong hook `?shot=`, và `mode='frozen'` cho loop render tĩnh (không tiến game) để ảnh evidence ổn định, đúng khung.
- **[verify] Lấy output text từ headless KHÔNG cần browser MCP:** ghi kết quả (bảng sim, verdict selftest, telemetry) vào `<pre id="simOut">` + `document.title`, chụp `chrome --headless --dump-dom > out.html` rồi regex bóc `<pre>`. Selftest nên dispatch `PointerEvent`/`KeyboardEvent` thật (`bubbles:true`) qua listener thật để kiểm input path, và đếm `window.__errs` (0 console error) — gói trong 1 lần dump-dom.
- **[design][verify] Count-master: carryover + cổng ×N làm đám đông bão hoà MAX sau 1–2 màn** → mọi target thành vô nghĩa (bot chơi ẩu cũng thắng 8/8). ⇒ Dùng **start tươi mỗi màn (KHÔNG carryover)** cho game stage-based: độ khó chỉnh được, sim per-stage có nghĩa. Tune `target ≈ 0.5 × greedy@barrier` (đo bằng bot hoàn hảo trong `?shot=sim`); xác minh bot greedy thắng 8/8 MỌI difficulty, bot careless rớt dần. Lưu ý: Hard greedy ≈ 0.71× Normal greedy (start thấp hơn) ⇒ giữ `TARGET_MULT[hard]` vừa phải (~1.12), cao quá thì chơi hoàn hảo cũng bất khả thi.
- **[arcade] Accent yêu cầu `#ff4d6d` HOÁ RA ĐÃ DÙNG (beatfall).** "Confirm unused" mà không unused → đổi `#ff3344` (scarlet thuần, khác pink-red beatfall). Và `inventory.md` lệch thực tế (ghi 13 game, arcade đã có 14 — thiếu `skyline-stack`). ⇒ Đối chiếu accent với NGUỒN THẬT (`grep arcade/index.html`), đừng chỉ tin inventory; cập nhật inventory cho khớp sau mỗi game.
- **Game:** `legion-rush`.

## 2026-06-05 · [threejs][design] Stacker 3D: bloom làm màu khối "cháy trắng" · khung camera Stack · helper build-demo phải an toàn
Rút từ build `skyline-stack` (one-tap 3D tower stacker kiểu "Stack").
- **[threejs] Gradient màu khối bị wash thành TRẮNG khi bật bloom.** Muốn khối "nóng dần" theo combo nên ban đầu để `emissiveIntensity` cao (~0.5) + `UnrealBloom` + ACES tonemap + env IBL mạnh → mọi tone trung bình cháy ra trắng, mất sạch màu. ⇒ Giữ **emissive thấp (≤~0.25)**; "nóng" = **tăng saturation, GIẢM lightness** (đừng tăng lightness), KHÔNG tăng emissive. Hạ `scene.environmentIntensity` (~0.4) để PMREM khỏi làm nhạt khối. Hiệu ứng "màn hình nóng lên" tách ra **1 lớp DOM overlay `mix-blend-mode:screen`** (opacity theo streak) thay vì nhồi vào pipeline 3D — rẻ, chắc, không đụng alpha/bloom. Snippet màu: `color.setHSL(h, 0.62+heat*0.33, 0.55-heat*0.05)`.
- **[design] Khung camera Stack:** cho khối trượt **dao động quanh tâm (x/z=0)** và camera = **offset CỐ ĐỊNH chỉ bám `top.Y`** (lerp). Tháp tự ở giữa khung (drift ngang bị cơ chế cắt kéo về) → khỏi cho camera đuổi ngang. `lookAhead` để **ÂM** (nhìn hơi DƯỚI đỉnh) đẩy đỉnh lên ~1/3 trên, chừa headroom cho khối tới mà không thừa trời. `AMP` (biên trượt) ≈ bề rộng khối: đủ để tap sai thời điểm vẫn trượt hụt cả khối đầy (công bằng) mà khối vẫn trong khung.
- **[perf] Khối dùng CHUNG 1 `BoxGeometry(1,1,1)` + `mesh.scale(sx,h,sz)`** thay vì geometry mới mỗi block → nhẹ RAM, dispose chỉ cần `material.dispose()`. Cull + dispose material các block dưới tầm nhìn (giữ ~16) để không rò GPU mem khi tháp cao vô tận.
- **[verify] Helper `_build(n)` (dựng nhanh tháp để chụp) phải KHÔNG game-over giữa chừng.** Trim ngẫu nhiên tích lũy có thể đẩy overlap < ngưỡng miss trước khi đủ n → ảnh "tháp cao" hoá ra game-over. ⇒ Cap |delta| theo footprint hiện tại + ép perfect khi mỏng. Bẫy phụ: trim có `|delta| < PERFECT_EPS` **âm thầm tính là PERFECT** (không đứt streak) → muốn tháp demo "tự nhiên" nhiều màu thì delta phải > ngưỡng perfect.
- **Game:** skyline-stack.

## 2026-06-05 · [verify][threejs] Chụp evidence game WebGL bằng headless Chrome cần cờ SwiftShader + dẹp spam console `navigator.vibrate`
- **[threejs] Headless Chrome chụp Three.js ra ĐEN/fail GL nếu không bật software GL.** Game canvas-2D không sao, nhưng WebGL cần cờ. ⇒ puppeteer-core launch kèm `--enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader --ignore-gpu-blocklist` (+ `--no-sandbox --disable-dev-shm-usage`). Probe `cv.getContext('webgl2') && window._S.engineReady` để chắc đã render thật rồi mới `screenshot`. (Dùng puppeteer `setViewport({isMobile:true})` cho mobile — device-emulation TÔN TRỌNG `meta width=device-width`, né bẫy CLI `--window-size` báo `innerWidth` sai ở entry ion-towers.)
- **[verify] `navigator.vibrate` bị Chrome log như CONSOLE ERROR khi chưa có user-gesture.** Lái game qua hook `?shot=`/`_build` (không chạm thật) làm mỗi lần haptic in `Blocked call to navigator.vibrate...` → "30 console errors" GIẢ làm hỏng tiêu chí "0 error". ⇒ Gate haptic sau cờ `gestured` (set ở `pointerdown/keydown` thật): vừa đúng hành vi (vibrate chỉ chạy sau gesture) vừa cho evidence 0 error.
- **[verify] Reuse node_modules harness có sẵn:** đặt script chụp NGAY trong thư mục đã có `puppeteer-core` (vd `.qa-harness/`) để bare-import resolve được, ghi PNG sang `tests/_raw` của game rồi downsize System.Drawing → `tests/screenshots`. Khỏi cài lại puppeteer ~300MB mỗi game.
- **Game:** skyline-stack.

## 2026-06-05 · [verify][arcade] Snapshot file của sub-agent (Explore) có thể CŨ — re-grep LIVE trước khi sửa file dùng chung
- **Triệu chứng:** Sub-agent Explore báo arcade đang **11** game (badge ★ Newest ở OVERCLOCK) + 2 màu còn trống; thực tế arcade LIVE đã **13** game (`#ff4d6d`, `#5be58a` đã dùng), Newest ở ION TOWERS.
- **Nguyên nhân:** Output của agent/Read là ảnh chụp tại thời điểm đọc; tới lúc EDIT thì đã lệch.
- **Cách xử lý:** Trước khi sửa **số đếm / marker** trong file dùng chung (arcade `index.html`, `inventory.md`): **grep LIVE lại** lấy giá trị + dòng chính xác (số game, card đang giữ `★ Newest`, accent đã dùng, `num` lớn nhất). Mình tránh vỡ nhờ grep `Newest|num"|card"` ngay trước khi chèn card #14 + dời badge. Đừng tin số đếm từ snapshot cũ.
- **Game:** skyline-stack.

## 2026-06-05 · [verify][mobile] Headless Chrome dựng mobile-frame ở 480px → ảnh evidence "tràn nút" GIẢ ở cửa sổ 390
- **Triệu chứng:** Build sheet (hàng 3 nút tower flex) bị **cắt nút thứ 3** chỉ khi chụp `--window-size=390,844`; ở 480 thì vừa khít. Tưởng vỡ layout mobile.
- **Nguyên nhân:** Headless Chrome (CLI, không bật device-emulation qua DevTools) **KHÔNG tôn trọng `<meta width=device-width>`** → `innerWidth`/`100vw` báo ~**484** dù cửa sổ 390 (đo bằng probe `getComputedStyle(body).width`). App dùng `width:min(100vw,480px)` → ra **480**, nhồi vào cửa sổ 390 → cắt mép phải. Trên điện thoại thật `100vw=390` nên app=390, KHÔNG tràn. Đây là **artifact headless**, không phải bug.
- **Cách xử lý:** (1) Chụp evidence "mobile" cho game **mobile-frame (strategy A)** ở đúng **bề rộng khung** (≥ max-width, vd 480×844) — đó CHÍNH là layout phone thấy; chụp 390 ra "vỡ giả". Chụp "desktop" ở 1280×800 để show letterbox. (2) Vẫn thủ phòng cho phone hẹp thật: thêm `min-width:0` + `flex:1 1 0` cho MỌI flex-child (mặc định `min-width:auto`=min-content → tràn khi <480; nhất là sau `all:unset`). (3) Nghi "vỡ ở viewport N" → **đo `innerWidth` thật** bằng probe TRƯỚC khi sửa mù.
- **Game:** `ion-towers`.

## 2026-06-05 · [verify] Headless Chrome CACHE HTML theo URL → sửa CSS xong chụp lại vẫn thấy bản cũ
- **Triệu chứng:** Sửa CSS, `curl` xác nhận file served đã đổi, nhưng screenshot headless **vẫn y hệt bản lỗi**. Mò ~10 phút tưởng CSS không ăn.
- **Nguyên nhân:** Gọi `chrome --headless --screenshot URL` với **cùng URL** → Chrome dùng **disk cache** HTML cũ (dù instance mới). `python http.server` gửi `Last-Modified` nên Chrome coi còn fresh.
- **Cách xử lý:** Luôn thêm **cache-buster duy nhất** vào URL mỗi lần chụp: `"...?cb=$([guid]::NewGuid().ToString('N'))&shot=..."`. (Bổ sung họ "đừng tin lần chụp đầu" của bài học stale-server 2026-06-04.)
- **Game:** `ion-towers`.

## 2026-06-05 · [verify][design] TD/wave game: viết IN-ENGINE balance-sim (bot dở tự chơi hết level) để chỉnh độ khó
- **Triệu chứng:** Không thể "chơi tay" 8 map × ~13 wave để biết đường cong khó hợp lý chưa; chỉnh số mù dễ lệch (map dễ thắng full, map khó bất khả thi).
- **Nguyên nhân:** Cân bằng TD phụ thuộc cả cách chơi; nhìn số CONFIG không đủ.
- **Cách xử lý:** Hook `?shot=sim` chạy **`_simAll()`**: một **bot ngẫu nhiên "trung bình"** (mỗi đợt nghỉ: mua/nâng tower gần path rồi gọi wave ngay) tự chơi hết 8 sector **bằng chính game-logic thật** (`step()`), in bảng WIN/LOSS + core còn lại + wave đạt. Tốc độ: cờ **`SIM=true`** để build/upgrade/kill/leak **bỏ qua side-effect DOM/particle/audio** (nếu không, rebuild sheet + spawnParts mỗi lần làm sim treo → headless quá giờ → screenshot rỗng). Bot dở mà THẮNG hết với core giảm dần (15/20→5/20) = đường cong đẹp; thắng full hết = quá dễ; thua sớm = quá khó. Chạy lại sau mỗi lần đổi số.
- **Snippet:** `let SIM=false; function spawnParts(...){ if(SIM) return; ...}` (+ guard updateHUD/openTowerSheet/pop/banner). `function _simMap(i){ SIM=true; startMap(i); while(!S.ended){ if(!S.waveActive){bot();S.interT=0;startWave();} step(1/30);} SIM=false; return {...} }`.
- **Game:** `ion-towers`.

## 2026-06-05 · [audio][verify] Rhythm game: self-synced chart + cách test audio-clock game trong headless
Rút từ build `beatfall` (4-lane synthwave rhythm tap, nhạc synth WebAudio).
- **[audio] Self-sync "by construction":** sinh beatmap TỪ chính note-data của bài hát rồi lịch cả audio LẪN visual theo MỘT đồng hồ `AudioContext.currentTime`. Mỗi note: phát tiếng tại `hitTime`, ô rơi tới vạch đúng `hitTime` (spawn ở `hitTime - travelTime`). ⇒ không bao giờ lệch, không cần "chart tay" theo file mp3. Lịch audio bằng **lookahead scheduler** (mỗi ~25ms, đẩy event có `t < now + 0.12s`) — pattern "two clocks". Difficulty chỉ lọc subset note được chart (density) + đổi travelTime; nhạc nền (lead/bass/pad/drum) luôn phát đầy đủ nên bài luôn nghe trọn ở mọi mức.
- **[verify] Headless Chrome cho game dùng audio clock:** `AudioContext.currentTime` KHÔNG nhích nếu context `suspended` → headless phải bật cờ `--autoplay-policy=no-user-gesture-required` rồi `ctx.resume()`. **`--virtual-time-budget` KHÔNG đẩy audio clock** (nó chỉ ảo hoá timer JS) → phải **đợi wall-clock thật** (`setTimeout`) bằng puppeteer; muốn chụp "kết quả thật" thì để bot chơi hết bài thật (~50-60s) rồi `finishSong` tự tính grade.
- **[verify] Bot test PHẢI đi qua input path thật.** Bot gọi thẳng `award()` thì KHÔNG kiểm được handler bàn phím/tap. Thêm bot phụ **dispatch KeyboardEvent thật** qua handler. ⚠️ `new KeyboardEvent('keydown',{code})` mặc định `bubbles:false` → dispatch lên `document` KHÔNG tới listener ở `window` (bị "miss" hết). Phải `{code, bubbles:true}` và dispatch đúng target. (Tap path: `cv.dispatchEvent(new PointerEvent('pointerdown',{clientX,clientY,bubbles:true}))`.)
- **[design] Đừng làm intro dài/thưa.** Bản đầu để 2 bar "giữ hợp âm" rồi melody mới vào ở beat 8 → ~5s gần như im lặng ở 96bpm: vừa chán, vừa làm bot test chỉ ăn được 3 note (score kẹt 900, grade D giả). ⇒ Cho note chơi được từ **beat 0**, dùng count-in (3·2·1) lo phần "sẵn sàng".
- **[design] Tên game dài bị cắt trong khung phone.** `h1` gradient-clip với `clamp(36px,13vw,60px)` → "BEATFALL" (8 ký tự) tràn panel `max-width:380px` và **cụt chữ cuối ("BEATFAL")** mà không báo lỗi. ⇒ Cỡ tiêu đề theo **bề ngang KHUNG** (panel), không theo `vw` màn hình; soi screenshot menu để chắc đủ chữ. (LESSONS chung: chụp xong phải soi vỡ layout.)
- **[design] Overlay mới phải toggle luôn lớp ẩn-HUD.** Thêm màn Pause nhưng quên add class `overlay-open` ⇒ HUD (score/acc) lòi xuyên qua dialog Pause. Mọi overlay che gameplay đều phải bật `.overlay-open` (ẩn HUD), tắt khi resume.
- **Game:** `beatfall`.

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

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

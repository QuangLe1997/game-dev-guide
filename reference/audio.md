# 🔊 Audio — WebAudio synth (no audio files)

> Mọi SFX/nhạc **tổng hợp inline bằng Web Audio API** — không nhúng mp3/ogg (giữ bundle nhẹ, instant). Phải init sau user-gesture đầu tiên + có nút mute.

## Khởi tạo (init sau user-gesture)
```javascript
let actx = null;
function audio(){
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();   // ⚠️ iOS/Android: PHẢI gọi trong gesture
  return actx;
}
// gọi audio() trong MỌI handler chạm/phím/click đầu tiên, nếu không sẽ câm trên mobile.
```

## SFX synth — note đơn
```javascript
function note(freq=440, dur=0.1, type='square', gain=0.2){
  if (S.muted) return;
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(gain, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g).connect(a.destination);
  o.start(); o.stop(a.currentTime + dur);
}
```

## Preset SFX (map theo sự kiện)
```javascript
function sfx(id){
  switch(id){
    case 'eat':     note(660, .08, 'square'); break;
    case 'gold':    note(880, .12, 'sine'); note(1320,.10,'sine',.12); break;
    case 'combo':   note(523 + S.combo*40, .07, 'triangle'); break;  // pitch tăng theo combo
    case 'levelup': [523,659,784,1046].forEach((f,i)=>setTimeout(()=>note(f,.12,'sine'),i*70)); break;
    case 'hit':     note(160, .18, 'sawtooth', .25); break;
    case 'die':     note(110, .5, 'sawtooth', .3); break;
    case 'error':   note(140, .12, 'square', .2); break;
  }
}
```

## "Pitch ladder" cho merge/combo
Mỗi lần merge/clear liên hoàn → chơi note cao hơn 1 bậc (cảm giác do–re–mi leo thang), reset khi đứt chuỗi. Cực kỳ "đã tai" cho game merge/match.

## Nhạc nền
- Đơn giản: 1 oscillator pad + arpeggio lặp theo nhịp game; tăng tempo theo level (`updateMusicRate`).
- Nâng cao: **ZzFXM** (tiny tracker, encode track thành mảng) — đã dùng trong neon-serpent (2 track synthwave). Nhúng `zzfxM`/`zzfxG` inline, không file ngoài.
- Nhạc tăng tốc theo cấp để dồn cảm xúc.

## Nút mute (bắt buộc)
```javascript
muteBtn.onclick = () => {
  S.muted = !S.muted;
  localStorage['mygame.muted'] = S.muted ? 1 : 0;
  muteBtn.textContent = S.muted ? '🔇' : '🔊';
  audio();  // vẫn resume context để lần bật lại nghe được
};
```

## Bẫy thường gặp (xem thêm LESSONS.md)
- **iOS câm** nếu không `resume()` trong gesture → luôn gọi `audio()` ở handler đầu.
- Đừng tạo `AudioContext` lúc load trang (autoplay bị chặn) → lazy-init ở gesture đầu tiên.
- Giữ `gain` thấp (~0.2) để không chói tai; ramp xuống `exponentialRampToValueAtTime` cho mượt (tránh "click" pop).

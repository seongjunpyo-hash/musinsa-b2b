# Musinsa B2B Hero Video — AI Generation Prompts

현재 Cooltandard 영상과 유사한 톤(밝은 자연광, 미니멀 한국 컨템포러리 남성복, 시네마틱 슬로우 카메라)을 타겟으로 작성된 프롬프트 모음.

---

## 📐 공통 설정 (Technical Settings)

| 항목 | 값 |
|---|---|
| Aspect Ratio | **16:9** (landscape) |
| Duration | **8–12초** (hero loop용) |
| Resolution | 1080p 이상 (4K 지원되면 4K) |
| Frame Rate | 24fps (cinematic) 또는 30fps |
| Style | Cinematic, natural lighting, editorial fashion |
| Negative prompt | text, logo, watermark, distorted face, extra fingers, low quality, cartoon, anime |

---

## 🎬 MAIN PROMPT (가장 추천 — Sora 2 / Veo 3 용)

```
Cinematic fashion film of a minimalist Korean contemporary menswear brand.
A male model in linen beige oversized shirt and tailored cream trousers walks
slowly through a sunlit modern studio space with large floor-to-ceiling windows.
Soft morning light filters in, warm golden tones washing over white concrete walls.
Gentle breeze moves the fabric. Slow dolly-in camera, anamorphic lens,
shallow depth of field, subtle film grain, 24fps, 16:9.
Color palette: warm ivory, sage green, soft beige, muted charcoal.
Mood: calm, refined, editorial, Japanese minimalism meets Seoul modern.
No text, no logos, no graphics.
```

---

## 🎬 ALT PROMPT A — Urban Rooftop (도시감)

```
A young Asian model in a crisp white linen shirt and straight-leg indigo trousers
stands on a minimalist concrete rooftop at golden hour. Seoul skyline softly blurred
in the background. Wind catches the fabric. Camera slowly orbits 45 degrees.
Natural sunlight, cinematic grade, slight haze, warm highlights, cool shadows.
35mm anamorphic lens, shallow depth of field, film grain.
Aspect 16:9, 24fps, 10 seconds. Editorial fashion mood, Musinsa Standard aesthetic.
No text, no branding.
```

---

## 🎬 ALT PROMPT B — Studio White Background (카탈로그감)

```
Three Korean models in head-to-toe minimal summer menswear — sage green shirt,
cream linen suit, charcoal knit polo — walk side by side through an all-white
infinity cove studio. Soft diffused key light from above, subtle fill.
Camera tracks smoothly at hip level, slight low angle. Models move with relaxed
confidence, fabric flows naturally. Crisp white floor, clean shadows.
Color grading: neutral bright, high key, slight warm tint.
Cinematic 16:9, 24fps, 8 seconds, anamorphic lens, shallow DOF.
No text, no logos, fashion editorial style.
```

---

## 🎬 ALT PROMPT C — Outdoor Nature (쿨탠다드 계승)

```
Solo male model in loose cotton summer shirt and shorts walking barefoot along
a bright sunlit wooden pier, clear blue sea in the background, white sand visible.
Strong natural sunlight, light sea breeze moves hair and fabric. Slow-motion
tracking shot from the side. Highlights slightly blown out for airy summer feel,
pastel sky, crisp shadows. Cinematic color grade, film grain, anamorphic lens,
shallow DOF, 24fps, 16:9, 10 seconds.
Calm, refreshing, premium summer mood. No text, no logos.
```

---

## 🛠️ 툴별 팁

### Sora 2 (OpenAI)
- 전체 프롬프트를 그대로 넣어도 잘 읽음
- "cinematic" "anamorphic" "shallow depth of field" 같은 시네마 용어를 좋아함
- 10초 이상 긴 샷이 필요하면 여러 번 생성해서 이어붙이는 게 안정적

### Veo 3 (Google)
- 가장 실사 퀄리티가 높음 (현재 기준)
- 프롬프트 앞에 **"Photorealistic, 4K, cinematic"** 명시하면 더 좋아짐
- 모델 얼굴이 또렷이 나올 수 있으니 "model seen from side/behind" 식으로 얼굴을 피하면 상업 활용 리스크 줄어듦

### Runway Gen-4
- 이미지를 먼저 생성(Midjourney 등)한 뒤 **image-to-video**로 모션 주는 게 가장 깔끔
- Motion brush로 옷자락/머리카락만 흔들리게 하는 등 정교한 제어 가능
- 프롬프트는 짧고 핵심만 넣는 걸 선호

### Kling 2.0 (Kuaishou)
- 아시아 모델 얼굴 자연스러움이 강점
- 옷감 움직임(fabric motion) 특히 잘함
- 영어/중국어 모두 허용, 한국어는 영어로 번역해서 넣는 게 안정적

---

## 🎨 Musinsa 톤 키워드 (프롬프트에 섞어서 쓰기)

**분위기**: minimal, refined, calm, editorial, effortless, understated, quiet luxury
**조명**: soft natural light, diffused morning light, golden hour, high key, airy
**색감**: warm ivory, sage green, stone beige, charcoal, off-white, muted earth tones
**렌즈/카메라**: anamorphic lens, 35mm, shallow DOF, slow dolly, tracking shot, low angle
**질감**: film grain, subtle halation, soft shadows, natural skin tone
**피해야 할 것**: saturated colors, fast cuts, dramatic lighting, aggressive movement

---

## 💡 워크플로우 추천

1. **Veo 3 또는 Sora 2**에서 MAIN PROMPT로 8–10초 생성 (3–4번 시드 바꿔서 돌리기)
2. 마음에 드는 샷을 선택한 뒤 **ffmpeg**로 루프 구간 트림 + fade 추가
3. WebM(VP9)로 인코딩해서 `videos/` 폴더에 넣기 — 이때 파일 스펙:
   - 1920×1080, 24fps, 2–3 Mbps VP9
   - `ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 2500k -vf "scale=1920:1080" -an output.webm`
4. 기존 영상처럼 `<video autoPlay muted loop playsInline>` 으로 재생

생성 후 완성된 mp4/mov 파일을 주시면 제가 webm으로 트랜스코딩하고 히어로에 교체해드립니다.

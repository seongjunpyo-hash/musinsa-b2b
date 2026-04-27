# Supabase 연동 셋업 가이드

이 문서를 따라하면 약 30~40분 안에 두 HTML 파일이 Supabase와 연결되어 모든 사용자가 같은 데이터를 보게 됩니다.

---

## 1단계: Supabase 계정 만들기 (5분)

1. https://supabase.com 접속 → **Start your project** 또는 **Sign In**
2. GitHub 계정 또는 이메일로 가입
3. 가입 후 **New Project** 클릭

---

## 2단계: 프로젝트 생성 (5분)

1. **Organization**: 본인 organization 선택 (없으면 자동 생성됨)
2. **Project name**: `musinsa-b2b` (자유롭게)
3. **Database Password**: 강력한 비밀번호 생성 후 **반드시 별도로 메모** (DB 직접 접속용)
4. **Region**: `Northeast Asia (Seoul)` 추천 (가장 빠름)
5. **Pricing Plan**: `Free` 선택
6. **Create new project** 클릭

→ 약 2분 정도 셋업 진행됨

---

## 3단계: 테이블 만들기 (5분)

1. 좌측 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. 이 폴더의 [`schema.sql`](./schema.sql) 파일 내용을 전체 복사
4. SQL Editor에 붙여넣기
5. 우측 하단 **Run** 버튼 클릭
6. "Success. No rows returned" 메시지 확인

→ 좌측 **Table Editor** 클릭하면 `products`, `partners`, `orders`, `display_settings`, `exchange_rate` 테이블이 생긴 게 보임

---

## 4단계: 시드 데이터 넣기 (5분)

### 방법 A: SQL로 한 번에 넣기 (권장)

1. **SQL Editor** → **New query**
2. 이 폴더의 [`seed.sql`](./seed.sql) 내용 복사 → 붙여넣기 → **Run**
3. "Success" 확인

### 방법 B: JSON 파일로 import

1. **Table Editor** → 각 테이블 선택 → **Insert** → **Import data from CSV**
2. (CSV 변환이 필요해서 방법 A가 훨씬 편함)

### 확인
**Table Editor**에서 각 테이블 클릭 → 데이터가 들어있는지 확인:
- `products`: 42개 행
- `partners`: 3개 행
- `orders`: 4개 행
- `display_settings`: 1개 행 (싱글톤)
- `exchange_rate`: 1개 행 (싱글톤)

---

## 5단계: API 키 가져오기 (2분)

1. 좌측 메뉴 **Project Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 선택
3. 아래 두 값을 복사해서 메모장에 보관:
   - **Project URL**: `https://xxxxxxxx.supabase.co` 형태
   - **anon (public) key**: `eyJhbGciOiJIUzI1NiIs...` 형태 (긴 토큰)

> ⚠️ `service_role` 키는 클라이언트에 절대 사용하면 안 됩니다. 반드시 **anon (public)** 키만 사용하세요.

---

## 6단계: 보안 정책 설정 (5분)

지금은 누구나 데이터를 읽고 쓸 수 있는 상태입니다 (개발 / 데모용). 운영 단계에선 인증 시스템이 필요하지만, 현재는 데모/내부 테스트용이므로 다음 정책을 적용합니다:

1. **SQL Editor** → **New query**
2. 이 폴더의 [`rls-policies.sql`](./rls-policies.sql) 내용 복사 → 붙여넣기 → **Run**

> 이 정책은 "anon 키로 누구나 R/W 가능"입니다. 데모/내부 테스트에 적합하지만, 외부에 공개하면 누구나 데이터를 수정할 수 있으니 주의하세요. 운영 단계에서는 Supabase Auth 도입 + 사용자별 RLS 정책 설정이 필요합니다.

---

## 7단계: 미디어 저장 버킷 만들기 (필수 — 영상/이미지 업로드용)

전시 설정에서 영상/이미지 업로드 시 Supabase Storage에 저장됩니다. **버킷 미설정 시 영상은 다른 사용자에게 동기화되지 않습니다.**

1. 좌측 메뉴 **Storage** 클릭
2. **New bucket** 클릭
3. **Name**: `media` (정확히 이 이름)
4. **Public bucket**: ✅ 체크 (반드시 — 외부에서 영상/이미지 재생 위해)
5. **Create bucket**

**버킷 정책 추가 (anon 사용자가 업로드/읽기 가능하도록):**

1. 만든 `media` 버킷 클릭 → **Configuration** 탭 → **Policies** 섹션
2. **New policy** → **For full customization**
3. 다음 두 정책 각각 추가:

**Policy 1 — Anon 읽기 허용:**
- Policy name: `anon_read`
- Allowed operation: `SELECT`
- Target roles: `anon`, `authenticated`
- Policy definition: `true`

**Policy 2 — Anon 업로드 허용 (데모용):**
- Policy name: `anon_write`
- Allowed operation: `INSERT`, `UPDATE`, `DELETE`
- Target roles: `anon`
- Policy definition: `true`

> 데모/내부 운영용 정책입니다. 운영 단계에선 인증된 어드민만 업로드 가능하도록 제한 필요.

이 단계 안 하면: 이미지/영상 파일 선택 시 "Storage 업로드 실패" 토스트가 뜨고, 외부 URL 직접 입력 방식만 가능합니다.

---

## 8단계: HTML 파일에 키 입력 (2분)

`b2b-admin-console.html` 과 `b2b-partner-portal.html` 두 파일 모두에서:

1. 파일 상단의 다음 부분을 찾기:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```
2. 5단계에서 메모한 값으로 교체:
   ```javascript
   const SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...';
   ```
3. 저장

---

## 9단계: 테스트 (3분)

1. `b2b-admin-console.html` 브라우저에서 열기
2. 우상단 헤더에 작은 인디케이터 확인:
   - 🟢 녹색 점 = Supabase 연결됨, 데이터 동기화 중
   - 🟡 노란 점 = 로컬 데이터만 사용 중 (Supabase 미설정 또는 네트워크 오류)
3. 상품 하나 추가/수정
4. 다른 브라우저(또는 시크릿 창)에서 같은 URL 열기 → 같은 데이터 보이는지 확인
5. 한쪽에서 데이터 수정 → 다른 쪽 탭에서 약 1~2초 후 반영되는지 확인

---

## 동작 방식 (참고)

이 통합은 **하이브리드 방식**으로 동작합니다:

1. **로딩 시점**: localStorage에서 즉시 표시 (빠름) → Supabase에서 받아오면 덮어쓰기 (최신 데이터로 업데이트)
2. **저장 시점**: localStorage + Supabase 둘 다 저장 (둘 중 하나라도 작동하면 OK)
3. **Supabase가 실패하면**: 자동으로 localStorage만 사용 (앱이 멈추지 않음)
4. **다른 사용자의 변경**: 약 5초마다 Supabase 폴링하여 자동 반영

---

## 자주 묻는 질문

### Q. 무료로 얼마나 쓸 수 있나요?
- DB 500MB
- 5GB 트래픽/월
- Storage 1GB
- 50,000 monthly active users
- → 데모 / 소규모 운영에는 충분

### Q. 비밀번호를 잊어버렸어요
- Project Settings → Database → Reset database password

### Q. anon 키가 외부에 노출되면 어떻게 되나요?
- anon 키는 공개 키라 노출돼도 무방하지만, RLS 정책이 약하면 누구나 데이터 조작 가능
- 운영에서는 RLS 정책을 사용자별로 엄격히 설정해야 함

### Q. 백엔드 개발자에게 넘길 때
- Supabase 프로젝트의 organization 권한을 개발자에게 추가 (Settings → Team)
- 또는 백엔드 개발자가 자체 Supabase/PostgreSQL로 마이그레이션 (스키마 동일하므로 쉬움)

### Q. 데이터를 다 지우고 다시 시드 넣고 싶어요
- SQL Editor에서:
  ```sql
  TRUNCATE products, partners, orders, display_settings, exchange_rate CASCADE;
  ```
- 그 다음 다시 `seed.sql` 실행

### Q. 로컬에서만 작업하고 싶을 때
- HTML 파일에서 `SUPABASE_URL`을 비워두면 → 자동으로 localStorage만 사용 (기존 동작)

---

## 트러블슈팅

### "Failed to fetch" 에러
- 인터넷 연결 확인
- Supabase URL이 정확한지 확인
- 프로젝트가 일시 정지되지 않았는지 확인 (무료 플랜은 7일 미사용 시 일시 정지됨)

### "permission denied for table"
- RLS 정책이 적용되지 않음 → 6단계의 `rls-policies.sql` 다시 실행

### 데이터가 동기화 안 됨
- 브라우저 콘솔 (F12) 열어서 에러 메시지 확인
- 네트워크 탭에서 Supabase 요청이 실제로 가는지 확인
- localStorage / sessionStorage에 데이터가 남아있어 새 데이터를 덮어쓰지 못 할 수 있음 → 시크릿 창에서 테스트

---

## 다음 단계 권장

1. **Supabase Auth 도입** — 어드민 / 파트너 로그인을 Supabase Auth로
2. **Storage 활용** — 상품 이미지 업로드를 Supabase Storage로
3. **Edge Functions** — 복잡한 비즈니스 로직 (반려 시 이메일 발송 등)
4. **Realtime** — 폴링 대신 실시간 push 구독으로 업그레이드

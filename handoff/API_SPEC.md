# API 명세

REST 기반 권장. 모든 응답은 JSON.

## 공통 사항

### Base URL (예시)
- dev: `https://api-dev.musinsa-b2b.com`
- staging: `https://api-staging.musinsa-b2b.com`
- production: `https://api.musinsa-b2b.com`

### 인증
- `Authorization: Bearer <JWT>` 헤더
- 토큰 만료 시 `401` 반환, 클라이언트는 재로그인 처리
- 권한 체크: 어드민 / 파트너 분리, 파트너는 본인 데이터만 접근

### 공통 응답 포맷

성공:
```json
{ "data": <결과>, "meta": { "page": 1, "total": 100 } }
```

에러:
```json
{
  "error": {
    "code": "PARTNER_DUPLICATE",
    "message": "이미 등록된 파트너입니다.",
    "field": "company_name"
  }
}
```

### HTTP 상태 코드 가이드
- `200` 성공 (조회/수정)
- `201` 생성 성공
- `204` 삭제 성공 (응답 본문 없음)
- `400` 검증 실패 (필수 필드 누락, 형식 오류)
- `401` 인증 실패 (토큰 없음/만료)
- `403` 권한 없음
- `404` 리소스 없음
- `409` 충돌 (중복 등록 등)
- `500` 서버 오류

---

## 1. 인증 (Auth)

### POST `/api/auth/admin/login`
어드민 로그인.

**Request**
```json
{ "email": "admin@musinsa.com", "password": "..." }
```

**Response 200**
```json
{
  "data": {
    "token": "eyJhbGc...",
    "user": { "id": "u_001", "email": "admin@musinsa.com", "role": "super_admin", "name": "관리자" }
  }
}
```

### POST `/api/auth/partner/login`
파트너 로그인.

**Request**
```json
{ "email": "partner@bangkok.com", "password": "..." }
```

**Response 200**
```json
{
  "data": {
    "token": "eyJhbGc...",
    "partner": { "partner_id": "PTR-001", "company_name": "Bangkok Trading Co.", "email": "...", "discount_rate": 0.30 }
  }
}
```

**Response 403** (`is_active=false` 일 때)
```json
{ "error": { "code": "PARTNER_INACTIVE", "message": "비활성화된 파트너입니다." } }
```

### POST `/api/auth/logout`
로그아웃 (토큰 무효화).

---

## 2. Products

### GET `/api/products`
상품 목록.

**Query Parameters**
- `category` — 대분류 필터
- `gender` — 성별 필터
- `is_visible` — 노출 상태 (true/false/all)
- `search` — 상품명 / 스타일번호 검색
- `page`, `limit` — 페이지네이션

**Response 200**
```json
{
  "data": [ /* Product[] */ ],
  "meta": { "page": 1, "limit": 50, "total": 43 }
}
```

### GET `/api/products/:id`
상품 단건 조회.

### POST `/api/products`
상품 등록 (어드민만).

**Request**
```json
{
  "style_no": "MSSTD-JK01",
  "name": "Light Windbreaker Jacket",
  "color": "BLACK",
  "colors_list": ["BLACK", "NAVY"],
  "material": "Nylon 100%",
  "origin": "Vietnam",
  "category": "Outerwear",
  "sub_category": "Windbreaker",
  "retail_price_krw": 89000,
  "ship_date": "2026-10-15",
  "season": { "year": 2026, "season": "F/W" },
  "gender": "Male",
  "sizes": ["XS","S","M","L","XL"],
  "images": ["url1", "url2"],
  "is_visible": true,
  "is_hero": false,
  "hs_code": "6201.93",
  "sample_size": "M"
}
```

**Response 201** — 생성된 Product (`id` 자동 부여)

**검증 오류 (400)**
- 필수 필드 누락
- `discount_rate` 범위 오류 등

### PATCH `/api/products/:id`
상품 수정 (어드민만). 부분 업데이트 (보낸 필드만 갱신).

### DELETE `/api/products/:id`
상품 삭제 (어드민만).

### PATCH `/api/products/bulk`
일괄 정보 변경.

**Request**
```json
{
  "ids": ["P-001", "P-002", "P-005"],
  "changes": { "is_visible": false }
}
```

### DELETE `/api/products/bulk`
일괄 삭제.

**Request**
```json
{ "ids": ["P-001", "P-002"] }
```

### POST `/api/products/import`
엑셀(.xlsx) 일괄 업로드.

**Request**: `multipart/form-data`, file=업로드 파일
- 컬럼: 상품번호 / 스타일번호 / 상품명 / ... (시안의 다운로드 양식 참고)

**Response 200**
```json
{
  "data": {
    "created": 12,
    "updated": 3,
    "errors": [
      { "row": 5, "field": "retail_price_krw", "message": "숫자 형식 오류" }
    ]
  }
}
```

### GET `/api/products/export`
엑셀 다운로드. 필터 파라미터 동일.

---

## 3. Orders

### GET `/api/orders`
주문 목록. 어드민은 전체, 파트너는 본인 것만.

**Query Parameters**
- `status` — `주문접수` / `주문완료` / `반려` / `주문취소` / `전체`
- `partner_id` — 파트너 필터 (어드민만)
- `from`, `to` — 주문일 범위 (`YYYY-MM-DD`)
- `search` — 주문번호 / 파트너명 검색
- `page`, `limit`, `sort` (기본: `created_at desc`)

**Response 200**
```json
{
  "data": [ /* Order[] */ ],
  "meta": { "page": 1, "limit": 50, "total": 8 }
}
```

### GET `/api/orders/:order_id`
주문 단건 조회 (items 포함).

### POST `/api/orders`
주문 생성 (파트너).

**Request**
```json
{
  "items": [
    { "productId": "P-001", "color": "BLACK", "size": "M", "qty": 50 }
  ]
}
```
> `unit_price`, `subtotal`은 백엔드에서 계산 (현재 환율 + 파트너 할인율 기준).

**Response 201** — 생성된 Order (`order_id` 자동 부여, `status: "주문접수"`).

**검증 오류 (400)**
- 빈 items
- 존재하지 않는 productId / color / size
- qty <= 0
- 비활성 파트너

### POST `/api/orders/bulk`
엑셀 업로드로 주문 일괄 생성.

**Request**: multipart/form-data, file
- 양식: 시안의 주문 일괄 업로드 양식 참고

### PATCH `/api/orders/:order_id/approve`
주문 승인 (어드민만).

**Request**
```json
{ }
```

**Response 200** — 업데이트된 Order (`status: "주문완료"`).

**제약**
- 현재 `status: "주문접수"` 인 경우만 가능
- 다른 상태일 시 `409 ORDER_NOT_PENDING`

### PATCH `/api/orders/:order_id/reject`
주문 반려 (어드민만).

**Request**
```json
{
  "reason": "재고 부족으로 일부 사이즈 미공급",
  "suggested_items": [ /* OrderItem[]; 선택 */ ]
}
```

**Response 200** — 업데이트된 Order (`status: "반려"`, `rejection_reason` 포함).

### PATCH `/api/orders/:order_id/cancel`
주문 취소 (파트너만, 본인 주문만).

**제약**
- `status: "주문접수"` 일 때만 가능 (승인 후엔 취소 불가)

### POST `/api/orders/bulk/approve`
일괄 승인.

**Request**
```json
{ "order_ids": ["ORD-2026-0001", "ORD-2026-0002"] }
```

### POST `/api/orders/bulk/reject`
일괄 반려.

**Request**
```json
{ "order_ids": [...], "reason": "..." }
```

### GET `/api/orders/:order_id/export`
단일 주문 엑셀 다운로드 (어드민/파트너 본인).

### POST `/api/orders/export`
선택한 주문들 엑셀 다운로드.

**Request**
```json
{ "order_ids": [...] }
```

---

## 4. Partners

### GET `/api/partners`
파트너 목록 (어드민만).

**Query**: `is_active`, `search`, `page`, `limit`

### GET `/api/partners/:partner_id`
파트너 단건. 어드민 또는 본인.

### POST `/api/partners`
파트너 등록 (어드민만).

**Request**
```json
{
  "company_name": "Bangkok Trading Co.",
  "email": "partner@bangkok.com",
  "discount_rate": 0.30,
  "password": "초기 비밀번호"
}
```

**검증**
- `company_name` 중복 → `409 DUPLICATE_COMPANY_NAME`
- `email` 중복 → `409 DUPLICATE_EMAIL`
- `discount_rate` 범위 오류 → `400`

### PATCH `/api/partners/:partner_id`
파트너 수정 (어드민만).

### DELETE `/api/partners/:partner_id`
파트너 삭제 (어드민만).

> 운영 권장: hard delete 대신 soft delete (`is_active=false` + `deleted_at` 기록). 과거 주문 참조 무결성 유지.

### PATCH `/api/partners/:partner_id/toggle-active`
파트너 활성/비활성 토글 (어드민만).

---

## 5. Display Settings

### GET `/api/display-settings`
전시 설정 전체 조회 (파트너/어드민 모두).

### PATCH `/api/display-settings`
전시 설정 수정 (어드민만).

**Request** (부분 업데이트 가능)
```json
{
  "categoryOrder": { "Outerwear": ["P-001", "P-007", ...] },
  "newProducts": ["P-033", "P-038"],
  "heroProducts": ["P-001", "P-002"],
  "bannerSlots": {
    "male": { "image": "...", "title": "MALE", "subtitle": "...", "link": "..." }
  }
}
```

---

## 6. Exchange Rate

### GET `/api/exchange-rate`
현재 환율.

**Response**
```json
{ "data": { "krw_per_usd": 1350.00, "effective_date": "2026-04-01" } }
```

### PATCH `/api/exchange-rate`
환율 업데이트 (어드민만).

**Request**
```json
{ "krw_per_usd": 1380.00, "effective_date": "2026-05-01" }
```

> 권장: 변경 이력 자동 기록 (`exchange_rate_history` 테이블).

---

## 7. Uploads (이미지)

### POST `/api/uploads/image`
이미지 파일 업로드.

**Request**: multipart/form-data
- `file`: 이미지 파일 (jpg/png/webp, 최대 5MB 권장)
- `purpose`: `product` / `banner` / `other`

**Response 201**
```json
{
  "data": {
    "url": "https://cdn.example.com/products/abc123.webp",
    "width": 1200,
    "height": 1600,
    "size": 234567
  }
}
```

> 권장: 업로드 시 자동 리사이즈 / 포맷 변환 (webp 변환).

---

## 8. Dashboard / Statistics

### GET `/api/dashboard/summary`
대시보드 KPI.

**Response**
```json
{
  "data": {
    "products": { "total": 43, "visible": 40, "hidden": 3 },
    "orders": { "pending": 5, "completed": 12, "rejected": 2, "cancelled": 1 },
    "totalAmount": 28450.50,
    "partners": 8
  }
}
```

### GET `/api/dashboard/popular-products`
인기 상품 TOP N.

**Query**
- `month` — `YYYY-MM`
- `week` — 1~5 (해당 월의 N주차, 생략 시 전체)
- `limit` — 기본 7

**Response**
```json
{
  "data": [
    {
      "id": "P-031",
      "name": "Oversized Essential White Tee",
      "style_no": "M-TEE-OVR31",
      "category": "Tops",
      "image": "https://...",
      "qty": 240
    }
  ]
}
```

### GET `/api/dashboard/recent-orders`
최근 주문 N건.

### GET `/api/dashboard/partner-orders`
파트너별 주문 합계 (도넛 차트용).

**Query**: `month` 등

**Response**
```json
{
  "data": [
    { "partner_id": "PTR-001", "name": "Bangkok Trading Co.", "amount": 12450.50, "qty": 320 }
  ]
}
```

---

## 9. Order Settings (수주회 상태)

### GET `/api/order-settings`
주문 가능 여부 / 기간.

**Response**
```json
{
  "data": {
    "enabled": true,
    "start_at": "2026-04-01T09:00:00",
    "end_at": "2026-04-30T18:00:00"
  }
}
```

### PATCH `/api/order-settings`
어드민만.

---

## 10. Real-time / Sync (선택)

### Option A: Polling
어드민 / 파트너가 1~5초 간격으로 `/api/orders/recent`, `/api/orders/changes-since=...` 호출.

### Option B: WebSocket
- 신규 주문 시 어드민에게 푸시
- 주문 상태 변경 시 해당 파트너에게 푸시

```
WS /api/ws
events:
  - order.created
  - order.approved
  - order.rejected
  - order.cancelled
```

### Option C: Server-Sent Events (SSE)
간단한 단방향 푸시.

---

## 11. 에러 코드 (제안)

| 코드 | HTTP | 설명 |
|---|---|---|
| `UNAUTHORIZED` | 401 | 토큰 없음/만료 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `PARTNER_INACTIVE` | 403 | 비활성 파트너 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `DUPLICATE_COMPANY_NAME` | 409 | 중복 회사명 |
| `DUPLICATE_EMAIL` | 409 | 중복 이메일 |
| `DUPLICATE_PRODUCT_ID` | 409 | 중복 상품번호 |
| `ORDER_NOT_PENDING` | 409 | 주문이 처리 가능한 상태 아님 |
| `INVALID_DISCOUNT_RATE` | 400 | 할인율 범위 오류 |
| `INVALID_QTY` | 400 | 수량 0 이하 |
| `INVALID_FILE_FORMAT` | 400 | 엑셀/이미지 형식 오류 |
| `FILE_TOO_LARGE` | 400 | 파일 크기 초과 |
| `VALIDATION_ERROR` | 400 | 일반 검증 실패 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |

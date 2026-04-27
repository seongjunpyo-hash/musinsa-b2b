# 데이터 모델 명세

## 엔티티 관계도 (ERD)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Partner   │ 1     N │    Order    │ 1     N │  OrderItem  │
│             ├────────►│             ├────────►│             │
└─────────────┘         └─────────────┘         └──────┬──────┘
                                                       │ N
                                                       │
                                                       ▼ 1
                                                ┌─────────────┐
                                                │   Product   │
                                                │             │
                                                └─────────────┘

┌──────────────┐
│ DisplaySetting│ (singleton)
└──────────────┘

┌──────────────┐
│ ExchangeRate │ (singleton)
└──────────────┘
```

---

## 1. Product

상품 카탈로그 엔티티.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | string | ✓ | 상품 ID. 형식: `P-XXX` (3자리 0패딩). 자동 증가 |
| `style_no` | string | ✓ | 스타일 번호. 사람이 읽는 식별자 (예: `MSSTD-JK01`) |
| `name` | string | ✓ | 상품명 (영문) |
| `color` | string | ✓ | 대표 컬러명 (예: `BLACK`, `NAVY/CREAM`) |
| `colors_list` | string[] | – | 컬러 옵션 배열. 없으면 `color`를 콤마 분리하여 사용 |
| `material` | string | ✓ | 소재 (예: `Cotton 100%`, `Polyester 80% Wool 20%`) |
| `origin` | string | ✓ | 원산지 (예: `Korea`, `Vietnam`) |
| `category` | enum | ✓ | 대분류. `Outerwear` / `Tops` / `Pants` / `Bottoms` / `Skirts` / `Dresses` / `Shoes` / `Bags` / `Accessories` |
| `sub_category` | string | – | 중분류 (예: `Windbreaker`, `T-Shirt`, `Knit`) |
| `retail_price_krw` | number | ✓ | 한국 소매가 (원) — 정수 |
| `sample_size` | string | – | 샘플 사이즈 (예: `M`, `L`, `FREE`) |
| `hs_code` | string | – | HS 코드 (관세 분류 코드) |
| `ship_date` | date(YYYY-MM-DD) | ✓ | 출고 예정일 |
| `is_visible` | boolean | ✓ | 파트너 포털 노출 여부 |
| `is_hero` | boolean | – | HERO 상품 여부 (기본 메인 노출 후보) |
| `season` | object | ✓ | `{ year: number, season: string }` — 시즌. `season` ∈ `S/S` / `F/W` / `Special` / `Carry Over`. Carry Over면 year=0 |
| `gender` | enum | ✓ | `Male` / `Female` / `Kids` / `Accessories` |
| `images` | string[] | ✓ | 이미지 URL 배열 (최소 1개) |
| `sizes` | string[] | ✓ | 사이즈 배열 (예: `["XS","S","M","L","XL"]`, `["FREE"]`) |
| `created_at` | timestamp | – | 등록 일시 |
| `updated_at` | timestamp | – | 수정 일시 |

### 예시 JSON

```json
{
  "id": "P-001",
  "style_no": "MSSTD-JK01",
  "name": "Light Windbreaker Jacket",
  "color": "BLACK",
  "colors_list": ["BLACK", "NAVY"],
  "material": "Nylon 100%",
  "origin": "Vietnam",
  "category": "Outerwear",
  "sub_category": "Windbreaker",
  "retail_price_krw": 89000,
  "sample_size": "M",
  "hs_code": "6201.93",
  "ship_date": "2026-10-15",
  "is_visible": true,
  "is_hero": true,
  "season": { "year": 2026, "season": "F/W" },
  "gender": "Male",
  "images": [
    "https://cdn.example.com/p001-1.webp",
    "https://cdn.example.com/p001-2.webp"
  ],
  "sizes": ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"]
}
```

---

## 2. Partner

파트너사(바이어) 엔티티.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `partner_id` | string | ✓ | 파트너 ID. 형식: `PTR-XXX` (3자리 0패딩) |
| `company_name` | string | ✓ | 회사명. 시스템 내 unique |
| `email` | string | ✓ | 이메일. 로그인 ID. unique |
| `password_hash` | string | ✓ (운영) | 비밀번호 해시 (현재 시안 미구현) |
| `discount_rate` | number | ✓ | 할인율. 0.00 ~ 1.00 (소수). 화면에선 % 표시 |
| `is_active` | boolean | ✓ | 로그인 가능 여부. `false`면 차단 |
| `created_at` | date(YYYY-MM-DD) | ✓ | 등록일 |
| `updated_at` | timestamp | – | 수정 일시 |

### 검증 규칙
- `company_name`: 중복 등록 불가
- `email`: 중복 등록 불가, 이메일 형식 검증
- `discount_rate`: 1~100 정수 (% 단위로 입력받아 ÷100으로 저장)

### 예시 JSON

```json
{
  "partner_id": "PTR-001",
  "company_name": "Bangkok Trading Co.",
  "email": "partner@bangkok.com",
  "discount_rate": 0.30,
  "is_active": true,
  "created_at": "2024-01-15"
}
```

---

## 3. Order

주문 엔티티.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `order_id` | string | ✓ | 주문 ID. 형식: `ORD-YYYY-XXXX` (예: `ORD-2026-0001`) |
| `partner_id` | string | ✓ | 주문한 파트너 ID (FK) |
| `partner_name` | string | ✓ | 파트너 회사명 (denormalized) |
| `status` | enum | ✓ | `주문접수` / `주문완료` / `반려` / `주문취소` |
| `rejection_reason` | string\|null | – | 반려 사유. status=`반려`일 때만 사용 |
| `suggested_items` | OrderItem[]\|null | – | Admin 제안 수정 주문안. 반려 시 첨부 가능 |
| `items` | OrderItem[] | ✓ | 주문 항목 배열 (아래 OrderItem 참고) |
| `total_qty` | number | ✓ | 총 수량 (items 합계, denormalized) |
| `total_amount` | number | ✓ | 총 금액 USD (items 합계, denormalized) |
| `created_at` | timestamp | ✓ | 주문 생성 시각 |
| `updated_at` | timestamp | ✓ | 마지막 상태 변경 시각 |

### 상태 전이
```
[주문접수] ──승인──► [주문완료]
    │
    └──반려──► [반려]
    │
    └──취소──► [주문취소]   (파트너만 가능, 주문완료 후엔 불가)
```

### 예시 JSON

```json
{
  "order_id": "ORD-2026-0001",
  "partner_id": "PTR-001",
  "partner_name": "Bangkok Trading Co.",
  "status": "주문접수",
  "rejection_reason": null,
  "suggested_items": null,
  "items": [
    {
      "productId": "P-001",
      "color": "BLACK",
      "size": "M",
      "qty": 50,
      "unit_price": 14.10,
      "subtotal": 705.00,
      "product": { /* Product 객체 스냅샷 */ }
    }
  ],
  "total_qty": 150,
  "total_amount": 4650.00,
  "created_at": "2026-04-10T09:30:00",
  "updated_at": "2026-04-10T09:30:00"
}
```

---

## 4. OrderItem (서브 엔티티)

주문 안의 한 행 (한 SKU = product × color × size).

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `productId` | string | ✓ | Product.id |
| `color` | string | ✓ | 컬러명 |
| `size` | string | ✓ | 사이즈 (예: `M`, `XL`, `FREE`) |
| `qty` | number | ✓ | 수량. 양의 정수 |
| `unit_price` | number | ✓ | 단가 (USD). 주문 시점의 홀세일가 (스냅샷) |
| `subtotal` | number | ✓ | `qty × unit_price`. 소수점 둘째 자리까지 |
| `product` | object | – | Product 스냅샷 (이름/이미지/style_no 등 표시용) |

> **중요**: `unit_price`는 주문 시점에 계산해서 고정해야 합니다. 이후 환율이나 할인율이 바뀌어도 기존 주문 금액은 변하지 않아야 합니다.

---

## 5. ExchangeRate (싱글톤)

KRW ↔ USD 환율 설정.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `krw_per_usd` | number | ✓ | 1 USD = N KRW (예: 1350.00) |
| `effective_date` | date | ✓ | 적용 시작일 |
| `updated_at` | timestamp | – | 수정 일시 |
| `updated_by` | string | – | 수정자 (admin user id) |

### 예시
```json
{
  "krw_per_usd": 1350.00,
  "effective_date": "2026-04-01"
}
```

> **고려사항**: 과거 환율 이력 관리가 필요할 수 있음 (감사/회계 목적). 별도 `exchange_rate_history` 테이블 권장.

---

## 6. DisplaySetting (싱글톤)

전시 설정. 파트너 메인 페이지 노출 순서/배너.

| 필드 | 타입 | 설명 |
|---|---|---|
| `categoryOrder` | object | `{ "Outerwear": ["P-001", "P-007", ...], ... }` — 카테고리별 노출 순서 |
| `newProducts` | string[] | NEW 섹션 노출 상품 ID 배열 (최대 5개 권장) |
| `heroProducts` | string[] | HERO 섹션 노출 상품 ID 배열 (최대 5개 권장) |
| `bannerSlots` | object | 메인 배너 5종. 키: `male`, `female`, `kids`, `accessories`, `special` |

### bannerSlots 각 슬롯
```json
{
  "image": "https://cdn.example.com/banner-male.png",
  "title": "MALE",
  "subtitle": "COLLECTION",
  "link": "/products?gender=Male"
}
```

---

## 7. AdminUser (운영 시 추가 필요)

현재 시안은 단일 어드민이지만 운영에서는 다중 어드민 + 권한 분리 필요.

| 필드 | 타입 | 설명 |
|---|---|---|
| `user_id` | string | unique |
| `email` | string | 로그인 ID |
| `password_hash` | string | bcrypt 등 |
| `name` | string | 표시 이름 |
| `role` | enum | `super_admin` / `operator` / `viewer` 등 |
| `is_active` | boolean | 비활성 처리 |
| `last_login_at` | timestamp | – |
| `created_at` | timestamp | – |

---

## 8. AuditLog (운영 시 추가 권장)

주요 변경 사항 감사 로그.

| 필드 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | – |
| `user_id` | string | 행위자 (admin or partner) |
| `actor_type` | enum | `admin` / `partner` / `system` |
| `action` | string | `order.approve`, `order.reject`, `partner.delete`, `product.update` 등 |
| `entity_type` | string | `order` / `product` / `partner` |
| `entity_id` | string | – |
| `before` | json | 변경 전 스냅샷 |
| `after` | json | 변경 후 스냅샷 |
| `metadata` | json | 추가 정보 (ex: 반려 사유, IP 등) |
| `created_at` | timestamp | – |

---

## 9. 인덱스 / 검색 권장

### Product
- `id`, `style_no` — unique
- `category`, `gender`, `season.year` — 필터링
- 풀텍스트 검색: `name`, `style_no`

### Order
- `order_id` — unique
- `partner_id`, `status`, `created_at` — 필터링
- 복합: `(partner_id, status, created_at DESC)`

### Partner
- `partner_id`, `email`, `company_name` — unique

---

## 10. 데이터 마이그레이션 노트

시안 데이터에서 운영 DB로 이전 시:

- `colors_list`가 없는 레거시 상품: `color`를 콤마 분리해서 채워 넣기
- `images` 배열의 base64 데이터: 별도 호스팅에 업로드 후 URL로 교체
- `MOCK_*` 데이터는 [`seed-data/`](./seed-data/) 디렉토리에 정리되어 있음

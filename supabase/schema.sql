-- ============================================================
-- MUSINSA Global B2B - Supabase Schema
-- 실행 위치: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 기존 테이블 제거 (재실행 시 안전)
drop table if exists orders cascade;
drop table if exists products cascade;
drop table if exists partners cascade;
drop table if exists display_settings cascade;
drop table if exists exchange_rate cascade;

-- ============================================================
-- 1. partners (파트너사)
-- ============================================================
create table partners (
  partner_id text primary key,
  company_name text not null,
  email text not null,
  discount_rate numeric not null default 0 check (discount_rate >= 0 and discount_rate <= 1),
  is_active boolean not null default true,
  created_at date not null default current_date,
  updated_at timestamptz not null default now()
);

create unique index partners_company_name_idx on partners (lower(company_name));
create unique index partners_email_idx on partners (lower(email));
create index partners_is_active_idx on partners (is_active);

-- ============================================================
-- 2. products (상품 카탈로그)
-- ============================================================
create table products (
  id text primary key,
  style_no text not null,
  name text not null,
  color text,
  colors_list jsonb,                    -- ["BLACK", "NAVY"]
  material text,
  origin text,
  category text,
  sub_category text,
  retail_price_krw integer not null,
  sample_size text,
  hs_code text,
  ship_date date,
  is_visible boolean not null default true,
  is_hero boolean not null default false,
  season jsonb,                          -- { year: 2026, season: "F/W" }
  gender text,
  images jsonb not null default '[]',    -- ["url1", "url2"]
  sizes jsonb not null default '[]',     -- ["S", "M", "L"]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_category_idx on products (category);
create index products_gender_idx on products (gender);
create index products_is_visible_idx on products (is_visible);
create index products_is_hero_idx on products (is_hero);

-- ============================================================
-- 3. orders (주문)
-- ============================================================
create table orders (
  order_id text primary key,
  partner_id text references partners(partner_id) on delete set null,
  partner_name text not null,            -- denormalized (파트너 삭제돼도 보존)
  status text not null check (status in ('주문접수', '주문완료', '반려', '주문취소')),
  rejection_reason text,
  suggested_items jsonb,                 -- 반려 시 admin 제안안 (OrderItem[])
  items jsonb not null default '[]',     -- OrderItem[] (productId, color, size, qty, unit_price, subtotal)
  total_qty integer not null default 0,
  total_amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_partner_id_idx on orders (partner_id);
create index orders_status_idx on orders (status);
create index orders_created_at_idx on orders (created_at desc);
create index orders_partner_status_idx on orders (partner_id, status, created_at desc);

-- ============================================================
-- 4. display_settings (전시 설정 - 싱글톤)
-- ============================================================
create table display_settings (
  id integer primary key default 1,
  category_order jsonb not null default '{}',
  new_products jsonb not null default '[]',
  hero_products jsonb not null default '[]',
  banner_slots jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- 싱글톤 1행 자동 생성
insert into display_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- 5. exchange_rate (환율 - 싱글톤)
-- ============================================================
create table exchange_rate (
  id integer primary key default 1,
  krw_per_usd numeric not null default 1350,
  effective_date date not null default current_date,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

-- 싱글톤 1행 자동 생성
insert into exchange_rate (id, krw_per_usd, effective_date)
values (1, 1350.00, '2026-04-01') on conflict do nothing;

-- ============================================================
-- 6. updated_at 자동 갱신 트리거
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products for each row execute function set_updated_at();
create trigger partners_updated_at before update on partners for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();
create trigger display_settings_updated_at before update on display_settings for each row execute function set_updated_at();
create trigger exchange_rate_updated_at before update on exchange_rate for each row execute function set_updated_at();

-- 완료 메시지
select 'Schema created successfully. Run seed.sql next.' as status;

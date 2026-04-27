-- ============================================================
-- MUSINSA Global B2B - Row Level Security Policies
-- 데모 / 내부 테스트용: anon 키로 누구나 R/W 가능
-- ============================================================
-- ⚠️ 주의: 이 정책은 외부 공개 시 누구나 데이터 수정 가능.
-- 운영 단계에서는 Supabase Auth + 사용자별 정책으로 교체 필요.
-- ============================================================

-- 모든 테이블에 RLS 활성화
alter table products enable row level security;
alter table partners enable row level security;
alter table orders enable row level security;
alter table display_settings enable row level security;
alter table exchange_rate enable row level security;

-- ============================================================
-- 기존 정책 제거 (재실행 안전)
-- ============================================================
drop policy if exists "anon_read_products"   on products;
drop policy if exists "anon_write_products"  on products;
drop policy if exists "anon_read_partners"   on partners;
drop policy if exists "anon_write_partners"  on partners;
drop policy if exists "anon_read_orders"     on orders;
drop policy if exists "anon_write_orders"    on orders;
drop policy if exists "anon_read_display"    on display_settings;
drop policy if exists "anon_write_display"   on display_settings;
drop policy if exists "anon_read_rate"       on exchange_rate;
drop policy if exists "anon_write_rate"      on exchange_rate;

-- ============================================================
-- products
-- ============================================================
create policy "anon_read_products" on products for select to anon using (true);
create policy "anon_write_products" on products for all to anon using (true) with check (true);

-- ============================================================
-- partners
-- ============================================================
create policy "anon_read_partners" on partners for select to anon using (true);
create policy "anon_write_partners" on partners for all to anon using (true) with check (true);

-- ============================================================
-- orders
-- ============================================================
create policy "anon_read_orders" on orders for select to anon using (true);
create policy "anon_write_orders" on orders for all to anon using (true) with check (true);

-- ============================================================
-- display_settings (싱글톤)
-- ============================================================
create policy "anon_read_display" on display_settings for select to anon using (true);
create policy "anon_write_display" on display_settings for all to anon using (true) with check (true);

-- ============================================================
-- exchange_rate (싱글톤)
-- ============================================================
create policy "anon_read_rate" on exchange_rate for select to anon using (true);
create policy "anon_write_rate" on exchange_rate for all to anon using (true) with check (true);

-- 완료 메시지
select 'RLS policies applied. Demo mode: anyone can read/write.' as status;

-- ============================================================
-- 운영 단계 권장 정책 (참고용 - 위 정책 대체 시)
-- ============================================================
-- 어드민 / 파트너 분리:
--
-- create policy "admin_full_products" on products for all
--   to authenticated using (auth.jwt() ->> 'role' = 'admin');
--
-- create policy "partner_read_visible_products" on products for select
--   to authenticated using (is_visible = true);
--
-- create policy "partner_read_own_orders" on orders for select
--   to authenticated using (partner_id = auth.jwt() ->> 'partner_id');
--
-- create policy "partner_create_own_orders" on orders for insert
--   to authenticated with check (partner_id = auth.jwt() ->> 'partner_id');
--
-- create policy "admin_all_orders" on orders for all
--   to authenticated using (auth.jwt() ->> 'role' = 'admin');
